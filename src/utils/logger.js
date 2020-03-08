/**
 * logger.js
 *
 * Se usa WinstonJS para el manejo de logs siguiendo
 * los siguientes niveles de riesgo definidos en el
 * estandar => https://tools.ietf.org/html/rfc5424
 *
 *  0       emerg: el sistema no se puede usar
 *  1       alert: se deben tomar medidas de inmediato
 *  2       crit: condiciones críticas
 *  3       error: condiciones de error
 *  4       warning: condiciones de advertencia
 *  5       notice: condición normal pero significativa
 *  6       info: mensajes informativos
 *  7       debug: mensajes de nivel de depuración
 */

/** Dependencies */
const winston = require("winston");
const path = require("path");
const moment = require("moment");

/** Utilities */
const utilMails = require("./mails");

/** Global variables */
var logger = null;

class Logger {
  constructor() {
    this.logger = null;
    this.setUpLogger();
  }

  setUpLogger() {
    const format = winston.format.printf(info => {
      let timestamp = moment().format("MMMM Do YYYY, h:mm:ss a");
      return `[${timestamp}] ${info.level}: ${info.message}`;
    });

    this.logger = winston.createLogger({
      levels: winston.config.syslog.levels,
      transports: []
    });

    // Cuando la app se encuentra en producción se guardaran los logs en un archivo
    // Cuando la app se encuentra en producción se enviaran correos desde "error" para notificar los motivos
    // Si la app no se encuentra en producción se imprimiran los logs en consola pero no se guardaran
    if (process.env.NODE_ENV == "production") {
      this.logger.add(
        new winston.transports.File({
          format: winston.format.combine(format),
          handleExceptions: true,
          maxsize: 5242880, //5MB
          maxFiles: 5,
          level: "debug",
          filename: path.join(__dirname, "../../logs", "combined.log"),
          colorize: false
        })
      );
    } else {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), format),
          level: "debug",
          handleExceptions: true,
          colorize: true
        })
      );
    }
  }
  emerg(msg) {
    if (process.env.NODE_ENV == "production") {
      utilMails.sendMail(
        "devops.it@cos.com.co",
        "Emergencia en bothuman",
        `
        Bothuman tiene una emergencia, necesita una revisión inmediata
        Descripción:
        ${msg}
        `
      );
    }
    this.logger.emerg(msg);
  }
  alert(msg) {
    if (process.env.NODE_ENV == "production") {
      utilMails.sendMail(
        "devops.it@cos.com.co",
        "Alerta en bothuman",
        `
        Bothuman tiene una emergencia, necesita una revisión inmediata
        Descripción:
        ${msg}
        `
      );
    }
    this.logger.alert(msg);
  }
  crit(msg) {
    if (process.env.NODE_ENV == "production") {
      utilMails.sendMail(
        "devops.it@cos.com.co",
        "Nuevo fallo critico en bothuman",
        `
        Bothuman tiene una emergencia, necesita revisión.
        Descripción:
        ${msg}
        `
      );
    }
    this.logger.crit(msg);
  }
  error(msg) {
    if (process.env.NODE_ENV == "production") {
      utilMails.sendMail(
        "devops.it@cos.com.co",
        "Error en bothuman",
        `
        Bothuman tiene un error
        Descripción:
        ${msg}
        `
      );
    }
    this.logger.error(msg);
  }
  warning(msg) {
    this.logger.warning(msg);
  }
  notice(msg) {
    this.logger.notice(msg);
  }
  info(msg) {
    this.logger.info(msg);
  }
  debug(msg) {
    this.logger.debug(msg);
  }
}

if (!logger) {
  logger = new Logger();
}

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding) {
    new Logger().info(message);
  }
}; // Se usa para morgan
