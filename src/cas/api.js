const errors = require('../errors');

function extractStart(html)
{
    if (html.includes('Votre adresse IP est provisoirement suspendue')) { // Top 10 anime betrayals
        throw errors.BANNED.drop();
    }

    html = html.replace(/ /ug, '').replace(/\n/ug, '');

    const from = 'Start(';
    const to = ')}catch';

    const start = html.substring(html.indexOf(from) + from.length, html.indexOf(to));
    const json = start.
        replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/gu, '"$2": ').
        replace(/'/gu, '"');

    return JSON.parse(json);
}

module.exports = {
    extractStart
};
