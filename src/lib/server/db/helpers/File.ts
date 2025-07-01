import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
// Schemas
import { Files } from '$lib/server/db/schema';
// Helpers

interface CreateFileParams {
	id: string;
	path: string;
	type: string;
}

interface FindFileParams {
	id: string;
}

interface DeleteFileParams {
	id: string;
}

export async function findFile(params: FindFileParams) {
	try {
		return await db.select().from(Files).where(eq(Files.id, params.id));
	} catch (e) {
		console.log(`!! Database select failed for table Files !!`);
		console.log(`File.id: ${params.id}`);
		console.log(e);
		return false;
	}
}

export async function createFile(params: CreateFileParams) {
	try {
		await db.insert(Files).values({
			id: params.id,
			path: params.path,
			type: params.type,
			uploaded: Date.now()
		});

		return true;
	} catch (e) {
		console.log(`!! Database insert failed for table Files !!`);
		console.log(`File.id: ${params.id}`);
		console.log(e);
		return false;
	}
}

export async function deleteFile(params: DeleteFileParams) {
	try {
		await db.delete(Files).where(eq(Files.id, params.id));

		return true;
	} catch (e) {
		console.log(`!! Database delete failed for table Files !!`);
		console.log(`File.id: ${params.id}`);
		console.log(e);
		return false;
	}
}
