module.exports = ({ username, password, url }) => require('./kdecole-wayf')({
    username,
    password,
    url,

    acName: 'Grenoble',
    casUrl: 'https://cas.ent.auvergnerhonealpes.fr/',
    idp: 'GRE-ATS'
});
