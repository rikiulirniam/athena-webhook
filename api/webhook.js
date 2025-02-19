import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }

    try {
        const { sender, payload } = req.body;

        const WAZAPBRO_API_URL = process.env.WAZAPBRO_API_URL;
        const WAZAPBRO_TOKEN = process.env.WAZAPBRO_TOKEN;

        if (!WAZAPBRO_API_URL || !WAZAPBRO_TOKEN) {
            return res.status(500).json({ success: false, error: "Missing API credentials" });
        }

        // Kirim request ke API WazapBro
        const response = await axios.post(WAZAPBRO_API_URL, {
            recipient: sender.phone,
            message: payload.text
        }, {
            headers: { Token: `${WAZAPBRO_TOKEN}` }
        });

        console.log("Response from WazapBro:", response.data);
        return res.json({ success: true, response: response.data });

    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}
