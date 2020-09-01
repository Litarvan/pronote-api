const { toPronoteWeek } = require('../data/dates');
const { getFileURL } = require('../data/files');

const getHomeworks = require('./pronote/homeworks');

async function homeworks(session, from = new Date(), to = null)
{
    if (!to || to < from) {
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

    for (const homework of homeworks) {
        if (homework.givenAt < from || homework.for > to) {
            continue;
        }

        result.push({
            description: homework.description,
            lesson: homework.lesson,
            subject: homework.subject,
            givenAt: homework.givenAt,
            for: homework.for,
            done: homework.done,
            difficultyLevel: homework.difficultyLevel,
            duration: homework.duration,
            color: homework.color,
            files: homework.files.map(f => ({ name: f.name, url: getFileURL(session, f) }))
        });
    }

    return result.sort((a, b) => a.for - b.for);
}

module.exports = homeworks;
