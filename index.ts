import type { ParseClient } from 'seyfert';

import { RegionGroups, Regions } from 'twisted/dist/constants';
import { Client } from 'seyfert';

import { Riot } from './src/classes/riot';

const client = new Client();

const riot = new Riot(); // Initialize Riot API
await client.start();
await riot.start(); // Start Riot API (fetch versions, etc.)

const acc = await riot.getPlayerAccount('MARCROCK22', 'LAN', RegionGroups.AMERICAS);
const sum = (await riot.getSummonerByPUUID(acc.response.puuid, Regions.LAT_NORTH)).response;
console.log(sum, riot.makeProfileIconUrl(sum.profileIconId));
declare module 'seyfert' {

    interface UsingClient extends ParseClient<Client<true>> { }

}
