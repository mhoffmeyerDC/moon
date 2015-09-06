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
    return http.get('http://aa.usno.navy.mil/cgi-bin/aa_rstablew.pl?FFX=1&xxy=' + year + '&type=1&st='+ state +'&place=' + town +'&ZZZ=END', function(response) {
        var str;

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            var dataTable = dataSetOnly(selectTable(str));
            var rows = splitIntoRows(dataTable);
            console.log(rows);
        });
    }).on('error', function(e) {
        console.log('Got error: ' + e.message);
    });
}

/**
 * Selects the data table from the HTML document
 * @param str
 * @returns {String}
 */
function selectTable(str) {
    return str.match(/<pre>([\s\S]*?)<\/pre>/g).map(function(val){
        return val.replace(/<\/?pre>/g,'');
    })[0];
}

/**
 * Regex are dark magic, this could break if the format changes
 * @param str
 */
function dataSetOnly(str) {
    return str.match(/\s01([\s\S]*?)\n\n/).map(function(val){
        return val.replace(/^\n/,'');
    })[0];
}

function splitIntoRows(str) {
    return str.split(/\r?\n/);
}

function spliteMore() {
    /**
     * TODO write algorithm to split rows into rise/set tuple and organize into a nice month/day data structure.
     */
}

module.exports = {
    getData: getData
};


