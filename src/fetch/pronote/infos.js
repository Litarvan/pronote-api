const parse = require('../../data/types');
const navigate = require('./navigate');

const PAGE_NAME = 'PageActualites';
const TAB_ID = 8;
const ACCOUNTS = ['student', 'parent'];

async function getInfos(session, user)
{
    const infos = await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS, {
        estAuteur: false
    });

    if (!infos) {
        return null;
    }

    return {
        categories: parse(infos.listeCategories, ({ estDefaut }) => ({
            isDefault: estDefaut
        })),
        infos: parse(infos.listeActualites, ({ dateDebut, elmauteur, listeQuestions }) => ({
            date: parse(dateDebut),
            author: parse(elmauteur),
            content: parse(listeQuestions, ({ texte, listePiecesJointes }) => ({
                text: parse(texte),
                files: parse(listePiecesJointes)
            }))
        }))
    };
}

module.exports = getInfos;
