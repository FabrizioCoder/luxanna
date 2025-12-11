import type { AccountAPIRegionGroups, Regions } from 'twisted/dist/constants';
import type { IBaseApiParams } from 'twisted/dist/base/base.utils';

import { RiotApi, LolApi } from 'twisted';

const APIOptions: IBaseApiParams = {
    key: process.env.RIOT_KEY!,
    debug: {
        logTime: true,
        logUrls: true
    },
    rateLimitRetry: true,
    rateLimitRetryAttempts: 1,
    concurrency: undefined
};

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
    async getSummonerByPUUID(puuid: string, region: Regions) {
        return this.Summoner.getByPUUID(puuid, region);
    }

    // Get a player's account by their Riot ID (name and tag line)
    async getPlayerAccount(name: string, tagLine: string, region: AccountAPIRegionGroups) {
        return this.riot.Account.getByRiotId(name, tagLine, region);
    }


}
