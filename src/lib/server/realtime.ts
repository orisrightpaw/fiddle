import { EventEmitter } from 'node:events';

let events = new Map();

export function getRealtime(name: string) {
	if (events.has(name)) return events.get(name);
	const emitter = new EventEmitter();

	events.set(name, emitter);

	return emitter;
}

export function removeRealtime(name: string) {
	return events.delete(name);
}
