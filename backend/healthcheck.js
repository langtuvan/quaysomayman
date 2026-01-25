const http = require('http');

const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

const options = {
  host: host,
  port: port,
  path: '/health',
  timeout: 5000,
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('ERROR:', err.message);
  process.exit(1);
});

request.end();
