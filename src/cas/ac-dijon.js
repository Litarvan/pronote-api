const wayf = require('./generics/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    account,
    username,
    password,

    casUrl: 'cas.eclat-bfc.fr',
    idp: 'DIJON-ATS_parent_eleve_2D',
    atenURL: 'teleservices.ac-dijon.fr'
});
