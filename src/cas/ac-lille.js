const wayf = require('./generics/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    account,
    username,
    password,

    casUrl: 'cas.savoirsnumeriques62.fr',
    idp: 'ATS_parent_eleve',
    atenURL: 'teleservices.ac-lille.fr'
});
