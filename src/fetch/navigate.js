const request = require('../request');

let previousTab;

async function navigate(session, page, tab, data)
{

    if (session.user.hiddenTabs.includes(tab)) return null;

    await request(session, 'Navigation', {
        _Signature_: {
            onglet: tab
        },
        donnees: {
            onglet: tab,
            ongletPrec: previousTab || tab
        }
    });

    previousTab = tab;

    const content = {
        _Signature_: {
            onglet: tab
        }
    };
    if (data) {
        content.donnees = data;
    }

    const { donnees: result } = await request(session, page, content);
    return result;
}

module.exports = navigate;
