const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    timestamp: {
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
    highlow: {
        type: Object,
        required: true
    },
    circulatingSupply: {
        type: Object,
        required: true
    },
    maxSupply: {
        type: String,
        required: true
    },
    volume: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Crypto', cryptoSchema);