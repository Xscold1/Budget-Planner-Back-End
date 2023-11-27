const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "budgetplanner321@gmail.com",
    pass: "qxifpotuuopnkylh",
  },
});

module.exports = transporter;