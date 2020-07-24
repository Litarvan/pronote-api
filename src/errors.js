const PRONOTE = ({ title, message }) => ({
    code: -1,
    message: title + (title && message ? ' - ' : '') + message
});

const UNKNOWN_CAS = cas => ({
    code: 1,
    message: `Unknown CAS '${cas}' (use 'none' for no CAS)`
});

const BANNED = () => ({
    code: 2,
    message: `Your IP address is temporarily banned because of too many failed authentication attempts`
});

module.exports = {
    PRONOTE,
    UNKNOWN_CAS,
    BANNED
};
