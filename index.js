console.log('Starting...');

const http = require('http');
const pronote = require('./src/pronote');

const PORT = 21727;

const server = http.createServer((req, res) => {
    if (req.method !== 'POST')
    {
        return endRequest(res, {
            error: 'Bad method'
        });
    }

    let body = '';

    req.on('data', (data) =>
    {
        body += data;
    });

    req.on('end', () =>
    {
        try
        {
            let params = JSON.parse(body);

            pronote[params.type](params).then(result =>
            {
                endRequest(res, result);
            }).catch(err =>
            {
                endRequest(res, {
                    error: err.toString()
                });

                if (err.stack)
                {
                    console.error(err.stack);
                }
            });
        }
        catch (e)
        {
            endRequest(res, {
                error: e.toString()
            });
        }
    });
});

function endRequest(res, content)
{
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(content));
}

server.listen(PORT);
console.log(`---> Pronote API HTTP Server working on 127.0.0.1:${PORT}`);
