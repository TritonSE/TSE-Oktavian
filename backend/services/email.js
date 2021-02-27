const nodemailer = require("nodemailer");
const Email = require("email-templates");
const { EMAIL_USERNAME, EMAIL_PASSWORD } = require("../constants");

const transporter =
  EMAIL_USERNAME === ""
    ? null
    : nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: EMAIL_USERNAME,
          pass: EMAIL_PASSWORD,
        },
      });
const mail =
  EMAIL_USERNAME === ""
    ? null
    : new Email({
        transport: transporter,
        send: true,
        preview: false,
      });
if (mail == null) {
  console.log(
    "No mail credentials were provided, so automated mail has been disabled."
  );
}

/**
 * Responsible for populating an email template and sending to a target email.
 * This function will be a NOP if no mail credentials are provided at the start of the application.
 *
 * @param template a string referring to one of four templates in the email folder
 * @param target_email the recipient's email
 * @param params the template's parameters
 */
async function sendEmail(template, target_email, params) {
  if (mail != null) {
    await mail.send({
      template: template,
      message: {
        from: EMAIL_USERNAME,
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
