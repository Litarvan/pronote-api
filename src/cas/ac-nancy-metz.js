const wayf = require('./generics/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    account,
    username,
    password,

    casUrl: 'cas.monbureaunumerique.fr',
    idp: 'NAN-ME-ATS',
    atenURL: 'teleservices.ac-nancy-metz.fr'
});
