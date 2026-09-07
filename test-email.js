// Test email script
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your email address to test: ', (email) => {
  if (!email || !email.includes('@')) {
    console.log('Invalid email address');
    rl.close();
    return;
  }

  console.log(`\nSending test email to: ${email}`);
  console.log('You can test it using:');
  console.log(`curl -X POST http://localhost:3000/api/test-email -H "Content-Type: application/json" -d '{"email":"${email}"}'`);
  
  rl.close();
});