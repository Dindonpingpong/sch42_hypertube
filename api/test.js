const torrentStream = require('torrent-stream');
const link = `magnet:?xt=urn:btih:2294D851400CC68980E57294985635044771CED7`;

const engine = torrentStream(link);

engine.on('ready', function () {
    engine.files.forEach(function (file) {
        console.log('filename:', file.name);
        // var stream = file.createReadStream();
    });
});

