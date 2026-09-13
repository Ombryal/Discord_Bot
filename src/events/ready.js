const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true, // only runs the first time the bot connects, not every time
	execute(client) {
		console.log(`We're online! Logged in as ${client.user.tag}, in ${client.guilds.cache.size} server(s).`);

		// shows up as "Playing /help | nexus-bot" under the bot's name
		client.user.setActivity('/help | nexus-bot');
	},
};
