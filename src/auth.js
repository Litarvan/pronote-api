const errors = require('./errors');
const cas = require('./cas');
const { decipher, getLoginKey } = require('./cipher');
const getAccountType = require('./accounts');
const PronoteSession = require('./session');

const getParams = require('./fetch/pronote/params');
const { getId, getAuthKey } = require('./fetch/pronote/auth');
const getUser = require('./fetch/pronote/user');

async function login(url, username, password, cas = 'none', account = 'student')
{
    const type = getAccountType(account);
    const server = getServer(url);
    const start = await getStart(server, username, password, cas, type);
    const session = new PronoteSession({
        serverURL: server,
        sessionID: start.h,

        type,

        disableAES: !!start.sCrA,
        disableCompress: !!start.sCoA,

        keyModulus: start.MR,
        keyExponent: start.ER
    })

    session.params = await getParams(session);
    if (cas === 'none') {
        await auth(session, username, password, false);
    } else {
        await auth(session, start.e, start.f, true);
    }
    session.user = await getUser(session);

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

async function getStart(url, username, password, casName, type)
{
    if (casName === 'names' || casName === 'getCAS') {
        throw errors.UNKNOWN_CAS.drop(casName);
    }

    const account = typeof type === 'string' ? getAccountType(type) : type;
    return await cas[casName](url, account, username, password);
}

async function auth(session, username, password, fromCas)
{
    const id = await getId(session, username, fromCas);
    const key = getLoginKey(username, password, id.scramble, fromCas);

    let challenge;
    try {
        challenge = decipher(session, id.challenge, { scrambled: true, key });
    } catch (e) {
        throw errors.WRONG_CREDENTIALS.drop();
    }

    const userKey = await getAuthKey(session, challenge, key);
    if (!userKey) {
        throw errors.WRONG_CREDENTIALS.drop();
    }

    session.aesKey = decipher(session, userKey, { key, asBytes: true });
}

module.exports = {
    login,

    getStart,
    auth
};
