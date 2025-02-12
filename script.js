// Initialize Gemini AI API
let genAI; // Will hold the Gemini AI instance

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google's Gemini AI
    initializeGeminiAI();
    
    // Initialize other components
    initializeDateTime();
    initializeNavigation();
    initializeContactForm();
    initializeChatWidget();
    initializeSkillsAnimation();
});

// Gemini AI Initialization
async function initializeGeminiAI() {
    try {
        // Initialize the Gemini API with your API key
        genAI = new GoogleGenerativeAI('AIzaSyDgfOyxFL3XFzCGPpJM5smqdc3w-AQQptw');
        
        // Get the chat model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Start a chat session
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: "You are a helpful AI assistant for Edward Manu's portfolio website. Respond professionally and concisely."
                },
                {
                    role: "model",
                    parts: "I understand. I'll act as a professional AI assistant for Edward Manu's portfolio website, providing clear and concise responses to visitors' questions."
                }
            ],
        });

        // Store chat instance globally
        window.currentChat = chat;
    } catch (error) {
        console.error('Error initializing Gemini AI:', error);
    }
}

// DateTime and User Display
function initializeDateTime() {
    function updateDateTime() {
        const now = new Date();
        
        // Format: YYYY-MM-DD HH:MM:SS
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        document.getElementById('current-time').textContent = formattedDateTime;
    }

    // Update time every second
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Set user display
    const userDisplay = document.getElementById('current-user');
    if (userDisplay) {
        userDisplay.textContent = 'EDKOMANU';
    }
}

// Navigation
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                navLinks.classList.remove('active');
            }
        });
    });

    // Hide/Show navbar on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const userInfoBar = document.querySelector('.user-info-bar');
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScrollTop) {
            navbar.style.transform = 'translateY(-100%)';
            userInfoBar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
            userInfoBar.style.transform = 'translateY(0)';
        }
        lastScrollTop = currentScroll;
    });
}

// AI Chat Widget
function initializeChatWidget() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-container');
    const closeChat = document.getElementById('close-chat');
    const sendMessage = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle chat window
    if (chatToggle && chatContainer) {
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.toggle('active');
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatContainer.classList.remove('active');
        });
    }

    // Handle message sending
    if (sendMessage && chatInput && chatMessages) {
        sendMessage.addEventListener('click', () => sendChatMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }

    async function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        try {
            // Add user message to chat
            addMessageToChat('user', message);
            chatInput.value = '';

            // Get AI response using Gemini
            const result = await window.currentChat.sendMessage(message);
            const response = await result.response;
            const aiResponse = response.text();

            // Add AI response to chat
            addMessageToChat('ai', aiResponse);
        } catch (error) {
            console.error('Error getting AI response:', error);
            addMessageToChat('ai', 'Sorry, I encountered an error. Please try again.');
        }
    }

    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        messageDiv.innerHTML = `
            <div class="message-content">
                <strong>${sender === 'user' ? 'You' : 'AI Assistant'}:</strong>
                <p>${message}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Skills Animation
function initializeSkillsAnimation() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetWidth = entry.target.parentElement.getAttribute('data-level') || '0';
                    entry.target.style.width = `${targetWidth}%`;
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    skillLevels.forEach(skill => {
        skill.style.width = '0';
        observer.observe(skill);
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(fieldId, message) {
        const errorDiv = document.getElementById(`${fieldId}-error`);
        const field = document.getElementById(fieldId);
        if (errorDiv && field) {
            errorDiv.textContent = message;
            field.classList.add('error');
        }
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => error.textContent = '');
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearErrors();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            let isValid = true;

            if (name.length < 2) {
                showError('name', 'Please enter your full name');
                isValid = false;
            }

            if (!validateEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            if (subject.length < 2) {
                showError('subject', 'Please enter a subject');
                isValid = false;
            }

            if (message.length < 10) {
                showError('message', 'Message must be at least 10 characters long');
                isValid = false;
            }

            if (!isValid) return;

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                // Add your email service integration here
                // Example: await sendEmail({ name, email, subject, message });

                alert('Thank you! Your message has been sent successfully.');
                this.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Oops! Something went wrong. Please try again later.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
}

// Page Load Animations
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.animate-on-load').forEach(element => {
        element.classList.add('animate-fade-in');
    });
});

// Scroll Animations
const scrollAnimations = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    elements.forEach(element => observer.observe(element));
};

scrollAnimations();
// Add this to your script.js

// Rate limiting for API calls
const rateLimiter = {
    tokens: 10,
    lastRefill: Date.now(),
    refillRate: 1000, // 1 second
    maxTokens: 10,

    async waitForToken() {
        const now = Date.now();
        const timePassed = now - this.lastRefill;
        this.tokens = Math.min(
            this.maxTokens,
            this.tokens + Math.floor(timePassed / this.refillRate)
        );
        
        if (this.tokens < 1) {
            const waitTime = this.refillRate - (timePassed % this.refillRate);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.waitForToken();
        }
        
        this.tokens--;
        this.lastRefill = now;
    }
};

// Update your sendChatMessage function
async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    try {
        // Wait for rate limiting
        await rateLimiter.waitForToken();

        // Add user message to chat
        addMessageToChat('user', message);
        chatInput.value = '';

        // Show loading indicator
        const loadingMessage = addMessageToChat('ai', 'Thinking...');

        // Get AI response
        const result = await window.currentChat.sendMessage(message);
        const response = await result.response;
        const aiResponse = response.text();

        // Remove loading message and add AI response
        loadingMessage.remove();
        addMessageToChat('ai', aiResponse);

    } catch (error) {
        console.error('Error getting AI response:', error);
        addMessageToChat('ai', 'Sorry, I encountered an error. Please try again.');
    }
    // Add this after your existing code

// Data Visualization
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

function displayData(data) {
    const dataGrid = document.getElementById('dataGrid');
    const filterSelect = document.getElementById('dataFilter');
    
    // Clear existing content
    dataGrid.innerHTML = '';
    
    // Create data cards
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'data-card';
        card.innerHTML = `
            <div class="data-card-header">
                <h3>${item.title || 'Untitled'}</h3>
            </div>
            <div class="data-card-body">
                <p>${item.description || 'No description available'}</p>
                <div class="data-stats">
                    ${Object.entries(item.statistics || {}).map(([key, value]) => `
                        <div class="stat-item">
                            <span class="stat-label">${key}:</span>
                            <span class="stat-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        dataGrid.appendChild(card);
    });

    // Create chart if Chart.js is available
    if (window.Chart && data.length > 0) {
        createChart(data);
    }
}

function createChart(data) {
    const ctx = document.getElementById('dataChart').getContext('2d');
    
    // Assuming data has numeric values to chart
    const chartData = {
        labels: data.map(item => item.title || 'Untitled'),
        datasets: [{
            label: 'Data Values',
            data: data.map(item => item.value || 0),
            backgroundColor: 'rgba(52, 152, 219, 0.5)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Load and display data when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadData();
    if (data) {
        displayData(data);
    }
});
}
