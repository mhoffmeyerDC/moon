/**
 * Moon-phase calculation
 * Roger W. Sinnott, Sky & Telescope, June 16, 2006.
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
 * This function returns a nice phase of the moon, but there are some values in here that are important
 *
 * @returns {string} Moon Phase
 */
function moonElong(mm, dd, yyyy) {
    var jd = getJulianDate(mm, dd, yyyy);
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
    elong = Math.round(elong);

    //The rest of this doesn't seem important to what we're doing
    //var moonNum = ((elong + 6.43) / 360) * 28;
    //moonNum = Math.floor(moonNum);
    //if (moonNum == 28) moonNum = 0;
    //if (moonNum < 10) moonNum = "0" + moonNum;
    //
    //var moonPhase = " new Moon";
    //if ((moonNum > 3) && (moonNum < 11)) moonPhase = " first quarter";
    //if ((moonNum > 10) && (moonNum < 18)) moonPhase = " full Moon";
    //if ((moonNum > 17) && (moonNum < 25)) moonPhase = " last quarter";
    //
    //if ((moonNum == 1) || (moonNum == 8) || (moonNum == 15) || (moonNum == 22)) {
    //    moonPhase = " 1 day past" + moonPhase;
    //}
    //if ((moonNum == 2) || (moonNum == 9) || (moonNum == 16) || (moonNum == 23)) {
    //    moonPhase = " 2 days past" + moonPhase;
    //}
    //if ((moonNum == 3) || (moonNum == 10) || (moonNum == 17) || (moonNum == 24)) {
    //    moonPhase = " 3 days past" + moonPhase;
    //}
    //if ((moonNum == 4) || (moonNum == 11) || (moonNum == 18) || (moonNum == 25)) {
    //    moonPhase = " 3 days before" + moonPhase;
    //}
    //if ((moonNum == 5) || (moonNum == 12) || (moonNum == 19) || (moonNum == 26)) {
    //    moonPhase = " 2 days before" + moonPhase;
    //}
    //if ((moonNum == 6) || (moonNum == 13) || (moonNum == 20) || (moonNum == 27)) {
    //    moonPhase = " 1 day before" + moonPhase;
    }

    return moonPhase;
}

