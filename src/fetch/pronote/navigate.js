const { toPronote } = require('../../data/objects');
const request = require('../../request');

async function navigate(session, user, page, tab, accounts, data)
{
    if (session.user.hiddenTabs.includes(tab) || !accounts.includes(session.type.name)) {
        return null;
    }

    const content = {
        _Signature_: {
            membre: toPronote(user),
            onglet: tab
        }
    };
    if (data) {
        content.donnees = data;
    }

    return (await request(session, page, content)).donnees;
}

module.exports = navigate;
