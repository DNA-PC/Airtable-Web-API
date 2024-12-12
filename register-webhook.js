const axios = require('axios');

const BASE_ID = 'appu3Gqxd5ASUS8md';
const API_KEY = 'patOvmYCU09qjXnbD.0828d67eb791cd9486906fdbae43eaf5d053bf1011a947771aceeeb9600b3288'; // FYI Nope, it's not valid anymore!

// We notify an Airtable base but we could use any system (n8n, etc.)
const notificationUrl = 'https://hooks.airtable.com/workflows/v1/genericWebhook/appu3Gqxd5ASUS8md/wflgqDxoAK1gCk3Bd/wtr1hL65No3BzI5Bc';

axios
  .post(
    `https://api.airtable.com/v0/bases/${BASE_ID}/webhooks`,
    {
      notificationUrl: notificationUrl,
      specification: {
        options: {
          filters: {
            dataTypes: ['tableData'], // Watches for record changes
            recordChangeScope: 'tblciMG0U71XxtMri'
          },
          includes: {
            includePreviousCellValues: true,
            includePreviousFieldDefinitions: true
          }
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )
  .then((response) => {
    console.log('Webhook created successfully:', response.data);
  })
  .catch((error) => {
    console.error('Error creating webhook:', error.response.data);
  });
