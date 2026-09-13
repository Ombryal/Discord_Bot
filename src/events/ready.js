const { Events, REST, Routes } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`We're online! Logged in as ${client.user.tag}, in ${client.guilds.cache.size} server(s).`);

		// shows up as "Playing /help | nexus-bot" under the bot's name
		client.user.setActivity('/help | nexus-bot');

		// registering commands here (instead of a separate script) means it just happens
		// automatically every time the bot boots up, no terminal needed
		try {
			const commands = client.commands.map(command => command.data.toJSON());
			const rest = new REST().setToken(process.env.DISCORD_TOKEN);

			const route = process.env.DEV_GUILD_ID
				? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID)
				: Routes.applicationCommands(process.env.CLIENT_ID);

			await rest.put(route, { body: commands });
			console.log(`Registered ${commands.length} slash commands.`);
		} catch (error) {
			console.error('Failed to register slash commands:', error);
		}
	},
};
