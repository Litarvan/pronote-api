module.exports = ({ username, password, cas }) => require('./kdecole-wayf')({
    username,
    password,
    cas,

    acName: 'Grenoble',
    casUrl: 'https://cas.ent.auvergnerhonealpes.fr/',
    idp: 'GRE-ATS'
});
