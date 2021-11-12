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

// var minutes = 5, the_interval = minutes * 60 * 1000;
const dataCollector = setInterval(function() {
    coinMarketCap.scrape("bitcoin");
}, createInterval(5));

let counter = 0;
const minuteTimer = setInterval(() => {
    counter++;
    console.log(`IDLE: waiting for execution Minute ${counter} out of 5`);

    if (counter === 4) {
        counter = 0;
    }
        
}, createInterval(1));

console.log(`WebScraper is now running [${createTimestamp()}]`);