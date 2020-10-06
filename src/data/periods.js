function getPeriodBy(session, period, type = null)
{
    const Type = ['trimester', 'semester', 'year'];
    const periods = session.params.periods;
    if (!type || Type.indexOf(type) === -1) {
        type = 'trimester'
    }
    if (!period) {
        const now = Date.now();
        return periods.find(p => now >= p.from && now <= p.to && p.kind === type) || periods[5];
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
