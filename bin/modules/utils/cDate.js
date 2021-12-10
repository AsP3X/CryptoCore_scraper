// ####################################################################
// ## ZOUPA - (ZombyMediaIC open source usage protection agreement)  ##
// ## License as of: 17.11.2021 16:00 | #202111171600                ##
// ## Niklas Vorberg (AsP3X)                                         ##
// ####################################################################

const cdate = {}

/**
 * Generating an array containing the date and time for easy access
 * @returns {Array}
 */
cdate.getDate = () => {
    let date = new Date(); 
    let year = date.getFullYear();
    let month = date.getMonth() + 1; if (month < 10) { month = '0' + month; }
    let day = date.getDate(); if (day < 10) { day = '0' + day; }
    let hours = date.getHours(); if (hours < 10) { hours = '0' + hours; }
    let minutes = date.getMinutes(); if (minutes < 10) { minutes = '0' + minutes; }
    let seconds = date.getSeconds(); if (seconds < 10) { seconds = '0' + seconds; }

    return {
        year: year,
        month: month,
        day: day,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }
}

/**
 * Generating a sequenz of ether only time or date and time
 * @param {String} type used for determing the way of result return
 * @param {Array} date contains all the data to generate the keys
 * @returns {String}
 */
cdate.generateDateKey = (type, date) => {
    if (type === "filename") {
        const dateString = `${date.hours}${date.minutes}00`;
        return dateString;
    } else if (type === "dbTimeId") {
        const dateString = `${date.year}${date.month}${date.day}${date.hours}${date.minutes}`;
        return dateString;
    } else {
        const dateString = `${date.year}${date.month}${date.day}${date.hours}${date.minutes}${date.seconds}`;
        return dateString;
    }
}

cdate.getFormatetDate = () => {
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

module.exports = cdate;