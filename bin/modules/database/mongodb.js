const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// Importing models
const Test = require('./models/test');

async function getDataFromFile(filepath) {
    if (fs.existsSync(filepath)) {
        const fileData = fs.readFileSync(filepath, 'utf8');
        const data = JSON.parse(fileData);
        return data;
    }
}

async function establishConnection() {
    const dbURI = process.env.MONGODB_URI;
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('Database connection established');
    }).catch(err => {
        console.log(err);
    });
}

async function getDataFromDB(identifyer) {
    return Test.find({ identifyer }).catch(err => {
        console.log(err);
    });
}

async function writeToDB(data) {
    const test = new Test({
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

    test.save().then(() => {
        console.log('Data saved to DB');
    }).catch(err => {
        console.log(err);
    });
}

async function main() {
    const fileData = await getDataFromFile('/home/asp3x/Desktop/workspace/CryptoCore/data/bitcoin/2021/11/17/133508_bitcoin.json');

    await establishConnection();
    // writeToDB(fileData);
    const dbData = await getDataFromDB('20211117133509')
    console.log(dbData[0].name);
}

main();