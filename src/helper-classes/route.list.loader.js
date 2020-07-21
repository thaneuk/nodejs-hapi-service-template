'use strict';


const fs = require('fs');
const path = require('path');
const routePath = path.join(__dirname, '../routes');
const jsRegEx = /.js/;


/* loads route files found in routes folder */
const getFileList = () => {
    return new Promise(resolve => {
        fs.readdir(routePath, (err, files) => {
            resolve(files.filter(file => !!file.match(jsRegEx)).map(file => require(`${routePath}/${file}`)).reduce((routes, routeList) => [...routes, ...routeList], []));
        });
    });
};


module.exports = getFileList();
