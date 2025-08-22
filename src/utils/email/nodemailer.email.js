const transporter = require("../../config/nodemailer/nodemailer.config");
const logger = require("../logger/logger.utils");

exports.sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: "snatched <nishantsharma13903@gmail.com>",
      to,
      subject,
      html,
    };
    const response = await transporter.sendMail(mailOptions);
    logger.info("Email sent successfully", response)
    return true;
  } catch (error) {
    logger.info("Error during sending email", error);
    return false;
  }
};
