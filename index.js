    import express from "express";
    import axios from "axios";
    import dotenv from "dotenv";

    dotenv.config();

    const app = express();
    app.use(express.json()); 

    app.get("/", (req, res) => res.send("Webhook"));

    app.post("/webhook", async (req, res) => {
        if (req.method !== "POST") {
            return res.status(405).json({ success: false, error: "Method Not Allowed" });
        }

        try {
            const { sender, payload } = req.body;

            const WAZAPBRO_API_URL = process.env.WAZAPBRO_API_URL;
            const WAZAPBRO_TOKEN = process.env.WAZAPBRO_TOKEN;
            const ATHENA_API_URL = process.env.ATHENA_API_URL;

            if (!WAZAPBRO_API_URL || !WAZAPBRO_TOKEN || !ATHENA_API_URL) {
                return res.status(500).json({ success: false, error: "Missing API credentials" });
            }

            await axios.post(ATHENA_API_URL, {
                sender: sender.phone,
                message: payload.text
            }).then(resa => {
                axios.post(WAZAPBRO_API_URL, {
                    recipient: sender.phone,
                    message: resa.data[0].text
                }, {
                    headers: { Token: `${WAZAPBRO_TOKEN}` }
                });
            });

        
            return res.json({ success: true, response: "Message Submitted" });

        } catch (error) {
            console.error("Error sending message:", error.response?.data || error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Webhook server berjalan di port ${PORT}`);
    });

    module.exports = app;