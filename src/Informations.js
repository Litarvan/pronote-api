const getinfos = require('./fetch/Informations');
const parse = require('./data/types');

async function infos(session)
{
    const infos = await getinfos(session);
    const result = [];

    if (!infos) {
        return result;
    }

    const date = new Date();
    date.setMonth(date.getMonth() - 3);

    const maxDate = date.getTime();

    for (const info of infos)
    {
        const date = parse(info.dateDebut.V);
        if (maxDate > date) {
            continue;
        }

        result.push({
            time: date,
            title: info.L,
            teacher: info.elmauteur.V.L,
            content: info.listeQuestions.V[0].texte.V,
            // eslint-disable-next-line no-undef,no-loop-func
            files: info.listeQuestions.V[0].listePiecesJointes.V.map(f => file(url, session, f.L, { N: f.N, G: 50 }))
        });
    }

    result.sort((a, b) => {
        if (a.time < b.time)
        {
            return 1
        }

        if (a.time > b.time)
        {
            return -1;
        }
        return 0;
    });

    return result;
}

module.exports = infos;
