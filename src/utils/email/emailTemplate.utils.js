// /utils/emailTemplate.utils.js

module.exports = {
  otpTemplate,
  welcomeTemplate,
  resetPasswordTemplate,
  accountDeactivationTemplate,
  supportTicketTemplate,
  adminNotificationTemplate
};

function otpTemplate(identifier, otp, expiresAt = 10) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>OTP Verification</h2>
      <p>Hi ${identifier},</p>
      <p>Your One-Time Password (OTP) is:</p>
      <h3 style="background: #f2f2f2; padding: 10px; text-align : center">${otp}</h3>
      <p>This OTP is valid for ${expiresAt} minutes.</p>
      <p>Thank you for using RigthStox!</p>
    </body>
  </html>
  `;
}

function welcomeTemplate(name) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>Welcome to RigthStox 🎉</h2>
      <p>Hello ${name},</p>
      <p>Thanks for signing up for RigthStox, your gateway to stock market fantasy contests!</p>
      <p>Get ready to pick winning stocks, join contests, and earn real cash.</p>
      <p>Good luck!<br/>— Team RigthStox</p>
    </body>
  </html>
  `;
}

function resetPasswordTemplate(name, link) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>Reset Your Password</h2>
      <p>Hello ${name},</p>
      <p>Click the button below to reset your RigthStox account password:</p>
      <a href="${link}" style="display: inline-block; background: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, you can ignore this message.</p>
    </body>
  </html>
  `;
}

function accountDeactivationTemplate(name) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>Account Deactivated</h2>
      <p>Hello ${name},</p>
      <p>We’ve processed your request to deactivate your RigthStox account.</p>
      <p>If this was not initiated by you, please contact our support immediately.</p>
      <p>We hope to see you again!</p>
    </body>
  </html>
  `;
}

function supportTicketTemplate(name, ticketId) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>Support Ticket Created</h2>
      <p>Hi ${name},</p>
      <p>We have received your support request. Your ticket ID is <strong>#${ticketId}</strong>.</p>
      <p>Our team will get back to you shortly. Thanks for your patience.</p>
      <p>— RigthStox Support</p>
    </body>
  </html>
  `;
}

function adminNotificationTemplate(subject, details = {}) {
  let detailHtml = Object.entries(details)
    .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
    .join("");

  return `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>📢 Admin Notification</h2>
      <p><strong>${subject}</strong></p>
      <ul>${detailHtml}</ul>
      <p>— RigthStox System</p>
    </body>
  </html>
  `;
}
