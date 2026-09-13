require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

// collect every command's info so we can send it all to Discord at once
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
	const folderPath = path.join(commandsPath, folder);
	const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(folderPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.warn(`Skipping ${filePath}, missing "data" or "execute".`);
		}
	}
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log(`Sending ${commands.length} commands to Discord...`);

		// if we set a test server ID, commands update instantly there (great for testing)
		// otherwise they go out globally, which can take up to an hour to show up everywhere (sed)
		const route = process.env.DEV_GUILD_ID
			? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID)
			: Routes.applicationCommands(process.env.CLIENT_ID);

		const data = await rest.put(route, { body: commands });

		console.log(`Done! ${data.length} commands are live.`);
	} catch (error) {
		console.error(error);
	}
})();
