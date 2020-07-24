const fs = require('fs').promises;
const path = require('path');

const errors = require('./errors');
const request = require('./request');
const { createSession, getServer } = require('./session');

const fetchParams = require('./fetch/params');

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

    session.params = await fetchParams(session);
    await auth(session, username, password, cas !== 'none');

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

async function auth(session, username, password, fromCas)
{
    const challenge = await request(session, 'Identification', {
        donnees: {
            genreConnexion: 0,
            genreEspace: session.target.id,
            identifiant: username,
            pourENT: fromCas,
            enConnexionAuto: false,
            demandeConnexionAuto: false,
            demandeConnexionAppliMobile: false,
            demandeConnexionAppliMobileJeton: false,
            uuidAppliMobile: '',
            loginTokenSAV: ''
        }
    });

    // TODO
}

module.exports = {
    login,

    getStart,
    auth
};
