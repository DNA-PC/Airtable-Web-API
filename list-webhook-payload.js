require('dotenv').config()
const axios = require("axios");

const BASE_ID = 'appu3Gqxd5ASUS8md'; // Replace with your Airtable Base ID
const API_KEY = process.env.AIRTABLE_PAT;
const WEBHOOK_ID = 'achEmfLt03Oxy8QxW'; // Replace with the Webhook ID obtained after creation

// Function to list payloads
axios
  .get(
    `https://api.airtable.com/v0/bases/${BASE_ID}/webhooks/${WEBHOOK_ID}/payloads`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  )
  .then((response) => {
    console.log("Webhook payloads retrieved successfully:", JSON.stringify(response.data, null, 2));
  })
  .catch((error) => {
    console.error("Error retrieving webhook payloads:", error.response?.data || error.message);
  });
