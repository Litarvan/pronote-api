const { getFileURL } = require('../data/files');
const fromHTML = require('../data/html');
const { withId, checkDuplicates } = require('../data/id');

const getInfos = require('./pronote/infos');

async function infos(session, user)
{
    const infos = await getInfos(session, user);
    if (!infos) {
        return null;
    }

    const result = [];

    for (const info of infos.infos)
    {
        result.push(withId({
            date: info.date,
            title: info.name,
            author: info.author.name,
            content: fromHTML(info.content[0].text),
            htmlContent: info.content[0].text,
            files: info.content[0].files.map(f => withId({ name: f.name, url: getFileURL(session, f) }, ['name']))
        }, ['date', 'title']));
    }

    checkDuplicates(result).sort((a, b) => a.date - b.date);

    return result;
}

module.exports = infos;
