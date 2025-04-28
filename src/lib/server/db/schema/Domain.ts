import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { db } from '..';
import { eq } from 'drizzle-orm';

export const Domains = table('domains', {
	id: t.text().primaryKey()
});

interface CreateDomainParams {
	id: string;
}

interface FindDomainParams {
	id: string;
}

export async function createDomain(params: CreateDomainParams) {
	try {
		await db.insert(Domains).values({
			id: params.id
		});

		return true;
	} catch (e) {
		console.log(`!! Database insert failed for table Domains !!`);
		console.log(`Domain.id: ${params.id}`);
		console.log(e);
		return false;
	}
}

export async function findDomain(params: FindDomainParams) {
	try {
		return await db.select().from(Domains).where(eq(Domains.id, params.id));
	} catch (e) {
		console.log(`!! Database select failed for table Domains !!`);
		console.log(`Domain.id: ${params.id}`);
		console.log(e);
		return false;
	}
}
