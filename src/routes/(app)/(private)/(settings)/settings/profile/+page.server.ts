import { findActor, updateActor } from '$lib/server/db/helpers/Actor.js';
import { createFile, deleteFile, findFile } from '$lib/server/db/helpers/File.js';
import { findUser } from '$lib/server/db/helpers/User.js';
import { deleteObject, getObjectPath, getObjectWriter } from '$lib/server/storage.js';
import { fail, redirect } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { extension } from 'mime-types';

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user?.id) throw redirect(302, '/login');

		const body = await request.formData();
		const file = body.get('file');

		if (file instanceof File) {
			const user = await findUser({ id: locals.user.id });
			if (!user || user.length === 0) throw redirect(302, '/login');

			const actor = await findActor({ id: user[0].actor });
			if (!actor || actor.length === 0) throw redirect(302, '/login');

			if (actor[0].icon) {
				const icon = await findFile({ id: actor[0].icon });
				if (icon && icon.length) {
					const ext = extension(icon[0].type);
					await deleteObject({ path: `avatars/${icon[0].id}.${ext}` });
					await deleteFile({ id: icon[0].id });
				}
			}

			const newFileId = randomUUID();
			const newFileExt = extension(file.type);
			const path = `avatars/${newFileId}.${newFileExt}`;

			await createFile({
				id: newFileId,
				path,
				type: file.type
			});

			const writer = getObjectWriter({
				path,
				type: file.type
			});

			await updateActor({
				id: actor[0].id,
				icon: newFileId
			});

			// @ts-expect-error
			for await (let chunk of file.stream()) {
				const buffer = Buffer.from(chunk as Uint8Array);
				writer.write(buffer);
				await writer.flush();
			}

			await writer.end();

			return { success: true };
		} else return fail(400, { success: false, message: 'File is invalid.' });
	}
};
