const wayf = require('./kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    casUrl: 'https://cas.monbureaunumerique.fr/',
    idp: 'STRAS-ATS',
    atenURL: 'https://teleservices.ac-strasbourg.fr/login/'
});
