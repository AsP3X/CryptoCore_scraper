const dirTree = require('directory-tree');
const fs = require('fs');

const dataTree = {}

dataTree.getDirTree = (path) => {
    const tree = dirTree(path);
    return tree;
}

dataTree.saveDirTree = (filePath, dataPath) => {
    if (fs.existsSync(dataPath)) {
        const treeRaw = dataTree.getDirTree(dataPath);
        const tree = JSON.stringify(treeRaw, null, 2);
        fs.writeFileSync(filePath, tree);
        console.log('Saved data tree to ' + filePath);
    } else {
        console.log('Data path does not exist: ' + dataPath);
    }
}

dataTree.compileData = (dataPath) => {
    if (fs.existsSync(dataPath)) {
        
        const fileContent = fs.readFileSync('dataTree.json', 'utf8');
        const dataTree = JSON.parse(fileContent);
        
        let dataObject = {};
        
        
        dataTree.children.forEach((cryptos) => {
            dataObject[cryptos.name] = {};
        
            cryptos.children.forEach((year) => {
                dataObject[cryptos.name][year.name] = {};
        
                year.children.forEach((month) => {
                    dataObject[cryptos.name][year.name][month.name] = {};
        
                    month.children.forEach((day) => {
                        dataObject[cryptos.name][year.name][month.name][day.name] = [];
        
                        day.children.forEach((items) => {
                            dataObject[cryptos.name][year.name][month.name][day.name].push(items.name);
                        });
                    });
                });
            });
        });

        fs.writeFileSync(dataPath, JSON.stringify(dataObject));

    } else {
        console.log('Data path does not exist: ' + dataPath);
    }
}


module.exports = dataTree;