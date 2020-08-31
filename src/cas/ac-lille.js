const wayf = require('./kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    casUrl: 'https://cas.savoirsnumeriques62.fr/',
    idp: 'ATS_parent_eleve',
    atenURL: 'https://teleservices.ac-lille.fr/login/'
});
