export function client() {
	return Bun.s3;
}

export function readFileBuffer(file: string) {
	return client().file(file).arrayBuffer();
}
