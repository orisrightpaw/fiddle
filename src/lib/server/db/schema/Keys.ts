import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { generateKeypair } from '../../crypto';

export const Keys = table('keys', {
	id: t.text().primaryKey(),
	private: t.text(),
	public: t.text().notNull()
});

interface CreateKeysParams {
	id: string;
	public?: string;
	private?: string;
}

interface FindKeysParams {
	id: string;
}

export async function createKeys(params: CreateKeysParams) {
	if (!params.public) {
		const { publicKey, privateKey } = await generateKeypair();
		params.public = publicKey.export().toString('base64');
		params.private = privateKey.export().toString('base64');
	}

	try {
		await db.insert(Keys).values({
			id: params.id,
			public: params.public,
			private: params.private
		});

		return true;
	} catch (e) {
		console.log(`!! Database insert failed for table Keys !!`);
		console.log(`Keys.id: ${params.id}`);
		console.log(e);
		return false;
	}
}

export async function findKeys(params: FindKeysParams) {
	try {
		return await db.select().from(Keys).where(eq(Keys.id, params.id));
	} catch (e) {
		console.log(`!! Database select failed for table Keys !!`);
		console.log(`Keys.id: ${params.id}`);
		console.log(e);
		return false;
	}
}
