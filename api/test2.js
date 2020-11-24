const magnet = `magnet:?xt=urn:btih:5CC8FE91E68D13D104C19336482353B1FAECE9AC&dn=%5BClassical+Music%5D+The+Best+Of+%28Vivaldi%2C+Bethovenn%2C+Mozart%2C+Strau&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce`;
const decoded = decodeURI(magnet);
const torrentStream = require('torrent-stream');

const options = {
    connections: 100,
    uploads: 10,
    tmp: './files/tmp',
    path: './files/lolo',
    dht: true,
    verify: true,
    tracker: true
};

const engine = torrentStream(decoded, options);

engine.on('ready', function () {

    engine.files.forEach(function(file) {
		console.log('filename:', file.name);
		const stream = file.createReadStream();
	});
})

engine.on('download', (index) => {
    console.log(`Engine downloading chunk: [${index}]`)
    console.log('Engine swarm downloaded : ', engine.swarm.downloaded)
})

engine.on('idle', () => {
    console.log('done');
})