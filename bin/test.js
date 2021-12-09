// ####################################################################
// ## ZOUPA - (ZombyMediaIC open source usage protection agreement)  ##
// ## License as of: 17.11.2021 16:00 | #202111171600                ##
// ## Niklas Vorberg (AsP3X)                                         ##
// ####################################################################

function getFormatetDate() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();

    return {
        year: currentYear,
        month: currentMonth,
        day: currentDay,
        hour: currentHour,
        minute: currentMinute,
        second: currentSecond
    }
}

const intervalRun = setInterval(() => {
    // const executeTimings = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const date = getFormatetDate();

    if (executeTimings.includes(date.minute) && date.second === 0) {
        console.log(`${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}:${date.second}`);
    } else {
        console.log(`${date.hour}:${date.minute} - ${date.second}`);
    }

}, 1000);

// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// // Importing modules
// const mongodb = require('./modules/database/mongodb');

// async function main() {
//     // Connecting to the database
//     await mongodb.establishConnection();

//     // Updating data in the database
//     await mongodb.updateDBData(
//         { id: '202111181134' }, 
//         {
//             price: '$59,105.36',
//             difference: '0.08%'
//         }
//     );
// }

// main();