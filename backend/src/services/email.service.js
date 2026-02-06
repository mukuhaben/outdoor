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
