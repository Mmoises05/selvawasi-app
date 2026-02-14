
const http = require('http');

http.get('http://localhost:4000/boats', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        if (res.statusCode === 200) {
            try {
                const boats = JSON.parse(data);
                console.log(`Boats found: ${boats.length}`);
                if (boats.length > 0) console.log(`First boat: ${boats[0].name} (ID: ${boats[0].id})`);
            } catch (e) {
                console.log('Response is not JSON:', data.substring(0, 100));
            }
        } else {
            console.log('Response:', data);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
