"use strict";

/**
 * Program entry point
 */
var usnoData = require('./MoonData.js');
var moonPhase = require('./MoonPhase.js');
var Table = require('cli-table');

var year = 2015;
var table_options = {
    head: ['Date', 'Julian Date', 'Lunar Elongation'],
    colWidths: [28, 15, 20],
    chars: {
        'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '',
        'top': '', 'top-mid': '', 'top-left': '', 'top-right': ''
        , 'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': ''
    }
};

var table = new Table(table_options);

function convertAndDisplayLunarData(monthList) {
    for (var month in monthList) {
        for (var days in monthList[month]) {
            for (var riseSet in monthList[month][days]) {
                if (monthList[month][days][riseSet] !== 'null') {
                    var jdn = moonPhase.myJD(monthList[month][days][riseSet]);
                    var elong = moonPhase.getMoonElong(jdn);
                    table.push([monthList[month][days][riseSet].toLocaleString(), jdn, elong]);
                }
            }
        }
    }
    console.log(table.toString());
}


usnoData.getData(year, 75, 41, 40, 34, 5, 'BREINIGSVILLE, PA').then(convertAndDisplayLunarData);