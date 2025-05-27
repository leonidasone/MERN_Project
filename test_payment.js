const axios = require('axios');

// Configure axios
axios.defaults.baseURL = 'http://localhost:5000';

async function testPaymentFlow() {
  try {
    console.log('Testing Payment Flow...\n');

    // Step 1: Login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post('/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✓ Login successful');

    // Set authorization header for subsequent requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Step 2: Check if there are any completed tickets
    console.log('\n2. Checking for completed tickets...');
    const ticketsResponse = await axios.get('/api/tickets');
    const completedTickets = ticketsResponse.data.filter(ticket => ticket.Status === 'COMPLETED');
    
    console.log(`Found ${completedTickets.length} completed tickets`);
    
    if (completedTickets.length === 0) {
      console.log('No completed tickets found. Creating test data...');
      
      // Create a vehicle first
      try {
        await axios.post('/api/vehicles', {
          PlateNumber: 'TEST-123',
          VehicleType: 'Sedan',
          DriverName: 'Test Driver',
          PhoneNumber: '+1234567890'
        });
        console.log('✓ Test vehicle created');
      } catch (error) {
        if (error.response?.status !== 400) {
          throw error;
        }
        console.log('✓ Test vehicle already exists');
      }

      // Create a parking ticket
      const ticketResponse = await axios.post('/api/tickets', {
        PlateNumber: 'TEST-123',
        PackageNumber: 1
      });
      console.log('✓ Test ticket created:', ticketResponse.data.ticketNumber);

      // Complete the ticket
      const completeResponse = await axios.put(`/api/tickets/${ticketResponse.data.ticketNumber}/complete`);
      console.log('✓ Test ticket completed with fee:', completeResponse.data.totalFee);
      
      // Get the completed ticket
      const completedTicketResponse = await axios.get(`/api/tickets/${ticketResponse.data.ticketNumber}`);
      const testTicket = completedTicketResponse.data;
      
      // Step 3: Test payment creation
      console.log('\n3. Testing payment creation...');
      const paymentResponse = await axios.post('/api/payments', {
        TicketNumber: testTicket.TicketNumber,
        AmountPaid: testTicket.TotalFee,
        PaymentMethod: 'CASH'
      });
      
      console.log('✓ Payment created successfully:', paymentResponse.data);
      
    } else {
      // Use existing completed ticket
      const testTicket = completedTickets[0];
      console.log('Using existing completed ticket:', testTicket.TicketNumber);
      
      // Check if payment already exists
      const paymentsResponse = await axios.get('/api/payments');
      const existingPayment = paymentsResponse.data.find(p => p.TicketNumber === testTicket.TicketNumber);
      
      if (existingPayment) {
        console.log('Payment already exists for this ticket');
      } else {
        // Step 3: Test payment creation
        console.log('\n3. Testing payment creation...');
        const paymentResponse = await axios.post('/api/payments', {
          TicketNumber: testTicket.TicketNumber,
          AmountPaid: testTicket.TotalFee,
          PaymentMethod: 'CASH'
        });
        
        console.log('✓ Payment created successfully:', paymentResponse.data);
      }
    }

    // Step 4: Verify payment was created
    console.log('\n4. Verifying payment...');
    const paymentsResponse = await axios.get('/api/payments');
    console.log(`✓ Total payments in system: ${paymentsResponse.data.length}`);
    
    console.log('\n✅ Payment flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testPaymentFlow();
