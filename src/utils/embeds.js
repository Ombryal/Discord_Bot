const { EmbedBuilder } = require('discord.js');

// one color for the whole bot so every embed feels like the same product
const BRAND_COLOR = 0x5865F2;

// every embed we send should start from this, keeps the footer/timestamp/color consistent
// without having to repeat .setColor().setFooter() etc in every single command file
function baseEmbed() {
	return new EmbedBuilder()
		.setColor(BRAND_COLOR)
		.setFooter({ text: 'nexus-bot' })
		.setTimestamp();
}

module.exports = { baseEmbed, BRAND_COLOR };
