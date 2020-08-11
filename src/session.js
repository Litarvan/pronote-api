const { initCipher } = require('./cipher');
const timetable = require('./timetable');

const sessions = {}; // TODO: Keep alive sessions

function createSession({ serverURL, sessionID, type, disableAES, disableCompress, keyModulus, keyExponent })
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

    session.timetable = date => timetable(session, date);

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
