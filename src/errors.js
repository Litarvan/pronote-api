const UNKNOWN_CAS = cas => ({
    code: 1,
    message: `Unknown CAS '${cas}' (use 'none' for no CAS)`
});

module.exports = {
    UNKNOWN_CAS
};
