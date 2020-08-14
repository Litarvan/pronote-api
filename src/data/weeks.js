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

module.exports = {
    toPronoteWeek,
    toUTCWeek,
    toPronoteDay,
    fromPronoteDay
};
