const wayf = require('./kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    casUrl: 'https://cas.monbureaunumerique.fr/',
    idp: 'NAN-ME-ATS',
    atenURL: 'https://teleservices.ac-nancy-metz.fr/login/'
});
