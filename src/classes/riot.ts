import type { AccountAPIRegionGroups } from 'twisted/dist/constants';
import type { IBaseApiParams } from 'twisted/dist/base/base.utils';
import type { RegionGroups } from 'twisted/dist/constants';
import type { Regions } from 'twisted/dist/constants';

import { RiotApi, LolApi } from 'twisted';

import type { MatchQueryV5DTO } from '../../node_modules/twisted/dist/models-dto/matches/query-v5';

const APIOptions: IBaseApiParams = {
    key: process.env.RIOT_KEY!,
    rateLimitRetryAttempts: 2,
    debug: {
        logTime: true,
        logUrls: true,
        logRatelimits: true
    }
};

if (!APIOptions.key) {
    throw new Error('Riot API key is not set in environment variables (RIOT_KEY)');
}

export class Riot extends LolApi {
    readonly riot = new RiotApi(APIOptions);

    #version = '';

    constructor() {
        super(APIOptions);
    }

    async start() {
        this.#version = (await this.DataDragon.getVersions())[0];
    }

    makeProfileIconUrl(profileIconId: number) {
        // https://ddragon.leagueoflegends.com/cdn/15.24.1/img/profileicon/588.png
        console.log(this.#version);
        return `https://ddragon.leagueoflegends.com/cdn/${this.#version}/img/profileicon/${profileIconId}.png`;
    }

    // Get a summoner's data by their PUUID
    getSummonerByPUUID(puuid: string, region: Regions) {
        return this.Summoner.getByPUUID(puuid, region);
    }

    // Get a player's account by their Riot ID (name and tag line)
    getPlayerAccount(name: string, tagLine: string, region: AccountAPIRegionGroups) {
        return this.riot.Account.getByRiotId(name, tagLine, region);
    }

    getMatchHistory(puuid: string, region: RegionGroups, query?: MatchQueryV5DTO) {
        return this.MatchV5.list(puuid, region, query);
    }
}
