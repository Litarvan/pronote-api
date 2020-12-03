const { h64 } = require('xxhashjs');

function withId(obj, fields, extraData)
{
    const result = {};
    for (const field of fields) {
        result[field] = obj[field];
    }

    if (extraData) {
        result.__extraData = extraData;
    }

    return {
        id: h64(JSON.stringify(result), 0).toString(16),
        ...obj
    };
}

function checkDuplicates(objs)
{
    for (const obj of objs) {
        const duplicates = objs.filter(o => o.id === obj.id);

        if (duplicates.length > 1) {
            duplicates.forEach((d, i) => d.id = d.id.substring(0, d.id.length - 1) + i);
        }
    }

    return objs;
}

module.exports = { withId, checkDuplicates };
