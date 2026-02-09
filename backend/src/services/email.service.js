const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,            // smtp.zoho.com
  port: Number(process.env.SMTP_PORT),    // 465
  secure: true,                           // REQUIRED for port 465
  auth: {
    user: process.env.SMTP_USER,          // info@tambuaphish.store
    pass: process.env.SMTP_PASS           // Zoho APP PASSWORD
  },
  tls: {
    servername: process.env.SMTP_HOST,    // Zoho requires SNI
    rejectUnauthorized: false             // Render TLS quirk
  }
});

// Debug: confirm env vars at runtime
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PORT:", process.env.SMTP_PORT);

/**
 * Verify SMTP connection at startup (Render-safe, Node 22 compatible)
 */
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP server ready to send emails");
  } catch (err) {
    console.error("❌ SMTP verify failed:", err);
  }
})();

/**
 * Send booking receipt email
 */
exports.sendReceiptEmail = async (data) => {
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1b4332">
      <h2>🌿 Trek N Tread – Booking Confirmed</h2>

      <p>Hi <strong>${data.name}</strong>,</p>

      <p>Your adventure booking has been successfully confirmed.</p>

      <table cellpadding="6" cellspacing="0">
        <tr><td><strong>Activity</strong></td><td>${data.activity}</td></tr>
        <tr><td><strong>Route</strong></td><td>${data.route}</td></tr>
        <tr><td><strong>People</strong></td><td>${data.people}</td></tr>
        <tr><td><strong>Amount Paid</strong></td><td>KES ${data.amount}</td></tr>
        <tr><td><strong>Reference</strong></td><td>${data.reference}</td></tr>
      </table>

      <p>We look forward to hosting you.</p>

      <p><strong>Trek N Tread Team</strong></p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Trek N Tread" <${process.env.SMTP_USER}>`, // MUST match Zoho mailbox
      to: data.email,
      subject: "Booking Confirmation – Trek N Tread",
      html
    });

    console.log("📧 Receipt email sent to:", data.email);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};



/*
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
    tls: {
    servername: process.env.SMTP_HOST, // 🔑 important for Zoho
    rejectUnauthorized: false          // 🔑 Render cert issue
  }
});

exports.sendReceiptEmail = async (data) => {
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1b4332">
      <h2>🌿 Trek N Tread – Booking Confirmed</h2>

      <p>Hi <strong>${data.name}</strong>,</p>

      <p>Your adventure booking has been successfully confirmed.</p>

      <table cellpadding="6" cellspacing="0">
        <tr><td><strong>Activity</strong></td><td>${data.activity}</td></tr>
        <tr><td><strong>Route</strong></td><td>${data.route}</td></tr>
        <tr><td><strong>People</strong></td><td>${data.people}</td></tr>
        <tr><td><strong>Amount Paid</strong></td><td>KES ${data.amount}</td></tr>
        <tr><td><strong>Reference</strong></td><td>${data.reference}</td></tr>
      </table>

      <p><strong>Trek N Tread Team</strong></p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Trek N Tread" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: "Booking Confirmation – Trek N Tread",
    html
  });
};
*/