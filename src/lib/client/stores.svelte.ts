interface UserStore {
	authenticated: boolean;
	data: null | {
		name: string;
		username: string;
		email: string;
	};
}

export const user: UserStore = $state({
	authenticated: false,
	data: null
});
