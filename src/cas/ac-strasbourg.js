module.exports = ({ username, password, url }) => require('./mbn')({
    username,
    password,
    url,

    acName: 'Strasbourg',
    baseURL: 'https://cas.monbureaunumerique.fr/',
    idp: 'STRAS-ATS',
    atenURL: 'https://teleservices.ac-strasbourg.fr/'
});
