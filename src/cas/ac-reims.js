const wayf = require('./generics/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    account,
    username,
    password,

    casUrl: 'cas.monbureaunumerique.fr',
    idp: 'REIMS-ATS',
    atenURL: 'services-familles.ac-reims.fr'
});
