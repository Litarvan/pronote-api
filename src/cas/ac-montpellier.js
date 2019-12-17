module.exports = ({ username, password, url }) => require('./kdecole-wayf')({
    username,
    password,
    url,

    acName: 'Montpellier',
    casUrl: 'https://cas.mon-ent-occitanie.fr/',
    idp: 'MONTP-ATS',
    atenURL: 'https://famille.ac-montpellier.fr/login/'
});
