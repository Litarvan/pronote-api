const mbn = require('./mbn');

module.exports = function(params)
{
    return mbn(params, {
        name: 'ac-reims',
        idp: 'REIMS-ATS_parent_eleve'
    });
};
