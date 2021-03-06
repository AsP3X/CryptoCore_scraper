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

module.exports = dataTree;