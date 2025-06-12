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
