module.exports = ({ username, password, url }) => require('./mbn')({
    username,
    password,
    url,

    acName: 'Reims',
    baseURL: 'https://cas.monbureaunumerique.fr/',
    idp: 'REIMS-ATS',
    atenURL: 'https://services-familles.ac-reims.fr/'
});
