module.exports = ({ username, password, cas }) => require('./kdecole-wayf')({
    username,
    password,
    cas,

    acName: 'Clermont-Ferrand',
    casUrl: 'https://cas.ent.auvergnerhonealpes.fr/',
    idp: 'CLERMONT-ATS'
});
