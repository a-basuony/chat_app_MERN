require("dotenv").config();
const { Resend } = require("resend");
const { createWelcomeEmailTemplate } = require("./emailTemplate");

const resendClient = new Resend(process.env.RESEND_API_KEY);

const sender = {
  email: process.env.EMAIL_FROM,
  name: process.env.EMAIL_FROM_NAME,
};

const sendWelcomeEmail = async (email, name, clientURL) => {
  try {
    const { data, error } = await resendClient.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to Chatify 🎉",
      html: createWelcomeEmailTemplate(name, clientURL),
    });

    if (error) {
      console.error("❌ Error sending email:", error);
      throw new Error("Failed to send welcome email");
    }

    console.log("✅ Welcome email sent successfully:", data);
  } catch (err) {
    console.error("💥 Email service error:", err.message);
  }
};

const sendLoginNotificationEmail = async (email, name) => {
  try {
    const { data, error } = await resendClient.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "New Login Detected",
      html: `<p>Hi ${name}, you have successfully logged in to Messenger!</p>`,
    });

    if (error) {
      console.error("❌ Error sending email:", error);
      throw new Error("Failed to send welcome email");
    }
    console.log("✅ Welcome email sent successfully:", data);
  } catch (err) {
    console.error("💥 Email service error:", err.message);
  }
};

module.exports = { sendWelcomeEmail, sendLoginNotificationEmail };
