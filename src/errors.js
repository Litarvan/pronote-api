const PRONOTE = error(-1, ({ title, message }) => title + (title && message ? ' - ' : '') + message);
const UNKNOWN_CAS = error(1, cas => `Unknown CAS '${cas}' (use 'none' for no CAS)`);
const BANNED = error(2, 'Your IP address is temporarily banned because of too many failed authentication attempts');
const WRONG_CREDENTIALS = error(3, 'Wrong user credentials');
const UNKNOWN_ACCOUNT = error(4, typeAccount => `Unknown account type '${typeAccount}'`);
const SESSION_EXPIRED = error(5, 'Session has expired due to inactivity or error');
const RATE_LIMITED = error(6, 'You are being rate limited because of too many failed requests');
const CLOSED = error(7, 'The instance is closed, try again later');

function error(code, message)
{
    return {
        code,
        drop: (...args) => ({
            code,
            message: typeof message === 'string' ? message : message(...args)
        })
    }
}

module.exports = {
    PRONOTE,
    UNKNOWN_CAS,
    BANNED,
    WRONG_CREDENTIALS,
    UNKNOWN_ACCOUNT,
    SESSION_EXPIRED,
    RATE_LIMITED,
    CLOSED
};
