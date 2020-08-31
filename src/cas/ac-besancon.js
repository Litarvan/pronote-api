const wayf = require('./kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    casUrl: 'https://cas.eclat-bfc.fr/',
    idp: 'BESANC-ATS_parent_eleve_2D',
    atenURL: 'https://teleservices.ac-besancon.fr/login/'
});
