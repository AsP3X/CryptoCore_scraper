const dirTree = require('directory-tree');
const fs = require('fs');

const dataTree = {};

function getDirTree(path) {
    const tree = dirTree(path);
    return tree;
}

function saveDirTree(filePath, dataPath) {
    const tree = getDirTree(dataPath);
    const json = JSON.stringify(tree, null, 2);
    fs.writeFileSync(filePath, json);
}

dataTree.getDirTree = getDirTree;
dataTree.saveDirTree = saveDirTree;

module.exports = dataTree;