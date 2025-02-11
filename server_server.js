const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const chat = await model.startChat({
            history: [
                {
                    role: "user",
                    parts: "You are Edward Manu's portfolio assistant. Provide information about his skills and experience."
                },
                {
                    role: "model",
                    parts: "I understand. I'll help visitors learn about Edward's expertise."
                }
            ]
        });
        
        const result = await chat.sendMessage(message);
        const response = await result.response;
        
        res.json({ response: response.text() });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'edward.manu@statsghana.gov.gh',
            subject: `Portfolio Contact: ${subject}`,
            text: `
                Name: ${name}
                Email: ${email}
                Message: ${message}
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});