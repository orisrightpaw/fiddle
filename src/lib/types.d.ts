export interface Actor {
	name?: string | null;
	preferredUsername: string;
	domain: string;
	icon?: string | null;
	isCat?: boolean | null;
	summary?: string | null;
}
