module.exports = ({ username, password, url }) => require('./kdecole-wayf')({
    username,
    password,
    url,

    acName: 'Strasbourg',
    casUrl: 'https://cas.monbureaunumerique.fr/',
    idp: 'STRAS-ATS',
    atenURL: 'https://teleservices.ac-strasbourg.fr/login/'
});
