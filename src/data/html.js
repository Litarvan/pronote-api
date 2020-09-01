const stripHtml = require('string-strip-html');

function fromHTML(text)
{
    if (!text) {
        if (text === undefined) {
            return null;
        }

        return text;
    }

    return stripHtml(text).result;
}

module.exports = fromHTML;
