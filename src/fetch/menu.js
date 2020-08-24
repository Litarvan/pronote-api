const { toPronoteDate } = require('../data/dates');
const parse = require('../data/types');

const navigate = require('./navigate');

const PAGE_NAME = 'PageMenus';
const TAB_ID = 10;

async function getMenu(session, day = new Date())
{
    const menu = await navigate(session, PAGE_NAME, TAB_ID, {
        date: {
            _T: 7,
            V: toPronoteDate(day)
        }
    });

    if (!menu) {
        return null;
    }

    return {
        hasLunch: menu.AvecRepasMidi,
        hasDiner: menu.AvecRepasSoir,
        filledWeeks: parse(menu.DomaineDePresence),
        menus: parse(menu.ListeJours).map(({ Date, ListeRepas }) => ({
            date: parse(Date),
            meals: parse(ListeRepas).pronoteMap(({ ListePlats }) => ({
                content: parse(ListePlats).pronoteMap(({ ListeAliments }) => ({
                    lines: parse(ListeAliments).pronoteMap(({ listeLabelsAlimentaires }) => ({
                        labels: parse(listeLabelsAlimentaires).pronoteMap(({ couleur }) => ({
                            color: couleur
                        }))
                    }))
                }))
            }))
        }))
    };
}

module.exports = getMenu;
