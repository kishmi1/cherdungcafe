// Test reservation status update email script
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Reservation Status Update Email Test ===\n');

rl.question('Enter your email address: ', (email) => {
  rl.question('Enter your name: ', (name) => {
    rl.question('Enter reservation ID (any number): ', (id) => {
      rl.question('Enter number of guests: ', (guests) => {
        rl.question('Enter status (CONFIRMED/CANCELLED/COMPLETED/PENDING): ', (status) => {
          
          const testData = {
            id: parseInt(id) || 1,
            name: name || 'Test User',
            email: email || 'test@example.com',
            numberOfGuests: parseInt(guests) || 2,
            reservationDate: new Date(),
            reservationTime: '18:00',
            status: (status || 'CONFIRMED').toUpperCase()
          };

          console.log('\n=== Test Data ===');
          console.log(JSON.stringify(testData, null, 2));
          console.log('\n=== API Call ===');
          console.log(`curl -X POST http://localhost:3000/api/test-reservation-email -H "Content-Type: application/json" -d '${JSON.stringify(testData)}'`);
          
          rl.close();
        });
      });
    });
  });
});