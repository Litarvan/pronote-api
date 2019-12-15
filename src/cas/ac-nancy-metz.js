module.exports = ({ username, password, url }) => require('./mbn')({
    username,
    password,
    url,

    acName: 'Nancy-Metz',
    baseURL: 'https://cas.monbureaunumerique.fr/',
    idp: 'NAN-ME-ATS',
    atenURL: 'https://teleservices.ac-nancy-metz.fr/'
});
