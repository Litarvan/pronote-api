const getFiles = require('./pronote/files');
const { parseDate } = require('../data/dates');
const { getFileURL } = require('../data/files');

async function files(session, user) {
    const files = await getFiles(session, user);
    if (!files) {
        return null;
    }

    const result = [];

    const subjects = {};
    for (const subject of files.listeMatieres.V) {
        subjects[subject.N] = subject.L;
    }

    for (const file of files.listeRessources.V) {
        result.push({
            time: parseDate(file.date.V),
            subject: subjects[file.matiere.V.N],
            name: file.ressource.V.L,
            url: getFileURL(session, { id: file.ressource.V.N, name: file.ressource.V.L, type: file.ressource.V.G })
        });
    }
    return result;
}

module.exports = files;
