console.log('Starting...');

const http = require('http');
const pronote = require('./src/pronote');

const HOST = process.env.HOST == null ? '127.0.0.1' : process.env.HOST;
const PORT = process.env.PORT == null ? 21727 : process.env.PORT;

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
                console.error(err);

                endRequest(res, {
                    error: err.message || JSON.stringify(err)
                });

                /*if (err.stack)
                {
                    console.error(err.stack);
                }*/
            });
        }
        catch (e)
        {
            console.error(e);

            endRequest(res, {
                error: JSON.stringify(e)
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


// Let's not launch the server if the module is required by something else
if (require.main === module) {
  server.listen(PORT, HOST, () => {
      console.log(`---> Pronote API HTTP Server working on ${HOST}:${PORT}`);
  });
}
else module.exports = require('./src/pronote');
