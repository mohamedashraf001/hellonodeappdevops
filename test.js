const http = require('http');

http.get('http://localhost:3000', res => {
  if (res.statusCode === 200) {
    console.log('OK');
    process.exit(0);
  } else {
    console.error('Bad status', res.statusCode);
    process.exit(1);
  }
}).on('error', err => { console.error(err); process.exit(1); });
