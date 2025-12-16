import { PresenceUpdateStatus, ActivityType } from 'seyfert/lib/types';
import { createEvent } from 'seyfert';

export default createEvent({
    data: {
        name: 'ready'
    },
    run: (_, client, shardId) => {
        client.gateway.setShardPresence(shardId, {
            activities: [{
                type: ActivityType.Custom,
                state: 'coming soon',
                name: 'coming soon'
            }],
            status: PresenceUpdateStatus.DoNotDisturb,
            afk: false,
            since: null
        });
    }
});
