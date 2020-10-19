const { toPronoteDate } = require('../../data/dates');
const parse = require('../../data/types');

const navigate = require('./navigate');

const PAGE_NAME = 'PageMenus';
const TAB_ID = 10;
const ACCOUNTS = ['student', 'parent'];

async function getMenu(session, user, day = new Date())
{
    const menu = await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS, {
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
        menus: parse(menu.ListeJours, false).map(({ Date, ListeRepas }) => ({
            date: parse(Date),
            meals: parse(ListeRepas, ({ ListePlats }) => ({
                content: parse(ListePlats, ({ ListeAliments }) => ({
                    lines: parse(ListeAliments, ({ listeLabelsAlimentaires }) => ({
                        labels: parse(listeLabelsAlimentaires, ({ couleur }) => ({
                            color: couleur
                        }))
                    }))
                }))
            }))
        }))
    };
}

module.exports = getMenu;
