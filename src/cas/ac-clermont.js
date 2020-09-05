const wayf = require('./generics/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    casUrl: 'cas.ent.auvergnerhonealpes.fr',
    idp: 'CLERMONT-ATS'
});
