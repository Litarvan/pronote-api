module.exports = ({ username, password, cas }) => require('./kdecole-wayf')({
    username,
    password,
    cas,

    acName: 'Lyon',
    casUrl: 'https://cas.ent.auvergnerhonealpes.fr/',
    idp: 'LYON-ATS'
});
