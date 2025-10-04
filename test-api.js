const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing screenshots API...');
    // Use dynamic host for mobile compatibility
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/screenshots?out=session`);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.images && data.images.length > 0) {
      console.log(`Found ${data.images.length} screenshots`);
      console.log('First few images:', data.images.slice(0, 3));
    } else {
      console.log('No screenshots found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
