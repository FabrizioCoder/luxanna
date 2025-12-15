import type { ParseClient, UsingClient } from 'seyfert';

import { PrismaPg } from '@prisma/adapter-pg';
import { Client } from 'seyfert';

import { PrismaClient } from '../generated/prisma/client';
import { Riot } from './classes/riot';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables.');
}

const client = new Client() as unknown as UsingClient;
const riot = new Riot();
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

client.db = prisma;
client.riot = riot;

await client.db.$connect();
await riot.start();
await client.start();

await client.uploadCommands({
    cachePath: './.commandCache.json'
});

declare module 'seyfert' {
    interface UsingClient extends ParseClient<Client<true>> {
        riot: Riot;
        db: PrismaClient;
    }
}
