const request = require('../request');

async function navigate(session, page, tab, data)
{
    if (session.user.hiddenTabs.includes(tab)) {
        return null;
    }

    const content = {
        _Signature_: {
            onglet: tab
        }
    };
    if (data) {
        content.donnees = data;
    }

    return (await request(session, page, content)).donnees;
}

module.exports = navigate;
