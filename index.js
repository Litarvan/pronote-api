const { loginStudent, loginParent } = require('./src/auth');
const { list: casList, getCAS } = require('./src/cas');
const geo = require('./src/geo');
const errors = require('./src/errors');

// -----------------------------------------------------------

const PronoteSession = require('./src/session');
const { cipher, decipher } = require('./src/cipher');
const { getStart, auth } = require('./src/auth');

const getParams = require('./src/fetch/pronote/params');
const { getId, getAuthKey } = require('./src/fetch/pronote/auth');
const getUser = require('./src/fetch/pronote/user');
const { getFilledDaysAndWeeks, getTimetable } = require('./src/fetch/pronote/timetable');
const getMarks = require('./src/fetch/pronote/marks');
const getEvaluations = require('./src/fetch/pronote/evaluations');
const getAbsences = require('./src/fetch/pronote/absences');
const getInfos = require('./src/fetch/pronote/infos');
const getContents = require('./src/fetch/pronote/contents');
const getHomeworks = require('./src/fetch/pronote/homeworks');
const getMenu = require('./src/fetch/pronote/menu');

const navigate = require('./src/fetch/pronote/navigate');
const keepAlive = require('./src/fetch/pronote/keepAlive');

const { toPronoteWeek, toUTCWeek, toPronoteDay, fromPronoteDay, toPronoteDate } = require('./src/data/dates');
const { getFileURL } = require('./src/data/files');

const http = require('./src/http');
const request = require('./src/request');

module.exports = {
    // High-level API
    login: loginStudent,
    loginParent,
    casList,
    getCAS,
    geo,
    errors,

    // Low-level API (you can use this if you need, but it may mean I've forgotten a use case, please open an issue!)
    PronoteSession,
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
    fetchAbsences: getAbsences,
    fetchInfos: getInfos,
    fetchContents: getContents,
    fetchHomeworks: getHomeworks,
    fetchMenu: getMenu,

    navigate,
    keepAlive,

    toPronoteWeek, toUTCWeek, toPronoteDay, fromPronoteDay, toPronoteDate,
    getFileURL,

    http,
    request
};
