import type { ParseClient, UsingClient } from 'seyfert';

import { Client } from 'seyfert';

import { Riot } from './classes/riot';

const client = new Client() as unknown as UsingClient;
const riot = new Riot();
client.riot = riot;

await riot.start();
await client.start();
await client.uploadCommands({
    cachePath: './.commandCache.json'
});

declare module 'seyfert' {
    interface UsingClient extends ParseClient<Client<true>> {
        riot: Riot;
    }
}
