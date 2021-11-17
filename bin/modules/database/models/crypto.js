// ####################################################################
// ## ZOUPA - (ZombyMediaIC open source usage protection agreement)  ##
// ## License as of: 17.11.2021 15:27 | #202111171527                ##
// ## Niklas Vorberg (AsP3X)                                         ##
// ####################################################################

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