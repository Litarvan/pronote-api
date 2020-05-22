module.exports = ({ username, password, url }) => require('./kdecole-wayf')({
    username,
    password,
    url,

    acName: 'Rouen',
    casUrl: 'https://cas.arsene76.fr/',
    idp: 'ATS_parent_eleve'
});
