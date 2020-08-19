const { initCipher } = require('./cipher');
const timetable = require('./timetable');
const marks = require('./marks');
const evaluations = require('./evaluations');
const absence = require('./absence');
const infos = require('./Informations');
const homeworks = require('./homeworks');

const sessions = {}; // TODO: Keep alive sessions

function createSession({ serverURL, sessionID, type, disableAES, disableCompress, keyModulus, keyExponent,
    accountType })
{
    const session = {
        id: ~~sessionID,
        server: getServer(serverURL),
        target: getTarget(type),

        request: -1,

        disableAES,
        disableCompress
    };

    initCipher(session, keyModulus, keyExponent);

    session.accountType = accountType;

    session.timetable = (...args) => timetable(session, ...args);
    session.marks = (...args) => marks(session, ...args);
    session.evaluations = (...args) => evaluations(session, ...args);
    session.absences = (...args) => absence(session, ...args);
    session.infos = (...args) => infos(session, ...args);
    session.homeworks = (...args) => homeworks(session, ...args);


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

function getTarget(type)
{
    let name;
    switch (type)
    {
    case 3:
        name = 'eleve';
        break;
    default:
        name = 'unknown';
    }

    return { name, id: type };
}

module.exports = {
    createSession,
    getSessions,
    removeSession,

    getServer
};
