"use strict";

/**
 * Program entry point
 */
var usnoData = require('./MoonData.js');

usnoData.getData(2015, 'DC', 'Washington').then(function(data) {
    console.log(data);
});
