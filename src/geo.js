const https = require('https');

function geo(lat, long) {
    return new Promise((resolve, reject) => {

        const data = `data={"nomFonction": "geoLoc","lat": ${lat.toString()},"long": ${long.toString()}}`;
        console.log(data)

        const options = {
            hostname: 'www.index-education.com',
            port: 443,
            path: '/swie/geoloc.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
                'Content-Length': data.length
            }
        }

        let incomingData = '';
        const request = https.request(options, function (res) {
            res.on('data', function (data) {
                incomingData += data;
            });
            res.on('end', function () {
                resolve(JSON.parse(incomingData));
            });
        });

        request.write(data);
        request.end();

        request.on('error', (error) => {
            reject(error);
        });
    })
}

module.exports = geo;
