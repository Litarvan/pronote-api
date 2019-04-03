const elycee = require('./elycee');

module.exports = function(params)
{
    return elycee(params, {
        name: 'ac-grenoble',
        base: 'https://cas.elycee.rhonealpes.fr/',
        idp: 'GRE-ATS_parent_eleve'
    });
};
