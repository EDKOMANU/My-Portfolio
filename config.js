// Create this new file: config.js
const config = {
    GEMINI_API_KEY: 'AIzaSyDgfOyxFL3XFzCGPpJM5smqdc3w-AQQptw'
};
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
}

// Add this test function
async function testGeminiAI() {
    try {
        const response = await window.currentChat.sendMessage("Hello, can you tell me about Edward Manu?");
        console.log('Test response:', response.text());
    } catch (error) {
        console.error('Test failed:', error);
    }
}
export default config;