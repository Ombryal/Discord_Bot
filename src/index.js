require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

// this is basically "turning the bot on" and telling Discord what kind of stuff we want to listen for
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
	partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

// we'll dump all our slash commands in here so we can find them fast later
client.commands = new Collection();

// go through every folder inside src/commands and grab each command file automatically
// this way we never have to manually list commands anywhere else
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
	const folderPath = path.join(commandsPath, folder);
	const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(folderPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.warn(`Heads up, ${filePath} is missing "data" or "execute" so I skipped it.`);
		}
	}
}

// same idea but for events (like "bot turned on" or "someone ran a command")
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// finally, actually log in using the secret token
client.login(process.env.DISCORD_TOKEN);
