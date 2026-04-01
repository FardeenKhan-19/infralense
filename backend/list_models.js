const axios = require('axios');
require('dotenv').config();

async function run() {
    try {
        const res = await axios.get('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
        require('fs').writeFileSync('models.json', JSON.stringify(res.data, null, 2));
        console.log('Saved models.json');
    } catch (e) { console.error('Error fetching models:', e.response ? e.response.data : e.message); }
}
run();
