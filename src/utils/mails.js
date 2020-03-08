/** Dependencies */
var nodemailer = require("nodemailer");
var logger = require('./logger');

function sendMail(toMail, subject, message) {
  let fromMail = "montechelo.devops@gmail.com";
  let passMail = "P@ss0102";

  //Creamos el objeto de transporte
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: fromMail,
      pass: passMail
    }
  });

  var mailOptions = {
    from: fromMail,
    to: toMail,
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      logger.info(error);
      return false;
    } else {
      logger.info("Email enviado: " + info.response);
      return true;
    }
  });
}

module.exports = {
  sendMail
};
