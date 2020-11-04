const navigate = require('./navigate');

const PAGE_NAME = 'RessourcePedagogique';
const TAB_ID = 99;
const ACCOUNTS = ['student'];

async function getFiles(session, user)
{
    return await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS, {
        avecRessourcesPronote: true,
        avecRessourcesEditeur: false
    });
}


module.exports = getFiles;
