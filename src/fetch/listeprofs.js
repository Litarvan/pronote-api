const { getPeriodBy } = require('../data/periods');

const getListeProfs = require('./pronote/listeprofs');

// eslint-disable-next-line complexity
async function listeprofs(session, user, period = null, from = null, to = null, type = null)
{
    const p = getPeriodBy(session, !period && !type && from && to ? 'Trimestre 1' : period, type);
    const result = await getListeProfs(session, user, p, from || p.from, to || p.to);

    if (!result) {
        return null;
    }
    const listeprofs = result.listeRessources.V.map(getFulldata)

    return listeprofs;
}

function getFulldata(data) {
    return {
        name: data.L,
        civilite: data.civ,
        prenom: data.prenom
    }
}

module.exports = listeprofs;
