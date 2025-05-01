import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const ActivityTypes = t.pgEnum('ActivityTypes', [
	'Accept',
	'Add',
	'Announce',
	'Arrive',
	'Block',
	'Create',
	'Delete',
	'Dislike',
	'Flag',
	'Follow',
	'Ignore',
	'Invite',
	'Join',
	'Leave',
	'Like',
	'Listen',
	'Move',
	'Offer',
	'Question',
	'Reject',
	'Read',
	'Remove',
	'TentativeReject',
	'TentativeAccept',
	'Travel',
	'Undo',
	'Update',
	'View'
]);
