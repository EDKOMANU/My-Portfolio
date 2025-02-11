// Initialize Gemini API
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key

// Chat functionality
document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('messages-container');

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        chatMessages.classList.toggle('hidden');
    });

    // Handle user input
    userInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && userInput.value.trim()) {
            const message = userInput.value.trim();
            addMessage('user', message);
            userInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            try {
                const response = await sendToGemini(message);
                removeTypingIndicator();
                addMessage('bot', response);
            } catch (error) {
                removeTypingIndicator();
                addMessage('bot', 'Sorry, I encountered an error. Please try again.');
                console.error('Error:', error);
            }
        }
    });

    // Add message to chat
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        indicator.id = 'typing-indicator';
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
});

// Contact form functionality
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        // Here you would typically send this to your backend
        // For now, we'll just log it
        console.log('Form submitted:', formData);
        
        // You can implement your email sending logic here
        // Example using EmailJS or similar service
        
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error sending your message. Please try again.');
    }
});

// Function to send message to Gemini API
async function sendToGemini(message) {
    try {
        // Replace this with actual Gemini API implementation
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}

// Import configuration
// const config = require('./config.js'); // Use this if using Node.js
// For client-side, include config.js before this file in your HTML

// Initialize EmailJS
document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with your user ID
    emailjs.init(config.emailjs.userId);

    const chatToggle = document.getElementById('chat-toggle');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('messages-container');
    const contactForm = document.getElementById('contactForm');

    // Chat toggle functionality
    chatToggle.addEventListener('click', () => {
        chatMessages.classList.toggle('hidden');
    });

    // Handle user input for chat
    userInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && userInput.value.trim()) {
            const message = userInput.value.trim();
            addMessage('user', message);
            userInput.value = '';
            
            showTypingIndicator();
            
            try {
                const response = await sendToGemini(message);
                removeTypingIndicator();
                addMessage('bot', response);
            } catch (error) {
                removeTypingIndicator();
                addMessage('bot', 'Sorry, I encountered an error. Please try again.');
                console.error('Error:', error);
            }
        }
    });

    // Contact form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            to_email: 'manuedward32@gmail.com' // Your email address
        };

        try {
            const response = await emailjs.send(
                config.emailjs.serviceId,
                config.emailjs.templateId,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_email: formData.to_email
                }
            );

            if (response.status === 200) {
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error sending your message. Please try again.');
        }
    });

    // Chat message handling functions
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        indicator.id = 'typing-indicator';
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
});

// Function to send message to Gemini API
async function sendToGemini(message) {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.gemini.apiKey}`
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get response from Gemini API');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}