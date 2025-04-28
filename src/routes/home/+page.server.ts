import { randomUUIDv7 } from 'bun';

const STATUS_AUTHOR = [
	{
		name: 'Peter Griffin',
		handle: 'president@petoria.gov',
		icon: '/img/demo/users/peter.png'
	},
	{
		name: 'Tim Sweeney',
		handle: 'fortnite',
		icon: '/img/demo/users/tim.jpg'
	}
];

const STATUS_IMAGE = [
	{ src: '/img/demo/attachments/some%20gif.gif', hidden: false },
	{ src: '/img/demo/attachments/this%20thing.jpeg', hidden: false },
	{ src: '/img/demo/attachments/yeah.gif', hidden: true }
];

const STATUS_CONTENT = [
	'#Chinese mode',
	'Hey guys',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
];

export function load() {
	let statuses = [];

	for (let i = 0; i < 50; i++) {
		let image;
		if (Math.floor(Math.random() * 6) === 1)
			image = STATUS_IMAGE[Math.floor(Math.random() * STATUS_IMAGE.length)];

		statuses.push({
			id: randomUUIDv7(),
			author: STATUS_AUTHOR[Math.floor(Math.random() * STATUS_AUTHOR.length)],
			image,
			content: STATUS_CONTENT[Math.floor(Math.random() * STATUS_CONTENT.length)]
		});
	}

	return { statuses };
}
