const { getFileURL } = require('../data/files');
const fromHTML = require('../data/html');

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
        result.push({
            date: info.date,
            title: info.name,
            author: info.author.name,
            content: fromHTML(info.content[0].text),
            htmlContent: info.content[0].text,
            files: info.content[0].files.map(f => ({ name: f.name, url: getFileURL(session, f) }))
        });
    }

    result.sort((a, b) => a.date - b.date);

    return result;
}

module.exports = infos;
