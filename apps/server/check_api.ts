
const axios = require('axios');

async function main() {
    try {
        console.log('Fetching /restaurants...');
        const res = await axios.get('http://localhost:4000/restaurants');
        console.log('Status /restaurants:', res.status);
        console.log('Data /restaurants count:', res.data.length);

        console.log('Fetching /users...');
        const resUsers = await axios.get('http://localhost:4000/users');
        console.log('Status /users:', resUsers.status);
        console.log('Data /users count:', resUsers.data.length);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
        }
    }
}

main();
