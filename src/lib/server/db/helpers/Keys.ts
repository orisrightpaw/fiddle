import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { generateKeyPair, KeyObject } from 'node:crypto';
// Schemas
import { Keys } from '$lib/server/db/schema';
// Helpers

interface CreateKeysParams {
	id: string;
	public?: string;
	private?: string;
}

interface FindKeysParams {
	id: string;
}

export function generateKeypair(): Promise<{ publicKey: KeyObject; privateKey: KeyObject }> {
	return new Promise((resolve, reject) => {
		generateKeyPair('rsa', { modulusLength: 2048 }, (err, publicKey, privateKey) => {
			if (err) return reject(err);
			resolve({ publicKey, privateKey });
		});
	});
}

export function exportKeyObject(key: KeyObject) {
	return key.export({ format: 'pem', type: 'pkcs1' }).toString('base64');
}

export async function createKeys(params: CreateKeysParams) {
	if (!params.public) {
		const { publicKey, privateKey } = await generateKeypair();
		params.public = exportKeyObject(publicKey);
		params.private = exportKeyObject(privateKey);
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
