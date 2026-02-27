import { Resend } from "resend";
import nodemailer from "nodemailer";

// ─────────────────────────────────────────────────────────────────────────────
// Strategy 1: Resend HTTP API  (port 443 — works on ALL cloud/Render servers)
// Sign up free → https://resend.com → API Keys → create → add RESEND_API_KEY
// Free tier: 3,000 emails/month, 100/day. No domain setup needed.
// ─────────────────────────────────────────────────────────────────────────────
const sendViaResend = async (to, otp) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "CodeApp <onboarding@resend.dev>",  // works without domain verification
    to,
    subject: "Your CodeApp Verification Code",
    html: buildHtml(to, otp),
    text: `Your CodeApp OTP is: ${otp}\n\nThis code expires in 10 minutes.`,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  console.log(`✅ OTP sent via Resend to ${to}`);
};

// ─────────────────────────────────────────────────────────────────────────────
// Strategy 2: Gmail SMTP fallback
// ─────────────────────────────────────────────────────────────────────────────
const sendViaGmail = async (to, otp) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) throw new Error("EMAIL_USER / EMAIL_PASS not set");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    connectionTimeout: 8_000,
    greetingTimeout:   8_000,
    socketTimeout:     10_000,
    tls: { rejectUnauthorized: false },
  });

  await transporter.sendMail({
    from: `"CodeApp" <${user}>`,
    to,
    subject: "Your CodeApp Verification Code",
    html: buildHtml(to, otp),
    text: `Your CodeApp OTP is: ${otp}\n\nExpires in 10 minutes.`,
  });

  console.log(`✅ OTP sent via Gmail to ${to}`);
};

// ─────────────────────────────────────────────────────────────────────────────
// Main export — tries Resend first, then Gmail, then throws clearly.
// ─────────────────────────────────────────────────────────────────────────────
export const sendOtpEmail = async (to, otp) => {

  // ── 1. Resend (HTTPS — preferred on cloud servers) ────────────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      await sendViaResend(to, otp);
      return;
    } catch (err) {
      console.error("Resend failed:", err.message, "— trying Gmail…");
    }
  }

  // ── 2. Gmail SMTP fallback ────────────────────────────────────────────────
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const sendPromise  = sendViaGmail(to, otp);
      const timeoutGuard = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gmail SMTP timed out after 25 s")), 25_000)
      );
      await Promise.race([sendPromise, timeoutGuard]);
      return;
    } catch (err) {
      console.error("Gmail SMTP failed:", err.message);
      throw new Error(`Email failed: ${err.message}`);
    }
  }

  // ── 3. Nothing configured ─────────────────────────────────────────────────
  throw new Error(
    "No email service configured. Add RESEND_API_KEY in Render → Environment Variables."
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HTML template
// ─────────────────────────────────────────────────────────────────────────────
function buildHtml(to, otp) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#4A6FFF,#8BA5FF);padding:32px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;">&lt;/&gt; CodeApp</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Email Verification</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;text-align:center;">
            <h2 style="color:#1f2937;margin:0 0 12px;font-size:22px;">Verify Your Email</h2>
            <p style="color:#6b7280;margin:0 0 24px;font-size:15px;line-height:1.6;">
              Hi! Enter this code to complete registration for <strong>${to}</strong>
            </p>
            <div style="background:#eef2ff;border:2px dashed #a5b4fc;border-radius:14px;padding:24px 20px;margin-bottom:24px;">
              <p style="margin:0 0 6px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:2px;">One-Time Password</p>
              <p style="margin:0;font-size:48px;font-weight:900;letter-spacing:14px;color:#4a6fff;font-family:'Courier New',monospace;">${otp}</p>
            </div>
            <div style="background:#fef3c7;border-radius:10px;padding:12px 16px;margin-bottom:24px;">
              <p style="margin:0;color:#92400e;font-size:13px;">⏰ Expires in <strong>10 minutes</strong></p>
            </div>
            <p style="color:#9ca3af;font-size:13px;margin:0;">If you didn't request this, ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">CodeApp &bull; Sent to ${to}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

