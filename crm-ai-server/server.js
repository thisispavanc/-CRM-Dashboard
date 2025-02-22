const express = require('express');
const cors = require('cors');
const nlp = require('compromise'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/predict', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text input is required" });
        }

        // Simple sentiment check (Not ML, but works for basic use)
        const words = nlp(text).terms().out('array');
        const positiveWords = ['good', 'excellent', 'great', 'amazing', 'positive', 'love'];
        const negativeWords = ['bad', 'terrible', 'poor', 'hate', 'negative', 'worst'];

        let sentiment = "neutral";
        if (words.some(word => positiveWords.includes(word))) sentiment = "positive";
        if (words.some(word => negativeWords.includes(word))) sentiment = "negative";

        res.json({ prediction: { text, sentiment } });

    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

