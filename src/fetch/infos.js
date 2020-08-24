const navigate = require('./navigate');
const parse = require('../data/types');

const PAGE_NAME = 'PageActualites';
const TAB_ID = 8;

/* This was not tested in Pronote 2020 */

async function getInfos(session)
{
    const infos = await navigate(session, PAGE_NAME, TAB_ID, {
        estAuteur: false
    });

    if (!infos) {
        return null;
    }

    return {
        categories: parse(infos.listeCategories).pronoteMap(({ estDefaut }) => ({
            isDefault: estDefaut
        })),
        infos: parse(infos.listeActualites).pronoteMap(({ dateDebut, elmauteur, listeQuestions }) => ({
            date: parse(dateDebut),
            author: parse(elmauteur).pronote(),
            content: parse(listeQuestions).pronoteMap(({ texte, listePiecesJointes }) => ({
                text: parse(texte).pronote(),
                files: parse(listePiecesJointes).pronoteMap()
            }))
        })) // TODO: Check values
    };
}

module.exports = getInfos;
