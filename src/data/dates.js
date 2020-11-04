function toPronoteWeek(session, date)
{
    const firstWeek = toUTCWeek(session.params.firstDay);
    const week = toUTCWeek(date);

    if (week >= firstWeek) {
        return week - firstWeek + 1;
    }

    return 52 - (firstWeek - week) + 1; // Trust me this works
}

function toUTCWeek(date)
{
    const firstDay = new Date((new Date()).getFullYear(), 0, 1);
    return Math.ceil((((date - firstDay) / 86400000) + firstDay.getDay() + 1) / 7);
}

function toPronoteDay(session, date)
{
    return Math.ceil((date - session.params.firstDay) / 86400000);
}

function fromPronoteDay(session, day)
{
    const date = new Date(session.params.firstDay.getTime());
    date.setDate(date.getDate() + day - 1);

    return date;
}

function toPronoteDate(date)
{
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ` +
           `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function fromPronoteHours(hours)
{
    return ~~hours[0] + ~~hours.substring(2) / 60;
}

function parseDate(string)
{
    const date = new Date();
    const split = string.split(' ');

    const day = split[0].split('/');

    date.setFullYear(~~day[2], (~~day[1]) - 1, ~~day[0]);
    date.setMilliseconds(0);

    if (split.length > 1)
    {
        const time = split[1].split(':');

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

    return date;
}

module.exports = {
    toPronoteWeek,
    toUTCWeek,

    toPronoteDay,
    fromPronoteDay,

    toPronoteDate,
    parseDate,

    fromPronoteHours
};
