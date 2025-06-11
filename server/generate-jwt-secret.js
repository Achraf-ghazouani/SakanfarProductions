const crypto = require('crypto');

console.log('🔐 JWT Secret Generator');
console.log('=======================\n');

// Generate a secure random JWT secret
const generateJWTSecret = (length = 64) => {
    return crypto.randomBytes(length).toString('hex');
};

// Generate multiple options
console.log('Here are several secure JWT secrets you can use:\n');

for (let i = 1; i <= 3; i++) {
    const secret = generateJWTSecret();
    console.log(`Option ${i}:`);
    console.log(`JWT_SECRET=${secret}\n`);
}

// Also generate a base64 version
const base64Secret = crypto.randomBytes(48).toString('base64');
console.log('Base64 encoded option:');
console.log(`JWT_SECRET=${base64Secret}\n`);

console.log('📝 Instructions:');
console.log('1. Copy one of the secrets above');
console.log('2. Replace the JWT_SECRET value in your .env file');
console.log('3. Restart your server for changes to take effect');
console.log('\n⚠️  Important: Keep this secret private and never commit it to version control!');