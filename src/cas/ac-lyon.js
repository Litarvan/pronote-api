module.exports = ({ username, password, url }) => require('./kdecole-wayf')({
    username,
    password,
    url,

    acName: 'Lyon',
    casUrl: 'https://cas.ent.auvergnerhonealpes.fr/',
    idp: 'LYON-ATS'
});
