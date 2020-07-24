const fs = require('fs').promises;
const path = require('path');

const errors = require('./errors');
const { createSession, getServer } = require('./session');

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

    await auth(session);

    return session;
}

async function getStart(url, username, password, cas)
{
    if (cas.toLowerCase() === 'api') {
        throw errors.UNKNOWN_CAS(cas);
    }

    const casPath = `./cas/${cas}.js`;
    try {
        await fs.access(path.join(__dirname, casPath));
    } catch (_) {
        throw errors.UNKNOWN_CAS(cas);
    }

    return await require(casPath)(url, username, password);
}

async function auth(session)
{
    // TODO
}

module.exports = {
    login,

    getStart,
    auth
};
