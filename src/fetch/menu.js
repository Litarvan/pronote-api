const getMenu = require('./pronote/menu');

async function menu(session, user, from = new Date(), to = null)
{
    if (!to || to < from) {
        to = new Date(from.getTime());
        to.setDate(to.getDate() + 1);
        to.setHours(to.getHours() - 1);
    }

    const result = [];
    const date = new Date(from.getTime());

    // eslint-disable-next-line no-unmodified-loop-condition
    while (date < to) {
        const menus = await getMenu(session, user, date);
        if (!menus) {
            return null;
        }

        for (const menu of menus.menus) {
            if (menu.date < from || menu.date > to) {
                continue;
            }

            result.push({
                date: menu.date,
                meals: menu.meals.map(m => m.content.map(c => c.lines.map(({ name, labels }) => ({
                    name,
                    labels: labels.map(({ name, color }) => ({ name, color }))
                }))))
            });
        }

        date.setDate(date.getDate() + 7);
    }

    return result;
}

module.exports = menu;
