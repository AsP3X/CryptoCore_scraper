// ####################################################################
// ## ZOUPA - (ZombyMediaIC open source usage protection agreement)  ##
// ## License as of: 17.11.2021 16:00 | #202111171600                ##
// ## Niklas Vorberg (AsP3X)                                         ##
// ####################################################################

const coinMarketCap = require('./bin/fetchCoinMarketCap');
// const cron = require('node-cron');
const cdate = require('./bin/modules/utils/cDate');
const dataTree = require('./bin/modules/utils/dataTree');
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

/**
 * // Generating the timing for an interval function
 * @param {Number} time 
 * @returns {Number} interval in minutes
 */
function createInterval(time) {
    let minutes = time, interval = minutes * 60 * 1000;
    return interval;
}

/**
 * // Executing all program functionality for testing purposes
 * @param {*} coinconfig 
 */
function emulateRuntime(coinconfig) {
    for (let i = 0; i < coinconfig.currencies.length; i++) {
        coinMarketCap.scrape(coinconfig.currencies[i]);
    }
}

/**
 * // Executing all program functionality in an emulated
 * // live mode (no cron job)
 * @param {Number} time 
 */
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

/**
 * // Executing in production mode (cron job) or via realtime execution
 * @param {JSON} coinconfig 
 */
 function executeLive(coinconfig) {
    console.log(`WebScraper is now running [${createTimestamp()}]`);
    for (let i = 0; i < coinconfig.currencies.length; i++) {
        coinMarketCap.scrape(coinconfig.currencies[i]);
    }
    return true;
}


// check if console parameter is given and execute accordingly
if (args[0] === '--help') {

    console.log('Usage: node app.js');
    console.log('Parameter: [--help], [--test-run], ([--emulate-live] [interval])');

} else if (args[0] === '--test-run') {

    emulateRuntime(coinconfig);
    dataTree.saveDirTree("./dataTree.json", "./data");
    dataTree.compileData("./dataTree.json");

} else if (args[0] ==='--emulate-live') {

    emulateLive(args[1]);

} else if (args[0] === '--realtime') {

    console.log(`Executing in realtime`);
    const intervalRun = setInterval(() => {
        const executeTimings = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        const executeDirTree = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
        const date = cdate.getFormatetDate();
    
        if (executeTimings.includes(date.minute) && date.second === 0) {
            console.log(`${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}:${date.second}`);
            executeLive(coinconfig);
        }

        if (executeDirTree.includes(date.minute) && date.second === 0) {
            dataTree.saveDirTree("./dataTree.json", "./data");
        }
    
    }, 1000);

} else {

    let counter = 0;
    cron.schedule('*/5 * * * *', () => {
        counter++;
        console.log(`IDLE: waiting for execution Minute ${counter} out of 5`);
    
        if (counter === 5) {
            counter = 0;
            executeLive(coinconfig);
            dataTree.saveDirTree("./dataTree.json", "./data");
            dataTree.compileData("./dataTree.json");
        }
    });

}