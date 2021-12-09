const fs = require('fs');
const path = require('path');

const pathList = {};
const yearList = [];

const dataDir = fs.readdirSync('./data');

for (let i = 0; i < dataDir.length; i++) {
    // get the current path
    const currentPath = dataDir[i];
    const currentDirs = fs.readdirSync(`./data/${currentPath}`);

    pathList[currentPath] = currentDirs;
}


console.log(pathList.bitcoin);