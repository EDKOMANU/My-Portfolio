// Contact Form Handler
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // You'll need to set up an email service. Here's an example using EmailJS
    try {
        // Initialize EmailJS with your user ID
        emailjs.init("YOUR_USER_ID");
        
        await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
            to_email: "edward.manu@statsghana.gov.gh",
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message
        });

        alert("Thank you for your message. I will get back to you soon!");
        this.reset();
    } catch (error) {
        console.error('Error:', error);
        alert("Oops! Something went wrong. Please try again later.");
    }
});