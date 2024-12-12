const axios = require("axios");

const BASE_ID = 'appu3Gqxd5ASUS8md'; // Replace with your Airtable Base ID
const API_KEY = 'patOvmYCU09qjXnbD.0828d67eb791cd9486906fdbae43eaf5d053bf1011a947771aceeeb9600b3288'; // FYI Nope, it's not valid anymore!
const WEBHOOK_ID = 'achTy7Ld5xiGq5QgL'; // Replace with the Webhook ID of the webhook you want to delete

// Function to delete a webhook
axios
  .delete(
    `https://api.airtable.com/v0/bases/${BASE_ID}/webhooks/${WEBHOOK_ID}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  )
  .then((response) => {
    console.log("Webhook deleted successfully:", response.data);
  })
  .catch((error) => {
    console.error("Error deleting webhook:", error.response?.data || error.message);
  });
