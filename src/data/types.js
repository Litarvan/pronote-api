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

function parse({ _T: type, V: value } = {})
{
    if (!value) {
        return value;
    }

    switch (type) {
    case 7:
        return parseDate(value);
    case 8: // ?
    case 11: // ?
    case 26: // ?
        return parseRange(value);
    case 10: // Mark / Number
        return ~~value;
    case 23: // URL
    case 24: // Object (includes Array)
    case 25: // Resource
    default:
        return value;
    }
}

module.exports = parse;
