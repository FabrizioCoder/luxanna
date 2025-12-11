import type { CommandContext } from 'seyfert';

import { Command, Declare } from 'seyfert';

@Declare({
    name: 'ping',
    description: 'Replies with Pong!'
})
export default class Ping extends Command {
    async run(ctx: CommandContext) {
        await ctx.editOrReply({
            content: 'Pong!'
        });
    }
}
