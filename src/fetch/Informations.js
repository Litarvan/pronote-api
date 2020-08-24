const navigate = require('./navigate');
const parse = require('../data/types');

const PAGE_NAME = 'PageActualites';
const TAB_ID = 8;

async function getInfos(session)
{
    const infos = await navigate(session, PAGE_NAME, TAB_ID, {
        estAuteur: false
    });

    if (!infos) {
        return null;
    }

    return parse(infos.listeActualites);
}

module.exports = getInfos;
