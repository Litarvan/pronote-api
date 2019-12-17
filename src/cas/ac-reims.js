module.exports = ({ username, password, url }) => require('./kdecole-wayf')({
    username,
    password,
    url,

    acName: 'Reims',
    casUrl: 'https://cas.monbureaunumerique.fr/',
    idp: 'REIMS-ATS',
    atenURL: 'https://services-familles.ac-reims.fr/login/'
});
