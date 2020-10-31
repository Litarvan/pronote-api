const jsdom = require('jsdom');
const { getDOM, extractStart } = require('./api');

async function login(url, account, username, password)
{
    const jar = new jsdom.CookieJar();
    let dom = await getDOM({
        url: 'https://www.atrium-sud.fr/connexion/login?service=' + url,
        jar
    });

    let lt = dom.window.document.getElementsByName('lt');
    let execution = dom.window.document.getElementsByName('execution');
    lt = lt[0].value;
    execution = execution[0].value;

    dom = await getDOM({
        url: 'https://www.atrium-sud.fr/connexion/login?service=' + url,
        jar,
        method: 'POST',
        data: {
            username,
            password,
            lt,
            execution,
            _eventId: 'submit',
            submit: ''
        },
        asIs: true
    })

    dom = await getDOM({
        url,
        jar,
        method: 'GET',
        asIs: true,
        followRedirects: true
    });

    return extractStart(dom);
}

module.exports = login;
