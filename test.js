const fs = require('fs');

const dataTreeRaw = fs.readFileSync('./dataTree.json', {encoding: 'utf-8'});
const dataTree = JSON.parse(dataTreeRaw);
// console.log(dataTree.children[0].children[0].children[0].children[1].children[0]);

let collectivePathObj = [];

for (let i = 0; i < dataTree.children.length; i++) {
    const element = dataTree.children[i];

    element.children.forEach(element => {
        element.children.forEach(element => {
            element.children.forEach(element => {
                element.children.forEach(element => {
                    collectivePathObj.push(`./${element.path}`);
                });
            });
        });
    });
}

console.log(collectivePathObj);