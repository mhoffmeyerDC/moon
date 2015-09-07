"use strict";
/**
 * Moon-phase calculation
 * Based on Roger W. Sinnott, Sky & Telescope, June 16, 2006.
 */


/**
 * Not sure with this does, but I forgot all my trig
 * @param big
 * @returns {number}
 */
function proper_ang(big) {
    var tmp = 0;
    if (big > 0) {
        tmp = big / 360.0;
        tmp = (tmp - Math.floor(tmp)) * 360.0;
    }
    else {
        tmp = Math.ceil(Math.abs(big / 360.0));
        tmp = big + tmp * 360.0;
    }
    return tmp;
}
/**
 * Returns the Julian Date for a given date
 * @param mm {Number} - 1-index month, (1=Jan, 2=Feb, etc.)
 * @param dd {Number} - Day
 * @param yy {Number} - 4 Digit Year
 */
function getJulianDate(mm, dd, yy) {
    var now_date = new Date();
    var zone = now_date.getTimezoneOffset() / 1440;

    var yyy = yy;
    var mmm = mm;
    if (mm < 3) {
        yyy = yyy - 1;
        mmm = mm + 12;
    }
    var day = dd + zone + 0.5;
    var a = Math.floor(yyy / 100);
    var b = 2 - a + Math.floor(a / 4);
    var jd = Math.floor(365.25 * yyy) + Math.floor(30.6001 * (mmm + 1)) + day + 1720994.5;
    if (jd > 2299160.4999999) jd = jd + b;

    return jd;
}
/**
 * Returns the Julian Date for a JavaScript date object
 * From Wikipedia
 * @link https://en.wikipedia.org/wiki/Julian_day#Finding_Julian_date_given_Julian_day_number_and_time_of_day
 */
function myJD(date) {
    var month = date.getMonth()+1;

    var a = Math.floor((14 - month) / 12);
    var y = date.getFullYear() + 4800 - a;
    var m = month + 12*a - 3;
    var jd = date.getDate() + Math.floor((153*m + 2)/5) + 365*y + Math.floor(y/4) - Math.floor(y/100)+Math.floor(y/400) - 32045;
    var jdn = jd + ((date.getHours() - 12)/24) + (date.getMinutes() / 1440);

    return Math.floor(jdn * 1000) / 1000;
}

/**
 * @param jd - Julian Date
 * @returns {number} - Lunar Elongation
 */
function getMoonElong(jd) {
    var dr = Math.PI / 180;
    var rd = 1 / dr;
    var meeDT = Math.pow((jd - 2382148), 2) / (41048480 * 86400);
    var meeT = (jd + meeDT - 2451545.0) / 36525;
    var meeT2 = Math.pow(meeT, 2);
    var meeT3 = Math.pow(meeT, 3);
    var meeD = 297.85 + (445267.1115 * meeT) - (0.0016300 * meeT2) + (meeT3 / 545868);
    meeD = proper_ang(meeD) * dr;
    var meeM1 = 134.96 + (477198.8676 * meeT) + (0.0089970 * meeT2) + (meeT3 / 69699);
    meeM1 = proper_ang(meeM1) * dr;
    var meeM = 357.53 + (35999.0503 * meeT);
    meeM = proper_ang(meeM) * dr;
    var elong = meeD * rd + 6.29 * Math.sin(meeM1);
    elong = elong - 2.10 * Math.sin(meeM);
    elong = elong + 1.27 * Math.sin(2 * meeD - meeM1);
    elong = elong + 0.66 * Math.sin(2 * meeD);
    elong = proper_ang(elong);
    return Math.round(elong);
}

module.exports = {
    getJulianDate: getJulianDate,
    myJD: myJD,
    getMoonElong: getMoonElong
};