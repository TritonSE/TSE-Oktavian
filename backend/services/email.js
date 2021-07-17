const nodemailer = require("nodemailer");
const Email = require("email-templates");
const { EMAIL_USERNAME, EMAIL_PASSWORD, DEPLOYMENT_URL } = require("../constants");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

const mail = new Email({ transport: transporter });

/**
 * Responsible for populating an email template and sending to a target email.
 * In development, the email will be previewed in the browser instead.
 *
 * @param template a string referring to one of four templates in the email folder
 * @param target_email the recipient's email
 * @param params the template's parameters
 */
async function sendEmail(template, target_email, params) {
  try {
    await mail.send({
      template,
      message: {
        from: EMAIL_USERNAME,
        to: target_email,
      },
      locals: { DEPLOYMENT_URL, ...params },
    });
    console.log(`Email ${template} has been sent to ${target_email}.`);
  } catch (e) {
    console.error(`Could not send email ${template} to ${target_email}.`);
    console.error(e);
  }
}

module.exports = { sendEmail };
