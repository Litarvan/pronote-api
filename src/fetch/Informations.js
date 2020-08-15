const parse = require('../data/types');
const { fromPronote, toPronote } = require('../data/objects');

const navigate = require('./navigate');

const PAGE_NAME = 'PageActualites';
const TAB_ID = 8;

async function getinfos(session)
{
    const infos  = await navigate(session, PAGE_NAME, TAB_ID, {
        estAuteur: false
    });

    if (!infos) {
        return null;
    }
    return infos.listeActualites.V;
}

module.exports = getinfos;
