const { login } = require('./src/auth');
const errors = require('./src/errors');

// -----------------------------------------------------------

const { createSession } = require('./src/session');
const { cipher, decipher } = require('./src/cipher');
const { getStart, auth } = require('./src/auth');

const getParams = require('./src/fetch/params');
const { getId, getAuthKey } = require('./src/fetch/auth');
const getUser = require('./src/fetch/user');
const { getFilledDaysAndWeeks, getTimetable } = require('./src/fetch/timetable');

const navigate = require('./src/fetch/navigate');

const { toPronoteWeek, toUTCWeek, toPronoteDay, fromPronoteDay } = require('./src/data/weeks');

const http = require('./src/http');
const request = require('./src/request');

module.exports = {
    // High-level API
    login,
    errors,

    // Low-level API (you can use this if you need, but it may mean I've forgotten a use case, please open an issue!)
    createSession,
    cipher, decipher,
    getStart, auth,

    fetchParams: getParams,
    fetchAuthId: getId,
    fetchAuthKey: getAuthKey,
    fetchUser: getUser,
    fetchTimetableDaysAndWeeks: getFilledDaysAndWeeks,
    fetchTimetable: getTimetable,

    navigate,

    toPronoteWeek, toUTCWeek, toPronoteDay, fromPronoteDay,

    http,
    request
};
