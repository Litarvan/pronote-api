const { toPronoteWeek } = require('./data/weeks');
const { getFileURL } = require('./data/files');
const getHomeworks = require('./fetch/homeworks');

async function homeworks(session, from = new Date(), to = null)
{
    if (!to || to > from) {
        to = new Date(from.getTime());
        to.setDate(to.getDate() + 1);
    }

    const fromWeek = toPronoteWeek(session, from);
    const toWeek = toPronoteWeek(session, to);

    const homeworks = await getHomeworks(session, fromWeek, toWeek);
    if (!homeworks) {
        return null;
    }

    const result = [];

    for (const homework of homeworks.homeworks) {
        if (homework.from < from || homework.from > to) {
            continue;
        }

        const content = homework.content[0]; // Maybe on some instances there will be multiple entries ? Check this
        result.push({
            subject: homework.subject.name,
            teachers: homework.teachers.map(t => t.name),
            from: homework.from,
            to: homework.to,
            color: homework.color,
            title: content.name,
            description: content.description.replace('<br/>', '\n'),
            files: content.files.map(f => ({ name: f.name, url: getFileURL(session, f) })),
            category: content.category.name
        });
    }

    return result.sort((a, b) => a.from - b.from);
}

module.exports = homeworks;
