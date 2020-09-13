const wayf = require('./generics/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    account,
    username,
    password,

    casUrl: 'cas.ecollege.haute-garonne.fr',
    idp: 'ATS_parent_eleve'
});
