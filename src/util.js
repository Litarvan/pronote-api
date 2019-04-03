Date.prototype.getWeek = function()
{
    let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    let dayNum = d.getUTCDay() || 7;

    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

function parseDate(string)
{
    let date = new Date();
    let split = string.split(' ');

    let day = split[0].split('/');

    date.setFullYear(~~day[2], (~~day[1]) - 1, ~~day[0]);
    date.setMilliseconds(0);

    if (split.length > 1)
    {
        let time = split[1].split(':');

        date.setHours(~~time[0]);
        date.setMinutes(~~time[1]);
        date.setSeconds(~~time[2]);
    }
    else
    {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
    }

    return getTime(date);
}

function parseMark(string)
{
    return string === 'Abs' ? -1 : parseFloat(string.replace(',', '.'));
}

function parsePeriod(string)
{
    return ~~string.substring(string.length - 1);
}

function decodeHTML(string)
{
    let entities = {
        'amp': '&',
        'apos': '\'',
        'lt': '<',
        'gt': '>',
        'quot': '"',
        'nbsp': '\xa0'
    };

    string = string.replace( /&([a-z]+);/ig, (match, entity) => {
        entity = entity.toLowerCase();
        if (entities.hasOwnProperty(entity))
        {
            return entities[entity];
        }

        return match;
    });

    return string.replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(dec);
    });
}

function extractStart(html)
{
    html = html.replace(new RegExp(' ', 'g'), '').replace(new RegExp('\n', 'g'), '');

    let from = "Start(";
    let to = ")}catch";

    return asJSON(html.substring(html.indexOf(from) + from.length, html.indexOf(to)));
}

function asJSON(json)
{
    return JSON.parse(json.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ').replace(new RegExp("'", 'g'), '"'));
}

function getTime(date)
{
    return date.getTime() + (/*date.getTimezoneOffset()*//*-120*/-120 * 60 * 1000);
}

module.exports = {
    parseDate,
    parsePeriod,
    parseMark,
    decodeHTML,
    extractStart,
    asJSON,
    getTime
};
