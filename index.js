const { login } = require('./src/auth');

const getParams = require('./src/fetch/params');

const errors = require('./src/errors');

// -----------------------------------------------------------

const { createSession } = require('./src/session');
const { cipher, decipher } = require('./src/cipher');
const { getStart, auth } = require('./src/auth');

const fetchParams = require('./src/fetch/params');
const fetchId = require('./src/fetch/id');
const fetchAuth = require('./src/fetch/auth');
const fetchUser = require('./src/fetch/user');

const http = require('./src/http');
const request = require('./src/request');

module.exports = {
    // High-level API
    login,

    getParams,

    errors,

    // Low-level API (if you need to use this, you can, but it may mean I've forgotten a use case, please open an issue!)
    createSession,
    cipher, decipher,
    getStart, auth,

    fetchParams,
    fetchId,
    fetchAuth,
    fetchUser,

    http,
    request
};
