import type { JsonLd, JsonLdObj } from 'jsonld/jsonld-spec';

declare module 'jsonld' {
	function expand(document: JsonLd | string): Promise<any>;
	function compact(document: object, context: object): Promise<JsonLd>;
}
