import type { NotNull } from 'drizzle-orm';
import { get, readable, type Readable } from 'svelte/store';

export interface UserStore {
	state: 'loggedin' | 'loggedout' | 'waiting';
	data: {
		name: string;
		preferredUsername: string;
		email: string;
		domain: string;
		icon?: string | null;
		isCat?: boolean | null;
	} | null;
}

export const user: UserStore = $state({
	state: 'waiting',
	data: null
});

let eventSource: EventSource | null = $state(null);
export function getEventSource(): Promise<EventSource> {
	return new Promise((resolve, reject) => {
		if (eventSource !== null && eventSource.readyState === EventSource.OPEN)
			return resolve(eventSource);

		const source = new EventSource('/api/v1/realtime', { withCredentials: true });

		resolve(source);

		source.onerror = (ev) => {
			console.error('Realtime diconnected!');
			console.log(ev);

			return (eventSource = null);
		};

		source.onopen = (ev) => {
			eventSource = source;
		};

		source.addEventListener('close', () => source.close());
	});
}
