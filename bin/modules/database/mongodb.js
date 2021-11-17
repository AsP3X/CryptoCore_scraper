// ####################################################################
// ## ZOUPA - (ZombyMediaIC open source usage protection agreement)  ##
// ## License as of: 17.11.2021 16:00 | #202111171600                ##
// ## Niklas Vorberg (AsP3X)                                         ##
// ####################################################################

const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// Importing models
const Crypto = require('./models/crypto');

const mongodb = {};

/**
 * // This function is used to read data from a file
 * @param {String} filepath 
 * @returns 
 */
async function getDataFromFile(filepath) {
    if (fs.existsSync(filepath)) {
        const fileData = fs.readFileSync(filepath, 'utf8');
        const data = JSON.parse(fileData);
        return data;
    }
}

/**
 * // Establishing connection to the mongodb database
 */
async function establishConnection() {
    const dbURI = process.env.MONGODB_URI;
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('Database connection established');
    }).catch(err => {
        console.log(err);
    });
}

async function getDataFromDB(identifyer) {
    return Crypto.find({ identifyer }).catch(err => {
        console.log(err);
    });
}

/**
 * // This function is used to write data to the mongodb database using a mongoose model
 * @param {Object} data 
 */
async function writeToDB(data) {
    const crypto = new Crypto({
        id: data.timestamp,
        name: data.currency,
        price: data.price,
        difference: data.difference,
        low: data.highlow.low,
        high: data.highlow.high,
        circulatingSupply: data.circulatingSupply.circulatingSupply,
        circulatingSupplyPercent: data.circulatingSupply.circulatingSupplyPercent,
        maxSupply: data.maxSupply,
        volume: data.volume.volume,
        volumePercent: data.volume.volumePercent
    });

    crypto.save().then(() => {
        console.log('Data saved to DB');
    }).catch(err => {
        console.log(err);
    });
}

// async function main() {
//     const fileData = await getDataFromFile("C:\\Users\\AsP3X\\Desktop\\Development\\CryptoCore\\data\\bitcoin\\2021\\11\\17\\143112_bitcoin.json");

//     await establishConnection();
//     writeToDB(fileData);
//     // const dbData = await getDataFromDB('20211117133509')
//     // console.log(dbData[0].name);
// }

// main();

mongodb.establishConnection = establishConnection;
mongodb.getDataFromFile = getDataFromFile;
mongodb.writeToDB = writeToDB;

module.exports = mongodb;