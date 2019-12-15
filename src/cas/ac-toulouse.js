module.exports = ({ username, password, url }) => require('./kdecole-wayf')({
    username,
    password,
    url,

    acName: 'Toulouse',
    casUrl: 'https://cas.mon-ent-occitanie.fr/',
    idp: 'TOULO-ENT'
});
