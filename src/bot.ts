import { Client, GatewayIntentBits } from 'discord.js';
import { playMusic } from './commands/music';
import { sendPhrase } from './commands/phrases';
import { token } from './config/index';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!play')) {
        await playMusic(message);
    } else if (message.content.startsWith('!phrase')) {
        await sendPhrase(message);
    }
});

client.login(token);