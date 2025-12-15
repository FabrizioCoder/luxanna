import type { MatchQueryV5DTO } from 'twisted/dist/models-dto/matches/query-v5';
import type { AccountAPIRegionGroups } from 'twisted/dist/constants';
import type { IBaseApiParams } from 'twisted/dist/base/base.utils';
import type { RegionGroups, Games } from 'twisted/dist/constants';
import type { Regions } from 'twisted/dist/constants';

import { RiotApi, LolApi } from 'twisted';
import { z } from 'zod';


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

export const ChampionRotationResultSchema = z.object({
    freeChampionIds: z.array(z.number()),
    freeChampionIdsForNewPlayers: z.array(z.number()),
    maxNewPlayerLevel: z.number()
});

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
        return `https://ddragon.leagueoflegends.com/cdn/${this.#version}/img/profileicon/${profileIconId}.png`;
    }

    // Get a summoner's data by their PUUID
    async getSummonerByPUUID(puuid: string, region: Regions) {
        const { response } = await this.Summoner.getByPUUID(puuid, region);
        return response;
    }

    // Get a player's account by puuid
    async getPlayerAccountByPUUID(puuid: string, region: AccountAPIRegionGroups) {
        const { response } = await this.riot.Account.getByPUUID(puuid, region);
        return response;
    }

    // Get a player's account by their Riot ID (name and tag line)
    async getPlayerAccountByRiotId(name: string, tagLine: string, region: AccountAPIRegionGroups) {
        const { response } = await this.riot.Account.getByRiotId(name, tagLine, region);
        return response;
    }

    // Get a player's account by puuid
    async getPlayerAccountActiveRegion(puuid: string, game: Games, region: AccountAPIRegionGroups) {
        const { response } = await this.riot.Account.getActiveRegion(puuid, game, region);
        return response;
    }

    // Get a player's match history by their PUUID
    async getMatchHistory(puuid: string, region: RegionGroups, query?: MatchQueryV5DTO) {
        const { response } = await this.MatchV5.list(puuid, region, query);
        return response;
    }

    // Get a specific match by its ID
    async getMatchById(matchId: string, region: RegionGroups) {
        const { response } = await this.MatchV5.get(matchId, region);
        return response;
    }

    // Get timeline of a specific match by its ID
    async getMatchTimeline(matchId: string, region: RegionGroups) {
        const { response } = await this.MatchV5.timeline(matchId, region);
        return response;
    }

    // Get active game by a player's PUUID
    async getActiveGameByPUUID(puuid: string, region: Regions) {
        const result = await this.SpectatorV5.activeGame(puuid, region);
        if ('message' in result) {
            throw new Error(`Error fetching active game: ${result.message}`);
        }
        return result.response;
    }

    // Get featured games in a specific region
    async getFeaturedGames(region: Regions) {
        const { response } = await this.SpectatorV5.featuredGames(region);
        return response;
    }

    // Get the current status of Riot services in a specific region
    async getRiotStatus(region: Regions) {
        const { response } = await this.StatusV4.get(region);
        return response;
    }

    // Get champion masteries by PUUID
    async getChampionMasteriesByPUUID(puuid: string, region: Regions) {
        const { response } = await this.Champion.masteryByPUUID(puuid, region);
        return response;
    }

    // Get champion mastery score by PUUID
    async getChampionMasteryScoreByPUUID(puuid: string, championId: number, region: Regions) {
        const { response } = await this.Champion.masteryByPUUIDChampion(puuid, championId, region);
        return response;
    }

    // Get champions score by PUUID
    async getChampionsScoreByPUUID(puuid: string, region: Regions) {
        const result = await this.Champion.championsScore(puuid, region);
        return result;
    }

    // Get champion rotations
    async getChampionRotations(region: Regions) {
        const { response } = await this.Champion.rotation(region);
        return ChampionRotationResultSchema.parse(response);
    }
}
