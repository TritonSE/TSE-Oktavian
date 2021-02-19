const nodemailer = require("nodemailer");
const Email = require("email-templates");
const config = require("../config");
const transporter =
  config.email.user === ""
    ? null
    : nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: config.email,
      });
const mail =
  config.email.user === ""
    ? null
    : new Email({
        transport: transporter,
        send: true,
        preview: false,
      });

/**
 * Responsible for populating an email template and sending to a target email.
 *
 * @param template a string referring to one of four templates in the email folder
 * @param email the recipient's email
 * @param params the template's parameters
 */
async function sendEmail(template, target_email, params) {
  if (mail != null) {
    await mail.send({
      template: template,
      message: {
        from: config.email.user,
        to: target_email,
      },
      locals: params,
    });
    console.log(`Email ${template} has been sent to ${target_email}.`);
  } else {
    console.log(
      `Email ${template} would have been sent to ${target_email} but is disabled.`
    );
  }
}

module.exports = { sendEmail };
