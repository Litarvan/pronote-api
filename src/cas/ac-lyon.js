const wayf = require('./types/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    casUrl: 'https://cas.ent.auvergnerhonealpes.fr/',
    idp: 'LYON-ATS'
});
