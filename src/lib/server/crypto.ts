import { createHash, createPrivateKey, createSign, createVerify } from 'node:crypto';
import { findKeys } from './db/schema/Keys';
import { USER_AGENT } from './config';
import { parseDictionary, serializeDictionary } from 'structured-headers';
import { fetchActorAndSave } from './activitypub/instance';

export interface SignParams {
	keyid: string;
	request: Request;
}

interface VerifyParams {
	request: Request;
}

/*
    RFC Signature Algorithms: https://www.iana.org/assignments/http-message-signature/http-message-signature.xhtml#signature-algorithms
    Draft Signature Algorithms: https://datatracker.ietf.org/doc/html/draft-cavage-http-signatures-08#appendix-E.2

    Bun Algorithms: 
    [
        'md4',        'md5',
        'sha1',       'sha224',
        'sha256',     'sha384',
        'sha512',     'sha512-224',
        'sha512-256', 'ripemd160'
    ]

    Node.js Algorithms: 
    [
        'RSA-MD5', 'RSA-RIPEMD160', 'RSA-SHA1', 'ssl3-md5', 
        'RSA-SHA1-2', 'RSA-SHA224', 'RSA-SHA256',
        'RSA-SHA3-224', 'RSA-SHA3-256', 'RSA-SHA3-384',
        'RSA-SHA3-512', 'RSA-SHA384', 'RSA-SHA512',
        'RSA-SHA512/224', 'RSA-SHA512/256', 'RSA-SM3',
        'blake2b512', 'blake2s256', 'id-rsassa-pkcs1-v1_5-with-sha3-224',
        'id-rsassa-pkcs1-v1_5-with-sha3-256', 'id-rsassa-pkcs1-v1_5-with-sha3-384',
        'id-rsassa-pkcs1-v1_5-with-sha3-512', 'md5', 'md5-sha1', 
        'md5WithRSAEncryption', 'ripemd', 'ripemd160', 
        'ripemd160WithRSA', 'rmd160', 'ssl3-sha1'
        'sha1', 'sha1WithRSAEncryption', 'sha224',
        'sha224WithRSAEncryption', 'sha256', 'sha256WithRSAEncryption',
        'sha3-224', 'sha3-256', 'sha3-384', 'sha3-512',
        'sha384', 'sha384WithRSAEncryption', 'sha512',
        'sha512-224', 'sha512-224WithRSAEncryption', 'sha512-256',
        'sha512-256WithRSAEncryption', 'sha512WithRSAEncryption',
        'shake128', 'shake256', 'sm3', 'sm3WithRSAEncryption',
    ]
*/

const ALGORITHMS = {
	// Draft only
	'rsa-sha1': 'RSA-SHA1',
	'rsa-sha256': 'RSA-SHA256',
	'ecdsa-sha256': '',
	// RFC
	'rsa-pss-sha512': '',
	'rsa-v1_5-sha256': '',
	'hmac-sha256': '',
	'ecdsa-p256-sha256': '',
	'ecdsa-p384-sha384': '',
	ed25519: ''
};

export function rfcSign(params: SignParams) {}

export function rfcVerify(params: VerifyParams) {}

/**
 * @deprecated The draft version for HTTP Signatures should never be used unless a server does not support the RFC version.
 */
export async function draftSign(params: SignParams) {
	const keys = await findKeys({ id: params.keyid });
	if (keys === false || keys.length === 0) throw new Error(`Keys '${params.keyid}' not found.`);
	if (keys[0].private === null) throw new Error('Attempting to sign with a remote keypair.');

	const parsedUrl = new URL(params.request.url);
	const clone = params.request.clone();
	const body = Buffer.from(await clone.arrayBuffer());

	params.request.headers.set('date', new Date().toUTCString());
	params.request.headers.set('user-agent', USER_AGENT);

	if (body.length) {
		const hash = createHash('sha256');
		hash.update(Buffer.from(body));
		params.request.headers.set('digest', 'SHA-256=' + hash.digest().toString('base64'));
	}

	let hashtext = '';
	hashtext += `(request-target): ${params.request.method.toLocaleLowerCase()} ${parsedUrl.pathname}\n`;
	hashtext += `host: ${parsedUrl.host}\n`;
	hashtext += `date: ${params.request.headers.get('date')}\n`;
	hashtext += `user-agent: ${params.request.headers.get('user-agent')}\n`;
	if (body.length) hashtext += `digest: ${params.request.headers.get('digest')}\n`;
	if (body.length) hashtext += `content-type: ${params.request.headers.get('content-type')}\n`;
	hashtext = hashtext.trim();

	const headers = hashtext
		.split('\n')
		.map((_) => _.split(':')[0])
		.join(' ');

	const sign = createSign('RSA-SHA256');
	sign.write(hashtext);
	sign.end();
	const signature = sign.sign(createPrivateKey(keys[0].private)).toString('base64');

	const dictionary = serializeDictionary({
		keyid: params.keyid,
		algorithm: 'rsa-sha256',
		headers,
		signature
	});

	params.request.headers.set(
		'signature',
		dictionary.replace('keyid', 'keyId').replaceAll(', ', ',')
	);

	return params.request;
}

/**
 * @deprecated The draft version for HTTP Signatures should never be used unless a server does not support the RFC version.
 */
export async function draftVerify(params: VerifyParams) {
	const signatureHeader = params.request.headers.get('Signature');
	if (!signatureHeader) throw new Error("Missing 'Signature' header.");

	const digestHeader = params.request.headers.get('Digest');
	if (digestHeader) {
		const clone = params.request.clone();
		const givenDigest = digestHeader.substring(digestHeader.indexOf('=') + 1);
		const hash = createHash('sha256');

		hash.update(Buffer.from(await clone.arrayBuffer()));
		const calculatedDigest = hash.digest().toString('base64');

		if (calculatedDigest !== givenDigest)
			throw new Error("'Digest' does not match; Request body has been modified.");
	}

	const dictionary = parseDictionary(signatureHeader.replaceAll('keyId', 'keyid'));
	const keyId = dictionary.get('keyid')?.[0];
	const algorithm = dictionary.get('algorithm')?.[0];
	const headers = dictionary.get('headers')?.[0];
	const signature = dictionary.get('signature')?.[0];

	if (typeof keyId !== 'string') throw new Error("'keyId' in 'Signature' header is invalid.");
	if (typeof algorithm !== 'string')
		throw new Error("'algorithm' in 'Signature' header is invalid.");
	if (typeof headers !== 'string') throw new Error("'headers' in 'Signature' header is invalid.");
	if (typeof signature !== 'string')
		throw new Error("'signature' in 'Signature' header is invalid.");

	let hashtext = '';
	for (let header of headers.split(' ')) {
		if (header === '(request-target)') {
			hashtext += `(request-target): ${params.request.method.toLocaleLowerCase()} ${new URL(params.request.url).pathname}\n`;
			continue;
		}

		hashtext += `${header}: ${params.request.headers.get(header)}\n`;
	}
	hashtext = hashtext.trim();

	let keys: { id: string; private?: string | null; public: string };
	const savedKeys = await findKeys({ id: keyId });
	if (!savedKeys || savedKeys.length === 0) {
		const actor = await fetchActorAndSave(keyId);
		keys = { id: keyId, public: actor.keys.public };
	} else keys = savedKeys[0];

	const verify = createVerify(ALGORITHMS[algorithm as keyof typeof ALGORITHMS]);
	verify.write(hashtext);
	verify.end();

	return verify.verify(keys.public, signature, 'base64');
}
