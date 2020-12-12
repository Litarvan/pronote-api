const { toPronote } = require('../../data/objects');

const navigate = require('./navigate');

const PAGE_NAME = 'ListeRessources';
const TAB_ID = 123;
const ACCOUNTS = ['administration'];

async function getListeProfs(session, user, period)
{
    const listeProfs = await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS, {
        classe: null,
        periode: period.name ? toPronote(period) : period
    });

    if (!listeProfs) {
        return null;
    }

    return listeProfs
}

module.exports = getListeProfs;
