const coinMarketCap = require('./bin/fetchCoinMarketCap');

// create intervall that executes every 5 minutes

function createTimestamp() {
    const date = new Date();
    const timestamp = date.getTime();
    return timestamp;
}

function createInterval(time) {
    let minutes = time, interval = minutes * 60 * 1000;
    return interval;
}

let counter = 0;
const runtimeLoop = setInterval(() => {
    counter++;
    console.log(`IDLE: waiting for execution Minute ${counter} out of 5`);

    if (counter === 5) {
        counter = 0;
        coinMarketCap.scrape("bitcoin");
        coinMarketCap.scrape("ethereum");
        coinMarketCap.scrape("binance-coin");
        coinMarketCap.scrape("tether");
    }
        
}, createInterval(1));

console.log(`WebScraper is now running [${createTimestamp()}]`);