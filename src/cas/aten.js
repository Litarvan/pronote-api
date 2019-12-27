const fs = require('fs'), path = require('path');
const util = require('../util');

const hook = fs.readFileSync(path.join(__dirname, '../../jsencrypt.min.js')) + '; window.JSEncrypt = JSEncrypt;';

module.exports = {
    hook(window) {
        window.eval(hook);
    },
    async submit({ dom, jar, username, password, atenURL }) {
        dom.window.document.getElementById('user').value = username;
        dom.window.document.getElementById('password').value = password;

        dom.window.eval('creerCookie(document.getElementById(\'user\'), document.getElementById(\'password\'));');

        const result = await util.submitForm({
            dom,
            jar,
            actionRoot: atenURL
        });

        if (result.window.document.getElementById('aten-auth')) {
            throw 'Mauvais identifiants';
        }

        return util.submitForm({
            dom: result,
            jar,
            asIs: true
        });
    }
};
