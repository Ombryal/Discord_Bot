// how much total xp you need to hit a given level
// classic curve style, gets harder the higher you go
function xpForLevel(level) {
	return 5 * (level ** 2) + 50 * level + 100;
}

// figures out what level someone should be based on their total xp
function levelFromXp(xp) {
	let level = 0;
	while (xp >= xpForLevel(level)) {
		level++;
	}
	return level;
}

// random xp per message, kept small so leveling up actually takes a while
function randomXp() {
	return Math.floor(Math.random() * 10) + 15; // 15-24 xp per message
}

module.exports = { xpForLevel, levelFromXp, randomXp };
