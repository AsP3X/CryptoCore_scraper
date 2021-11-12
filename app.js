const coinMarketCap = require('./bin/fetchCoinMarketCap');

// create intervall that executes every 5 minutes

var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {
    coinMarketCap.scrape("bitcoin");
}, the_interval);