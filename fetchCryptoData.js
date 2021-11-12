const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const selectors = JSON.parse(fs.readFileSync('./assets/appdata/selectors.json', 'utf8'));
const currency = JSON.parse(fs.readFileSync('./assets/appdata/currencies.json', 'utf8'));


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
        const dataField = splitFields[4].split('<');
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
        const supplyPercent = cheer(elemSelector).children('.supplyBlockPercentage').html();

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

        const supply = cheer(elemSelector).html();

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
            volumePercent: volumePercent
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
        difference: difference,
        highlow: highlow,
        circulatingSupply: circulatingSupply,
        maxSupply: maxSupply,
        volume: volume
    }

    console.log(`Assembling the data for ${currency}`);

    return data;
}

// create a function that returns the current date including the time with the format YYYYMMDDHHMMSS_bitcoin
function generateDateKey() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const dateString = `${year}${month}${day}${hours}${minutes}${seconds}`;

    return dateString;
}

async function main(currency) {
    const data = await assembleData(currency);
    const dateKey = generateDateKey();

    if (!fs.existsSync(`./data/${currency}`)) {
        fs.mkdirSync(`./data/${currency}`, { recursive: true });
    }

    const filename = `${dateKey}_${currency}.json`;
    const filepath = `./data/${currency}/${filename}`;

    fs.writeFile(filepath, JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`The file ${filename} has been saved!`);
        }
    });
}

async function testValues() {
    // console.log(await getPriceData('bitcoin'));
    // console.log(await getPriceDifference('bitcoin'));
    // console.log(await getHighLow24h('bitcoin'));
    // console.log(await getCirculatingSupply('bitcoin'));
    // console.log(await getMaxSupply('bitcoin'));
    // console.log(await getVolume24h('bitcoin'));

    console.log(await assembleData("bitcoin"));
}

// testValues();
var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function(){ 
    main("bitcoin");
}, the_interval);