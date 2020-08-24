const PRONOTE = error(-1, ({ title, message }) => title + (title && message ? ' - ' : '') + message);
const UNKNOWN_CAS = error(1, cas => `Unknown CAS '${cas}' (use 'none' for no CAS)`);
const BANNED = error(2, 'Your IP address is temporarily banned because of too many failed authentication attempts');
const WRONG_CREDENTIALS = error(3, 'Wrong user credentials');
const UNKNOWN_ACCOUNT = error(4, typeAccount => `Unknown ACCOUNT TYPE '${typeAccount}'`);

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
    UNKNOWN_ACCOUNT
};
