const router = require("express").Router();
const webTorrent = require('webtorrent');
const client = new webTorrent();
const magnetURI = `magnet:?xt=urn:btih:2294D851400CC68980E57294985635044771CED7&
dn=Avatar+a+lenda+de+Aang+3%26ordf%3B+Temporada+Dublado&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%
2Fannounce&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce`;
const fs = require('fs');

router.get("/test", (req, res) => {
    client.add(magnetURI, { path: '/download' }, function (torrent) {
        torrent.on('done', function () {
          console.log('torrent download finished')
        })
      })

    res.status(200).json({
        success: 'success',
        message: "test"
      });
  });

  module.exports = router;