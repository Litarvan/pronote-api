const { toPronote } = require('./objects');
const { cipher } = require('../cipher');

const EXTERNAL_FILES_FOLDER = 'FichiersExternes/';

function getFileURL(session, { id, name, type })
{
    const fileID = cipher(session, JSON.stringify(toPronote({ id, type })));
    const fileName = encodeURIComponent(encodeURIComponent(name)); // *Clown emoji*

    return session.server + EXTERNAL_FILES_FOLDER + fileID + '/' + fileName + '?Session=' + session.id;
}

module.exports = { getFileURL };
