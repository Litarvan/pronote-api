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
const getMarks = require('./src/fetch/marks');
const getEvaluations = require('./src/fetch/evaluations');
const getInfos = require('./src/fetch/Informations');
const getHomeworks = require('./src/fetch/homeworks');
const getMenu = require('./src/fetch/menu');
const getAbsence = require('./src/fetch/absences');

const navigate = require('./src/fetch/navigate');

const { toPronoteWeek, toUTCWeek, toPronoteDay, fromPronoteDay, toPronoteDate } = require('./src/data/dates');
const { getFileURL } = require('./src/data/files');

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
    fetchMarks: getMarks,
    fetchEvaluations: getEvaluations,
    fetchInfos: getInfos,
    fetchHomeworks: getHomeworks,
    fetchMenu: getMenu,
    fetchAbsence: getAbsence,

    navigate,

    toPronoteWeek, toUTCWeek, toPronoteDay, fromPronoteDay, toPronoteDate,
    getFileURL,

    http,
    request
};
