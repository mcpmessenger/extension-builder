// Utility script to get your local IP address for mobile testing
const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return 'localhost';
}

const ip = getLocalIPAddress();
console.log(`\n🌐 Your local IP address is: ${ip}`);
console.log(`📱 Access your app on mobile at: http://${ip}:3000`);
console.log(`\n📋 Make sure your mobile device is on the same WiFi network as your computer.`);
console.log(`\n🚀 Start the dev server with: npm run dev:mobile`);

