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

    return data;
}

/**
 * // processing the price data for the given currency and return it as a string
 * @param {String} currency 
 * @returns {String}
 */
async function getPriceData(currency) {
    try {
        const webData = await getWebsiteData(currency);
        const cheer = cheerio.load(webData);
        const elemSelector = selectors[currency].price;
        const price = cheer(elemSelector).html();

        // console.log(price);
        return price;
    } catch (err) {
        console.log(err);
    }
}

/**
 * // processing the price difference for the given currency and return it as a number
 * @param {String} currency 
 * @returns {Number}
 */
async function getPriceDifference(currency) {
    function parseRawData(rawData) {
        const splitFields = rawData.split('>');
        const dataField = splitFields[2].split('<');
        return dataField[0];
    }

    try {
        const webData = await getWebsiteData(currency);
        const cheer = cheerio.load(webData);
        elemSelector = selectors[currency].difference_24h;
        
        const differenceRaw = cheer(elemSelector).html();
        const difference = parseRawData(differenceRaw);
        
        return difference;
    } catch (err) {
        console.log(err);
    }
}
/**
 * // processing the high low data of 24h for the given currency and return it as a string
 * @param {String} currency 
 * @returns {Array}
 */
async function getHighLow24h(currency) {
    function parseRawData(rawData) {
        const splitFields = rawData.split('>');
        const dataField = splitFields[4].split('<');
        return dataField[0];
    }

    try {
        const webData = await getWebsiteData(currency);
        const cheer = cheerio.load(webData);
        const elemSelector = selectors[currency].highlow_24h;

        const lowRaw = cheer(elemSelector).children(".sc-16r8icm-0 .lipEFG").html();
        const highRaw = cheer(elemSelector).children(".sc-16r8icm-0 .SjVBR").html();

        const low = parseRawData(lowRaw);
        const high = parseRawData(highRaw);

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
 * @param {String} currency 
 * @returns {Array}
 */
async function getCirculatingSupply(currency) {
    try {
        const webData = await getWebsiteData(currency);
        const cheer = cheerio.load(webData);
        const elemSelector = selectors[currency].circulatingSupply;

        // const supply = cheer(elemSelector)[0].html();
        // const supplyPercent = cheer(elemSelector)[1].html();
        const supply = cheer(elemSelector).children('.statsValue').html();
        const supplyPercent = cheer(elemSelector).children('.supplyBlockPercentage').html();

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
 * @param {String} currency 
 * @returns {Number}
 */
async function getMaxSupply(currency) {
    try {
        const webData = await getWebsiteData(currency);
        const cheer = cheerio.load(webData);
        const elemSelector = selectors[currency].maxSupply;

        const supply = cheer(elemSelector).html();

        return supply;
    } catch (err) {
        console.log(err);
    }
}

/**
 * // processing the volume data of 24h for the given currency and return it as a string
 * @param {String} currency 
 * @returns {Array}
 */
async function getVolume24h(currency) {
    function parseRawData(rawData) {
        let dataField = [];
        const splitFields = rawData.split('>');
        dataField.push(splitFields[1].split('<')[0], splitFields[5].split('<')[0])
        return dataField;
    }

    try {
        const webData = await getWebsiteData(currency);
        const cheer = cheerio.load(webData);
        const elemSelector = selectors[currency].volume_24h;

        const volumeRaw = cheer(elemSelector).html();
        const volume = parseRawData(volumeRaw)[0];
        const volumePercent = parseRawData(volumeRaw)[1];

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
 * @returns {Array}
 */
async function assembleData(currency) {
    const price = await getPriceData(currency);
    const difference = await getPriceDifference(currency);
    const highlow = await getHighLow24h(currency);
    const circulatingSupply = await getCirculatingSupply(currency);
    const maxSupply = await getMaxSupply(currency);
    const volume = await getVolume24h(currency);

    const data = {
        price: price,
        difference: difference,
        highlow: highlow,
        circulatingSupply: circulatingSupply,
        maxSupply: maxSupply,
        volume: volume
    }

    return data;
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

testValues();