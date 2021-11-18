// ####################################################################
// ## ZOUPA - (ZombyMediaIC open source usage protection agreement)  ##
// ## License as of: 17.11.2021 16:00 | #202111171600                ##
// ## Niklas Vorberg (AsP3X)                                         ##
// ####################################################################

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Importing modules
const mongodb = require('./modules/database/mongodb');

async function main() {
    // Connecting to the database
    await mongodb.establishConnection();

    // Updating data in the database
    await mongodb.updateDBData(
        { id: '202111181134' }, 
        {
            price: '$59,105.36',
            difference: '0.08%'
        }
    );
}

main();