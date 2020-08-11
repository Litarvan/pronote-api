function fromPronote({ N, L }) {
    return {
        id: N,
        name: L
    };
}

function toPronote({ id, name }) {
    const result = {};

    if (id) {
        result.N = id;
    }
    if (name) {
        result.L = name;
    }

    return result;
}

module.exports = {
    fromPronote,
    toPronote
};
