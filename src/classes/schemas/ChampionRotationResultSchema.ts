import { z } from 'zod';


export const ChampionRotationResultSchema = z.object({
    freeChampionIds: z.array(z.number()),
    freeChampionIdsForNewPlayers: z.array(z.number()),
    maxNewPlayerLevel: z.number()
});
