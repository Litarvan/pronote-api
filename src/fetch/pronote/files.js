const navigate = require('./navigate');

const PAGE_NAME = 'RessourcePedagogique';
const TAB_ID = 99;
const ACCOUNTS = ['student'];

async function getFiles(session)
{
    return await navigate(session, PAGE_NAME, TAB_ID, ACCOUNTS, {
        avecRessourcesPronote: true,
        avecRessourcesEditeur: false
    });
}


module.exports = getFiles;
