"use strict";
/**
 * Returns Lunar Rise/Set times from USNO data
 */
var http = require('http');

/**
 * Returns data from USNO in plain text table
 * @param year {Number} - Four Digit Year
 * @param state {String} - Two character state abbr
 * @param town {String} - Town
 * @returns TODO Return {Promise}
 */
function getData(year, state, town) {
    return http.get('http://aa.usno.navy.mil/cgi-bin/aa_rstablew.pl?FFX=1&xxy=' + year + '&type=1&st=' + state + '&place=' + town + '&ZZZ=END', function (response) {
        var str;

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            var dataTable = dataSetOnly(selectTable(str));
            var rows = splitIntoRows(dataTable);
            // console.log(rows);
            var months = dayMonths(rows);
            //console.log(months);
            var cleaned = cleanup(months);
            var transformed = transform(cleaned);
            console.log(transformed);
        });
    }).on('error', function (e) {
        console.log('Got error: ' + e.message);
    });
}

/**
 * Selects the data table from the HTML document
 * @param str
 * @returns {String}
 */
function selectTable(str) {
    return str.match(/<pre>([\s\S]*?)<\/pre>/g).map(function (val) {
        return val.replace(/<\/?pre>/g, '');
    })[0];
}

/**
 * Regex are dark magic, this could break if the format changes
 * @param str
 */
function dataSetOnly(str) {
    return str.match(/\s01([\s\S]*?)\n\n/).map(function (val) {
        return val.replace(/^\n/, '');
    })[0];
}

function splitIntoRows(str) {
    return str.split(/\r?\n/).map(function (val) {
        return val.replace(/^\d\d\ \ /g, '');
    });
}

function dayMonths(rows) {
    var months = [[], [], [], [], [], [], [], [], [], [], [], []];
    rows.map(function (row) {
        months[0].push(row.substr(0, 9));
        months[1].push(row.substr(11, 9));
        months[2].push(row.substr(22, 9));
        months[3].push(row.substr(33, 9));
        months[4].push(row.substr(44, 9));
        months[5].push(row.substr(55, 9));
        months[6].push(row.substr(66, 9));
        months[7].push(row.substr(77, 9));
        months[8].push(row.substr(88, 9));
        months[9].push(row.substr(99, 9));
        months[10].push(row.substr(110, 9));
        months[11].push(row.substr(121, 9));
    });
    return months;
}

function cleanup(months) {
    for (var monthIdx in months) {
        months[monthIdx] = months[monthIdx].filter(function (i) {
            return i !== '' && i !== '         ';
        });
        months[monthIdx] = months[monthIdx].map(function (riseSetPairWithGap) {
            return riseSetPairWithGap.replace(/(^\ \ \ \ )|(\ \ \ \ $)/, null).split(' ');
        });
    }
    return months;
}

function transform(months) {
    for (var monthIdx = 0; monthIdx < 12; monthIdx++) {
        for (var dayIdx = 0; dayIdx < months[monthIdx].length; dayIdx++) {
            for (var riseSetIdx in months[monthIdx][dayIdx]) {
                if (months[monthIdx][dayIdx][riseSetIdx] !== 'null') {
                    var hour = months[monthIdx][dayIdx][riseSetIdx].substring(0, 2);
                    var minute = months[monthIdx][dayIdx][riseSetIdx].substring(2, 4);
                    months[monthIdx][dayIdx][riseSetIdx] = new Date(2015, monthIdx, dayIdx + 1, hour, minute);
                }
            }
        }
    }
    return months;
}

module.exports = {
    getData: getData
};


