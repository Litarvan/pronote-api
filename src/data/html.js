const stripHtml = require('string-strip-html');

function fromHTML(text)
{
    return stripHtml(text).result;
}

module.exports = fromHTML;
