const wayf = require('./types/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    casUrl: 'https://cas.monbureaunumerique.fr/',
    idp: 'REIMS-ATS',
    atenURL: 'https://services-familles.ac-reims.fr/login/'
});
