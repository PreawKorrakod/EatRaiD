const crypto = require('crypto');

const accessTokenSecret = crypto.randomBytes(64).toString('hex');
const refreshTokenSecret = crypto.randomBytes(64).toString('hex');
const secret = crypto.randomBytes(32).toString('hex');

console.log('Secret',secret);
console.log('ACCESS_TOKEN_SECRET:', accessTokenSecret);
console.log('REFRESH_TOKEN_SECRET:', refreshTokenSecret);
