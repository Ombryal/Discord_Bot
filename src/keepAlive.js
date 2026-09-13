const http = require('node:http');

// Replit's free tier puts the app to sleep if nothing hits it for a while.
// This spins up a super basic webpage that says "I'm alive" - an external
// service (UptimeRobot) will ping this url every few minutes so Replit
// thinks someone's actively using it and never lets it fall asleep.
function keepAlive() {
	const server = http.createServer((req, res) => {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('nexus-bot is alive');
	});

	server.listen(3000, () => {
		console.log('Keep-alive server running on port 3000.');
	});
}

module.exports = keepAlive;
