const { initCipher } = require('./cipher');
const getAccountType = require('./accounts');

const timetable = require('./fetch/timetable');
const marks = require('./fetch/marks');
const evaluations = require('./fetch/evaluations');
const absences = require('./fetch/absences');
const infos = require('./fetch/infos');
const contents = require('./fetch/contents');
const homeworks = require('./fetch/homeworks');
const menu = require('./fetch/menu');

const keepAlive = require('./fetch/pronote/keepAlive');
const logout = require('./fetch/pronote/logout');

const DEFAULT_KEEP_ALIVE_RATE = 120; // In seconds. 120 is the Pronote default 'Presence' request rate.
const GENERAL_REQUESTS = {
    keepAlive, logout
};
const REQUESTS = {
    timetable, marks, evaluations, absences, contents,
    infos, homeworks, menu
};

class PronoteSession
{
    constructor({ serverURL, sessionID, type, disableAES, disableCompress, keyModulus, keyExponent })
    {
        this.id = ~~sessionID;
        this.server = serverURL;
        this.type = typeof type === 'string' ? getAccountType(type) : type;

        this.disableAES = disableAES;
        this.disableCompress = disableCompress;

        initCipher(this, keyModulus, keyExponent);

        this.request = -1;
        this.isKeptAlive = false;

        for (const [req, method] of Object.entries(GENERAL_REQUESTS)) {
            this[req] = () => method(this);
        }
        for (const [req, method] of Object.entries(REQUESTS)) {
            this[req] = (...args) => callRequest(method, this, args);
        }
    }

    setKeepAlive(enabled, onError, rate = DEFAULT_KEEP_ALIVE_RATE)
    {
        if (enabled === this.isKeptAlive) {
            return;
        }

        if (enabled) {
            this.interval = setInterval(() => {
                this.keepAlive().catch(err => {
                    this.setKeepAlive(false);
                    if (onError) {
                        onError(err);
                    }
                });
            }, rate * 1000);
        } else {
            clearInterval(this.interval);
        }

        this.isKeptAlive = enabled;
    }
}

function callRequest(method, session, args)
{
    switch (session.type.name)
    {
    case 'student':
        return method(session, session.user, ...args);
    default:
        return method(session, ...args);
    }
}

module.exports = PronoteSession;
