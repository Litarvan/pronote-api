const { initCipher } = require('./cipher');
const getAccountType = require('./accounts');

const timetable = require('./timetable');
const marks = require('./marks');
const evaluations = require('./evaluations');
const absences = require('./absences');
const infos = require('./infos');
const homeworks = require('./homeworks');
const menu = require('./menu');

const sessions = {}; // TODO: Keep alive sessions

function createSession({ serverURL, sessionID, type, disableAES, disableCompress, keyModulus, keyExponent })
{
    const session = {
        id: ~~sessionID,
        server: getServer(serverURL),
        type: typeof type === 'string' ? getAccountType(type) : type,

        request: -1,

        disableAES,
        disableCompress
    };

    initCipher(session, keyModulus, keyExponent);

    session.timetable = (...args) => timetable(session, ...args);
    session.marks = (...args) => marks(session, ...args);
    session.evaluations = (...args) => evaluations(session, ...args);
    session.absences = (...args) => absences(session, ...args);
    session.infos = (...args) => infos(session, ...args);
    session.homeworks = (...args) => homeworks(session, ...args);
    session.menu = (...args) => menu(session, ...args);

    sessions[session.id] = session;
    return session;
}

function getServer(url)
{
    if (url.endsWith('.html')) {
        return url.substring(0, url.lastIndexOf('/') + 1);
    }

    if (!url.endsWith('/')) {
        url += '/';
    }

    return url;
}

function getSessions()
{
    return Object.values(sessions);
}

function removeSession(session)
{
    delete sessions[session.id];
}

module.exports = {
    createSession,
    getSessions,
    removeSession,

    getServer
};
