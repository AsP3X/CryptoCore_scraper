const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cryptoSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    difference: {
        type: String,
        required: true
    },
    low: {
        type: String,
        required: true
    },
    high: {
        type: String,
        required: true
    },
    circulatingSupply: {
        type: String,
        required: true
    },
    circulatingSupplyPercent: {
        type: String,
        required: true
    },
    maxSupply: {
        type: String,
        required: true
    },
    volume: {
        type: String,
        required: true
    },
    volumePercent: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;