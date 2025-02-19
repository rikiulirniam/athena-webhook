const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json()); // Untuk parsing JSON dari request

const PORT = process.env.PORT || 3000;
const WAZAPBRO_API_URL = process.env.WAZAPBRO_API_URL; // Atur di .env
const WAZAPBRO_TOKEN = process.env.WAZAPBRO_TOKEN; // Atur di .env

// Endpoint Webhook untuk menerima request dari Rasa
app.post("/webhook", async (req, res) => {
    try 
    {
        const { sender, payload } = req.body;

        // Kirim ke API WazapBro
        const response = await axios.post(WAZAPBRO_API_URL, {
            recipient: sender.phone,
            message: payload.text

        }, {
            headers: { Authorization: `Bearer ${WAZAPBRO_TOKEN}` }
        });

        console.log("Response from WazapBro:", response.data);
        res.json({ success: true, response: response.data });

    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`🚀 Webhook listening on port ${PORT}`);
});
