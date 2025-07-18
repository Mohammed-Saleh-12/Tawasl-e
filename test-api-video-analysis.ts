import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api/video-analyses';
const USER_ANALYSES_URL = 'http://localhost:5000/api/video-analyses/user';

async function testVideoAnalysisAPI() {
  const videoData = Buffer.from('dummy data').toString('base64');
  const scenario = 'Job Interview Introduction';
  const duration = 30;

  // 1. Send POST request to analyze video
  console.log('Sending POST request to /api/video-analyses...');
  const postRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoData, scenario, duration })
  });
  const postJson = await postRes.json();
  console.log('POST response:', JSON.stringify(postJson, null, 2));

  // 2. Send GET request to fetch user analyses
  console.log('\nFetching user analyses from /api/video-analyses/user...');
  const getRes = await fetch(USER_ANALYSES_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    // If your API requires authentication, add cookies or tokens here
  });
  const getJson = await getRes.json();
  console.log('GET response:', JSON.stringify(getJson, null, 2));
}

testVideoAnalysisAPI().catch((err) => {
  if (err.code === 'ERR_MODULE_NOT_FOUND') {
    console.error('Missing dependency: node-fetch. Please run: npm install node-fetch@2');
  } else {
    console.error('Test failed:', err);
  }
}); 