import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';
import { createSecretKey } from 'node:crypto';

const ACCESS_SECRET = createSecretKey(Buffer.from(building ? 'building' : env.JWT_ACCESS_SECRET));
const REFRESH_SECRET = createSecretKey(Buffer.from(building ? 'building' : env.JWT_ACCESS_SECRET));

interface AccessToken extends JWTPayload {
	user: string;
}

interface RefreshToken extends JWTPayload {
	user: string;
	version: number;
}

export async function createAccessToken(payload: AccessToken) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS512' })
		.setIssuedAt()
		.setExpirationTime('15m')
		.sign(ACCESS_SECRET);
}

export async function verifyAccessToken(token: string) {
	return await jwtVerify(token, ACCESS_SECRET);
}

export async function createRefreshToken(payload: RefreshToken) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS512' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(REFRESH_SECRET);
}

export async function verifyRefreshToken(token: string) {
	return await jwtVerify(token, REFRESH_SECRET);
}
