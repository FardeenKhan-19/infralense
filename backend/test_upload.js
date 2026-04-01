const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testFlow() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'citizen@infralense.com',
            password: 'user123'
        });
        const token = loginRes.data.token;
        console.log('Deploying report...');

        const form = new FormData();
        // Use the file generated earlier
        const files = fs.readdirSync('C:/Users/Fardeen/.gemini/antigravity/brain/5076359f-403b-4654-80b2-9c607adcc600/');
        const potholeImage = files.find(f => f.startsWith('pothole_test_img'));
        form.append('image', fs.createReadStream(`C:/Users/Fardeen/.gemini/antigravity/brain/5076359f-403b-4654-80b2-9c607adcc600/${potholeImage}`));
        form.append('description', 'API Test Pothole');
        form.append('latitude', '19.0760');
        form.append('longitude', '72.8777');

        const submitRes = await axios.post('http://localhost:5000/api/complaints', form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });

        console.log('AI Analysis Success!', submitRes.data);
    } catch (error) {
        console.error('Test Error:', error.response ? error.response.data : error.message);
    }
}

testFlow();
