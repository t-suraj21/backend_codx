import nodemailer from "nodemailer";

/**
 * Create a Gmail transporter.
 * Uses port 465 (SSL) which is the most reliable on cloud servers like Render.
 * Port 587 (STARTTLS) can hang or be blocked on some cloud providers.
 */
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",          // let nodemailer pick the correct Gmail settings
    auth: { user, pass },
    connectionTimeout: 10_000, // fail fast — don't hang for 60 s
    greetingTimeout:   10_000,
    socketTimeout:     15_000,
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send OTP verification email to the user's email address.
 *
 * @param {string} to  - the user's email address
 * @param {string} otp - 6-digit OTP code
 */
export const sendOtpEmail = async (to, otp) => {
  const transporter = createTransporter();

  if (!transporter) {
    // EMAIL_USER / EMAIL_PASS not set in Render environment variables
    const err = new Error(
      "Email service not configured. Set EMAIL_USER and EMAIL_PASS in Render environment variables."
    );
    console.error("❌ Email config missing:", err.message);
    throw err;
  }

  const mailOptions = {
    from: `"CodeApp" <${process.env.EMAIL_USER}>`,
    to,           // ← always the individual user's own email
    replyTo: process.env.EMAIL_USER,
    subject: "Your CodeApp Verification Code",
    text: `Your CodeApp verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4A6FFF,#8BA5FF);padding:32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:800;letter-spacing:1px;">
                &lt;/&gt; CodeApp
              </h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">
                Email Verification
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;text-align:center;">
              <h2 style="color:#1f2937;margin:0 0 12px;font-size:22px;">Verify Your Email</h2>
              <p style="color:#6b7280;margin:0 0 8px;font-size:15px;line-height:1.6;">
                Hi there! Enter the code below to complete your registration.
              </p>
              <p style="color:#6b7280;margin:0 0 28px;font-size:14px;">
                This code is being sent to: <strong>${to}</strong>
              </p>

              <!-- OTP Box -->
              <div style="background:#eef2ff;border:2px dashed #a5b4fc;border-radius:14px;
                          padding:24px 20px;margin-bottom:28px;display:inline-block;width:100%;box-sizing:border-box;">
                <p style="margin:0 0 6px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:2px;">
                  Your One-Time Password
                </p>
                <p style="margin:0;font-size:44px;font-weight:900;letter-spacing:14px;
                           color:#4a6fff;font-family:'Courier New',monospace;">
                  ${otp}
                </p>
              </div>

              <!-- Expiry notice -->
              <div style="background:#fef3c7;border-radius:10px;padding:12px 16px;margin-bottom:24px;">
                <p style="margin:0;color:#92400e;font-size:13px;">
                  ⏰ This code expires in <strong>10 minutes</strong>
                </p>
              </div>

              <p style="color:#9ca3af;font-size:13px;margin:0;line-height:1.6;">
                If you didn't create an account with CodeApp, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                CodeApp &bull; Sent to ${to}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };

  try {
    // Race the send against a hard 20-second timeout
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("SMTP timeout — email server did not respond within 20 s")), 20_000)
    );
    const info = await Promise.race([sendPromise, timeoutPromise]);
    console.log(`✅ OTP email sent to ${to} | MessageId: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Failed to send OTP to ${to}:`, err.message);
    throw err; // re-throw so the route returns 500 with the real error
  }
};
