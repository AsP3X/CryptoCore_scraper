const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Importing modules
const cdate = require('./modules/cDate');

const selectors = JSON.parse(fs.readFileSync('./bin/appdata/selectors.json', 'utf8'));
const currency = JSON.parse(fs.readFileSync('./bin/appdata/currencies.json', 'utf8'));

/**
 * Get price data from coinmarketcap.com and return it as a string
 * @param {String} currency 
 * @returns {String}
 */

async function getWebsiteData(currency) {
    const siteUrl = `https://coinmarketcap.com/currencies/${currency}/`;
    const { data } = await axios({
        method: 'GET',
        url: siteUrl,
    });

    console.log(`Fetching data for ${currency}`);

    return data;
}

/**
 * // processing the price data for the given currency and return it as a string
 * @param {Object} webData
 * @param {String} currency 
 * @returns {String}
 */
async function getPriceData(webData, currency) {
    try {
        const cheer = cheerio.load(webData);
        const elemSelector = selectors[currency].price;
        const price = cheer(elemSelector).html();

        console.log(`Extracting the price for ${currency}`);
        return price;
    } catch (err) {
        console.log(err);
    }
}

/**
 * // processing the price difference for the given currency and return it as a number
 * @param {Object} webData
 * @param {String} currency 
 * @returns {Number}
 */
async function getPriceDifference(webData, currency) {
    function parseRawData(rawData) {
        const splitFields = rawData.split('>');
        const dataField = splitFields[2].split('<');
        return dataField[0];
    }

    try {
        const cheer = cheerio.load(webData);
        elemSelector = selectors[currency].difference_24h;
        
        const differenceRaw = cheer(elemSelector).html();
        const difference = parseRawData(differenceRaw);

        console.log(`Extracting the price difference for ${currency}`);
        
        return difference;
    } catch (err) {
        console.log(err);
    }
}
/**
 * // processing the high low data of 24h for the given currency and return it as a string
 * @param {Object} webData 
 * @param {String} currency
 * @returns {Array}
 */
async function getHighLow24h(webData, currency) {
    function parseRawData(rawData) {
        const splitFields = rawData.split('>');
        const dataField = splitFields[5].split('<');
        return dataField[0];
    }

    try {
        const cheer = cheerio.load(webData);
        const elemSelector = selectors[currency].highlow_24h;

        const lowRaw = cheer(elemSelector).children(".sc-16r8icm-0 .lipEFG").html();
        const highRaw = cheer(elemSelector).children(".sc-16r8icm-0 .SjVBR").html();

        const low = parseRawData(lowRaw);
        const high = parseRawData(highRaw);

        console.log(`Extracting the high low for ${currency}`);

        return {
            low: low,
            high: high
        }

        return lowRaw;
    } catch (err) {
        console.log(err);
    }
}

/**
 * // processing the Circulating supply data for the given currency and return it as a string
 * @param {Object} webData 
 * @param {String} currency
 * @returns {Array}
 */
async function getCirculatingSupply(webData, currency) {
    try {
        const cheer = cheerio.load(webData);
        const elemSelector = selectors[currency].circulatingSupply;

        // const supply = cheer(elemSelector)[0].html();
        // const supplyPercent = cheer(elemSelector)[1].html();
        const supply = cheer(elemSelector).children('.statsValue').html();
        let supplyPercent = cheer(elemSelector).children('.supplyBlockPercentage').html();

        if (supplyPercent === "") {
            supplyPercent = 'unknown';
        }

        console.log(`Extracting the circulating supply for ${currency}`);

        return {
            circulatingSupply: supply,
            circulatingSupplyPercent: supplyPercent
        }
    } catch (err) {
        console.log(err);
    }
}

/**
 * // process the max supply data for the given currency and return it as a string
 * @param {Object} webData 
 * @param {String} currency
 * @returns {Number}
 */
async function getMaxSupply(webData, currency) {
    try {
        const cheer = cheerio.load(webData);
        const elemSelector = selectors[currency].maxSupply;
        let supply = cheer(elemSelector).html();

        if (supply === '--') {
            supply = 'unknown';
        }

        console.log(`Extracting the max supply for ${currency}`);

        return supply;
    } catch (err) {
        console.log(err);
    }
}

/**
 * // processing the volume data of 24h for the given currency and return it as a string
 * @param {Object} webData
 * @param {String} currency 
 * @returns {Array}
 */
async function getVolume24h(webData, currency) {
    function parseRawData(rawData) {
        let dataField = [];
        const splitFields = rawData.split('>');
        dataField.push(splitFields[1].split('<')[0], splitFields[5].split('<')[0])
        return dataField;
    }

    try {
        const cheer = cheerio.load(webData);
        const elemSelector = selectors[currency].volume_24h;

        const volumeRaw = cheer(elemSelector).html();
        const volume = parseRawData(volumeRaw)[0];
        const volumePercent = parseRawData(volumeRaw)[1];

        console.log(`Extracting the 24h volume for ${currency}`);

        return {
            volume: volume,
            volumePercent: `${volumePercent}%`
        }
    } catch (err) {
        console.log(err);
    }
}

/**
 * // Assemble the data into an Array
 * @param {String} currency
 * @returns {Array}
 */
async function assembleData(currency) {
    const webData = await getWebsiteData(currency);

    const price = await getPriceData(webData, currency);
    const difference = await getPriceDifference(webData, currency);
    const highlow = await getHighLow24h(webData, currency);
    const circulatingSupply = await getCirculatingSupply(webData, currency);
    const maxSupply = await getMaxSupply(webData, currency);
    const volume = await getVolume24h(webData, currency);

    const data = {
        price: price,
        difference: `${difference}%`,
        highlow: highlow,
        circulatingSupply: circulatingSupply,
        maxSupply: maxSupply,
        volume: volume
    }

    console.log(`Assembling the data for ${currency}`);

    return data;
}

/**
 * Write the data from the requested currency to a file
 * @param {String} currency 
 */
async function scrape(currency) {
    console.log(__dirname);
    const date = cdate.getDate();
    const data = await assembleData(currency);
    const dateKey = cdate.generateDateKey("time", date);

    const path = `./data/${currency}/${date.year}/${date.month}/${date.day}`;
    const filename = `${dateKey}_${currency}.json`;
    const filepath = `${path}/${filename}`;

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

    fs.writeFile(filepath, JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`The file ${filename} has been saved!`);
        }
    });
}

module.exports.scrape = scrape;


// // testValues();
// var minutes = 5, the_interval = minutes * 60 * 1000;
// setInterval(function(){ 
//     main("bitcoin");
// }, the_interval);

// async function main() {
//     const webData = await getWebsiteData("bitcoin");
//     const highlow = await getHighLow24h(webData, "bitcoin");
//     // console.log(highlow);
// }

// main();