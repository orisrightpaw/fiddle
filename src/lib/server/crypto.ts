import { generateKeyPair, KeyObject } from 'node:crypto';

export function generateKeypair(): Promise<{ publicKey: KeyObject; privateKey: KeyObject }> {
	return new Promise((resolve, reject) => {
		generateKeyPair('rsa', { modulusLength: 2048 }, (err, publicKey, privateKey) => {
			if (err) return reject(err);
			resolve({ publicKey, privateKey });
		});
	});
}

// Utility functions to standardize our internal key storage paradigm
export function exportKeyObject(key: KeyObject) {
	return key.export().toString('base64');
}
