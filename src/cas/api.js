const errors = require('../errors');

function extractStart(html)
{
    if (html.includes('Votre adresse IP est provisoirement suspendue')) { // Top 10 anime betrayals
        throw errors.BANNED();
    }

    html = html.replace(new RegExp(' ', 'g'), '').replace(new RegExp('\n', 'g'), '');

    const from = "Start(";
    const to = ")}catch";

    const start = html.substring(html.indexOf(from) + from.length, html.indexOf(to));
    const json = start
        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ')
        .replace(/'/g, '"');

    return JSON.parse(json);
}

module.exports = {
    extractStart
};
