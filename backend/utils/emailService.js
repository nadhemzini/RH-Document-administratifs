import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

/**
 * Sends a welcome email using a Brevo template
 * @param {string} email - Recipient's email
 * @param {string} name - Recipient's name
 */
export const sendWelcomeEmail = async (email, name, password) => {
  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: { email: process.env.SENDER_EMAIL, name: "ISIMM HR" },
        to: [{ email, name }],
        templateId: 2,
        params: {
          NAME: name,
          PW: password,
          WELCOME_MESSAGE:
            "Welcome to our platform! We're excited to have you.",
        },
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
  }
};

export const sendPasswordResetEmail = async (
  name,
  email,
  resetPasswordToken,
  expire
) => {
  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: { email: process.env.SENDER_EMAIL, name: "ISIMM HR" },
        to: [{ email }],
        templateId: 3,
        params: {
          NAME: name,
          LINK: `${CLIENT_URL}/reset-password/${resetPasswordToken}`,
          EXPIRE: expire,
        },
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
  }
};

export const sendResetSuccess = async (email) => {
  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: { email: process.env.SENDER_EMAIL, name: "ISIMM HR" },
        to: [{ email }],
        templateId: 4,
        params: {
          MESSAGE: "Your password has been reset successfully.",
        },
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
  }
};
