function fromPronote({ N, L, G, ...obj }, fn, gName = 'type') {
    const result = {};

    if (typeof fn === 'string') {
        gName = fn;
        fn = null;
    }

    if (N) {
        result.id = N;
    }
    if (L) {
        result.name = L;
    }
    if (G && gName) {
        result[gName] = G;
    }

    return {
        ...result,
        ...(fn ? fn(G && gName ? obj : { G, ...obj }) : {})
    };
}

function toPronote({ id, name, G}) {
    const result = {};

    if (id) {
        result.N = id;
    }
    if (name) {
        result.L = name;
    }
    if (G) {
        result.G = G;
    }

    return result;
}

module.exports = {
    fromPronote,
    toPronote
};
