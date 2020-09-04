const wayf = require('./types/kdecole-wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    casUrl: 'https://cas.arsene76.fr/',
    idp: 'ATS_parent_eleve'
});
