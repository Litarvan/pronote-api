module.exports = ({ username, password, url }) => require('./kdecole-wayf')({
    username,
    password,
    url,

    acName: 'Clermont-Ferrand',
    casUrl: 'https://cas.ent.auvergnerhonealpes.fr/',
    idp: 'CLERMONT-ATS'
});
