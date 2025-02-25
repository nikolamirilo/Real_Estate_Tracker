import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

let isBotReady = false;
const botReadyPromise = new Promise((resolve) => {
    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        isBotReady = true;
        resolve();
    });
});

client.login(DISCORD_BOT_TOKEN).catch((error) => {
    console.error("Error logging in:", error);
});

export async function sendMessageToDiscord(offer) {
    try {
        if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID) {
            throw new Error("Discord bot token or channel ID is missing. Check your environment variables.");
        }

        if (!isBotReady) {
            console.log("Waiting for bot to log in...");
            await botReadyPromise;
        }

        console.log("Fetching channel with ID:", DISCORD_CHANNEL_ID);

        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
        if (!channel) {
            throw new Error("Channel not found!");
        }

        console.log("Channel found:", channel.name);
        const messageContent = `
**🏠 NOVA NEKRETNINA U SURČINU!**
**📍 Ulica:** ${offer.street}
**🏙️ Opština:** ${offer.cityArea}
**💰 Cena:** ${offer.price} (${offer.pricePerM2}/m²)
**📝 Detalji:** ${offer.details}
**🔗 Link:** [Klikni ovde](${offer.link})
`;
        await channel.send(messageContent);
        console.log("Message sent successfully!");
    } catch (error) {
        console.error("Error sending message to Discord:", error);
    }
}