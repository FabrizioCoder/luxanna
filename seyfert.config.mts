import { config } from 'seyfert';

export default config.bot({
    token: process.env.BOT_TOKEN ?? '',
    locations: {
        base: 'src', // replace with "src" if using bun
        commands: 'commands',
        events: 'events'
    },
    intents: ['Guilds'],
    debug: true
});
