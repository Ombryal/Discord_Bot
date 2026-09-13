const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// we only care about slash commands right now, so I'll ignore buttons/menus/etc 
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`Someone tried "/${interaction.commandName}" but I don't have that command.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`"${interaction.commandName}" broke:`, error);

			// if we already sent a reply, we have to "follow up" instead of replying again
			const errorMessage = { content: 'Something went wrong running that command.', flags: MessageFlags.Ephemeral };

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(errorMessage);
			} else {
				await interaction.reply(errorMessage);
			}
		}
	},
};
