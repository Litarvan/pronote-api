const { fromPronote } = require('./objects');

function parseDate(str)
{
    const date = new Date();
    const split = str.split(' ');

    const day = split[0].split('/');

    date.setFullYear(~~day[2], (~~day[1]) - 1, ~~day[0]);
    date.setMilliseconds(0);

    if (split.length > 1) {
        const time = split[1].split(':');

        date.setHours(~~time[0]);
        date.setMinutes(~~time[1]);
        date.setSeconds(~~time[2]);
    } else {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
    }

    return date;
}

function parseRange(str)
{
    const content = str.substring(1, str.length - 1).split(',');
    const result = [];

    for (const val of content) {
        if (val.includes('..')) {
            const index = val.indexOf('..');
            for (let i = ~~val.substring(0, index); i <= ~~val.substring(index + 2); i++) {
                result.push(i);
            }
        } else {
            result.push(~~val);
        }
    }

    return result;
}

function parse({ _T: type, V: value } = {}, f = null, g = 'type')
{
    if (!value) {
        if (value === undefined) {
            return null;
        }

        return value;
    }

    switch (type) {
    case 7: // Date
        return parseDate(value);
    case 8: // ? (Range)
    case 11: // ? (Range)
    case 26: // ? (Range)
        return parseRange(value);
    case 10: // Mark / Number
        value = value.replace('|', '-');

        if (value.indexOf(',') !== -1) {
            return parseFloat(value.replace(',', '.'));
        }

        return ~~value;
    case 21: // HTML content
    case 23: // URL
    case 24: // Object (includes Array)
    case 25: // Resource
    default:
        if (f !== false && value.map) {
            return value.map(o => fromPronote(o, f, g));
        } else if (f !== false && (value.N || value.L)) {
            return fromPronote(value, f, g);
        }

        return value;
    }
}

module.exports = parse;
