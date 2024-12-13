require('dotenv').config()
const axios = require("axios");

const BASE_ID = 'appu3Gqxd5ASUS8md'; // Replace with your Airtable Base ID
const API_KEY = process.env.AIRTABLE_PAT;
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
