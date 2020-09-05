const wayf = require('./generics/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    casUrl: 'cas.mon-ent-occitanie.fr',
    idp: 'MONTP-ATS',
    atenURL: 'famille.ac-montpellier.fr'
});
