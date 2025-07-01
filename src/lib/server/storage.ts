import { ORIGIN } from '$lib/config.server';

interface PutObjectParams {}

interface GetObjectWriterParams {
	path: string;
	type?: string;
}

interface GetObjectParams {
	path: string;
}

interface DeleteObjectParams {
	path: string;
}

export function getObjectURL(file: string) {
	return `${ORIGIN}/api/v1/file/${file}`;
}

export function putObject(params: PutObjectParams) {}

export function getObjectWriter(params: GetObjectWriterParams) {
	const file = Bun.s3.file(params.path);
	return file.writer({ type: params?.type });
}

export function getObject(params: GetObjectParams) {
	const file = Bun.s3.file(params.path);
	return file.stream();
}

export function deleteObject(params: DeleteObjectParams) {
	const file = Bun.s3.file(params.path);
	return file.delete();
}
