// mailer.js

const nodemailer = require("nodemailer");

function sendEmail(name, email, message, callback) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ox1995ter@gmail.com", // Ваш адрес электронной почты
      pass: "hskq dhhq hksn xvvu", // Ваш пароль от почты
    },
  });

  const mailOptions = {
    from: email,
    to: "uems@ukr.net", // Адрес получателя
    subject: "New Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      callback(error, null);
    } else {
      console.log("Email sent: " + info.response);
      callback(null, info);
    }
  });
}

module.exports = {
  sendEmail,
};
