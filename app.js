// ####################################################################
// ## ZOUPA - (ZombyMediaIC open source usage protection agreement)  ##
// ## License as of: 17.11.2021 15:27 | #202111171527                ##
// ## Niklas Vorberg (AsP3X)                                         ##
// ####################################################################

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

function emulateRuntime(coinconfig) {
    for (let i = 0; i < coinconfig.currencies.length; i++) {
        coinMarketCap.scrape(coinconfig.currencies[i]);
    }
}

function emulateLive(time){
    if (!time) {
        console.error('Please provide a valid time in minutes');
    }
    const interval = createInterval(time);

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
            
    }, interval);
    console.log(`WebScraper is now running [${createTimestamp()}]`);
    console.log(`Emulating live: with a "${time} minute" interval`);
}

function executeLive(coinconfig) {
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

if (args[0] === '--help') {
    console.log('Usage: node app.js');
    console.log('Parameter: [--help], [--test-run], ([--emulate-live] [interval])');
} else if (args[0] === '--test-run') {
    emulateRuntime(coinconfig);
} else if (args[0] ==='--emulate-live') {
    emulateLive(args[1]);
} else {
    executeLive(coinconfig);
}