const fs = require('fs').promises;
const path = require('path');

const errors = require('./errors');

const { decipher, getLoginKey, generateIV } = require('./cipher');
const { createSession, getServer } = require('./session');

const fetchParams = require('./fetch/params');
const fetchId = require('./fetch/id');
const fetchAuth = require('./fetch/auth');
const fetchUser = require('./fetch/user');

async function login(url, username, password, cas)
{
    const start = await getStart(getServer(url), username, password, cas || 'none');
    const session = createSession({
        serverURL: url,
        sessionID: start.h,

        type: start.a || 3,

        disableAES: !!start.sCrA,
        disableCompress: !!start.sCoA,

        keyModulus: start.MR,
        keyExponent: start.ER
    });

    const iv = generateIV();
    session.params = await fetchParams(session, iv);
    session.aesIV = iv;

    await auth(session, username, password, cas !== 'none');

    session.user = await fetchUser(session);

    return session;
}

async function getStart(url, username, password, cas)
{
    if (cas.toLowerCase() === 'api') {
        throw errors.UNKNOWN_CAS.drop(cas);
    }

    const casPath = `./cas/${cas}.js`;
    try {
        await fs.access(path.join(__dirname, casPath));
    } catch (_) {
        throw errors.UNKNOWN_CAS.drop(cas);
    }

    return await require(casPath)(url, username, password);
}

async function auth(session, username, password, fromCas)
{
    const id = await fetchId(session, username, fromCas);
    const key = getLoginKey(username, password, id.scramble, fromCas);

    let challenge;
    try {
        challenge = decipher(session, id.challenge, { scrambled: true, key });
    } catch (e) {
        throw errors.WRONG_CREDENTIALS.drop();
    }

    const userKey = await fetchAuth(session, challenge, key);
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
