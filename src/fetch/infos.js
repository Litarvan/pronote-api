const { getFileURL } = require('../data/files');
const getInfos = require('./pronote/infos');

/* This was not tested in Pronote 2020 */

async function infos(session)
{
    const infos = await getInfos(session);
    const result = [];

    if (!infos) {
        return result;
    }

    for (const info of infos.infos)
    {
        result.push({
            date: info.date,
            title: info.name,
            author: info.author.name,
            content: info.content[0].text,
            htmlContent: info.content[0].text,
            files: info.content[0].files.map(f => ({ name: f.name, url: getFileURL(session, f) }))
        });
    }

    result.sort((a, b) => a.date - b.date);

    return result;
}

module.exports = infos;
