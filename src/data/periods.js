function getPeriodBy(session, period)
{
    const periods = session.params.periods;
    if (!period) {
        const now = Date.now();
        return periods.find(p => now >= p.from && now <= p.to && p.kind === 'trimester') || periods[0];
    } else if (typeof period === 'string') {
        for (const p of periods) {
            if (p.name === period) {
                return p;
            }
        }
    }

    return period;
}

module.exports = {
    getPeriodBy
};
