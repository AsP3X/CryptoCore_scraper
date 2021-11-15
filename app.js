const coinMarketCap = require('./bin/fetchCoinMarketCap');
const fs = require('fs');

// receive console parameter if given
const args = process.argv.slice(2);

// get all configured crypto currencies
const coinconfig = JSON.parse(fs.readFileSync('./bin/appdata/currencies.json'));

function createTimestamp() {
    const date = new Date();
    const timestamp = date.getTime();
    return timestamp;
}

function createInterval(time) {
    let minutes = time, interval = minutes * 60 * 1000;
    return interval;
}

if (args[0] === '--help') {
    console.log('Usage: node app.js');
    console.log('Parameter: [--help], [--test-run]');
} else if (args[0] === '--test-run') {
    for (let i = 0; i < coinconfig.currencies.length; i++) {
        coinMarketCap.scrape(coinconfig.currencies[i]);
    }
} else {
    let counter = 0;
    const runtimeLoop = setInterval(() => {
        counter++;
        console.log(`IDLE: waiting for execution Minute ${counter} out of 5`);
    
        if (counter === 5) {
            counter = 0;
            for (let i = 0; i < coinconfig.currencies.length; i++) {
                coinMarketCap.scrape(coinconfig.currencies[i]);
            }
        }
            
    }, createInterval(1));
    console.log(`WebScraper is now running [${createTimestamp()}]`);
}