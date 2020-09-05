const wayf = require('./generics/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    casUrl: 'cas.monbureaunumerique.fr',
    idp: 'STRAS-ATS',
    atenURL: 'teleservices.ac-strasbourg.fr'
});
