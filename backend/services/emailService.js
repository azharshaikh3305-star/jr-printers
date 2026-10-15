
import nodemailer from "nodemailer";

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });

const createTransporter = () => {
  const host = process.env.EMAIL_HOST?.trim();
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASSWORD?.trim();

  if (
    !host ||
    !user ||
    !pass ||
    user === "your_email@gmail.com" ||
    pass === "your_email_app_password"
  ) {
    throw new Error(
      "Email service is not configured. Check EMAIL_HOST, EMAIL_USER and EMAIL_PASSWORD."
    );
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Invalid EMAIL_PORT configuration.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

const createEmailHtml = ({
  name,
  otp,
  heading,
  description,
  isReset = false,
}) => {
  const safeName = escapeHtml(name);
  const safeOtp = escapeHtml(otp);
  const accent = isReset ? "#b91c1c" : "#f59e0b";
  const background = isReset ? "#fef2f2" : "#f5f5f4";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${heading}</title>
      </head>
      <body style="margin:0;padding:24px;background:#faf9f5;font-family:Arial,sans-serif;color:#1c1917">
        <div style="max-width:500px;margin:0 auto;padding:30px;background:#fff;border:1px solid #e7e5e4;border-radius:16px">
          <div style="width:48px;height:48px;line-height:48px;text-align:center;border-radius:12px;background:#f59e0b;color:#0c0a09;font-size:22px;font-weight:bold">
            JR
          </div>

          <h1 style="font-size:22px;margin-bottom:8px">JR PRINTING WORKS</h1>
          <p style="color:#78716c;font-size:13px">Custom Printing Studio</p>

          <p>Hello <strong>${safeName}</strong>,</p>
          <p>${description}</p>

          <div style="margin:24px 0;padding:20px;text-align:center;border:2px dashed #d6d3d1;border-radius:12px;background:${background}">
            <div style="font-size:32px;font-family:monospace;font-weight:bold;letter-spacing:6px;color:${accent}">
              ${safeOtp}
            </div>
          </div>

          <p style="font-size:14px;line-height:1.6">
            This code is valid for <strong>10 minutes</strong>.
            Never share this code with anyone.
          </p>

          <p style="font-size:13px;color:#78716c">
            If you did not request this, you can ignore this email.
          </p>

          <hr style="border:0;border-top:1px solid #eee;margin-top:28px" />

          <p style="font-size:12px;text-align:center;color:#78716c">
            JR PRINTING WORKS<br />
            Custom T-shirts, Mugs, Pillows, Bottles, Frames & Covers
          </p>
        </div>
      </body>
    </html>
  `;
};

const sendOtpEmail = async ({
  email,
  otp,
  name,
  subject,
  heading,
  description,
  isReset = false,
}) => {
  if (!email || !otp) {
    throw new Error("Recipient email and OTP are required.");
  }

  const transporter = createTransporter();
  const from =
    process.env.EMAIL_FROM?.trim() || process.env.EMAIL_USER.trim();

  try {
    const info = await transporter.sendMail({
      from,
      to: email,
      subject,
      text: [
        `Hello ${name || "Customer"},`,
        "",
        description,
        "",
        `Your code is: ${otp}`,
        "This code is valid for 10 minutes.",
        "Do not share this code with anyone.",
      ].join("\n"),
      html: createEmailHtml({
        name: name || "Customer",
        otp,
        heading,
        description,
        isReset,
      }),
    });

    console.log("OTP email sent successfully:", info.messageId);

    return {
      success: true,
      mode: "smtp",
      messageId: info.messageId,
    };
  } catch (error) {
    // Never print the OTP or email credentials in logs.
    console.error("OTP email delivery failed:", error.message);

    throw new Error(
      "Unable to send the email right now. Please check your email configuration and try again."
    );
  }
};

/**
 * Send a verification OTP to a newly registered user.
 */
export const sendVerificationOTP = async (
  email,
  otp,
  name = "Customer"
) => {
  return sendOtpEmail({
    email,
    otp,
    name,
    subject: "Verify your JR PRINTING WORKS account",
    heading: "Email Verification",
    description:
      "Thank you for registering with JR PRINTING WORKS. Use the code below to verify your email address.",
  });
};

/**
 * Send a password-reset OTP.
 */
export const sendPasswordResetOTP = async (
  email,
  otp,
  name = "Customer"
) => {
  return sendOtpEmail({
    email,
    otp,
    name,
    subject: "Password reset code for JR PRINTING WORKS",
    heading: "Password Reset",
    description:
      "We received a request to reset your JR PRINTING WORKS account password. Use the code below to continue.",
    isReset: true,
  });
};
