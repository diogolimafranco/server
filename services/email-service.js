const sendgrid = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.load();

sendgrid.setApiKey(process.env.SENDGRID_KEY);

exports.send = async (data) => {
  sendgrid.send({
    to: data.to,
    from: data.from || process.env.EMAIL_DEFAULT_SENDER,
    subject: data.subject,
    html: data.html,
    text: data.text
  });
}