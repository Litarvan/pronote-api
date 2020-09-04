const wayf = require('./generics/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    casUrl: 'https://cas.mon-ent-occitanie.fr/',
    idp: 'MONTP-ATS',
    atenURL: 'https://famille.ac-montpellier.fr/login/'
});
