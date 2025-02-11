// Add this to your app.js or create a new file
// First, include EmailJS in your HTML:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// Initialize EmailJS
emailjs.init("YOUR_EMAIL_JS_USER_ID");

async function sendEmail(formData) {
    try {
        await emailjs.send(
            "YOUR_EMAIL_SERVICE_ID",
            "YOUR_TEMPLATE_ID",
            {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
                to_email: "edward.manu@statsghana.gov.gh"
            }
        );
        return true;
    } catch (error) {
        console.error("Email error:", error);
        return false;
    }
}