var { Timer } = require("easytimer.js"); // Timer para gestón tiempo de agentes
var schedule = require("node-schedule"); // Para programador de tareas

const logger = require("./utils/logger");

class GlobalTimers {
  constructor() {
    logger.info('Global timers initialized');
    this.usersStates = [];
  }
  addUserTimers(userId) {
    if (!this.userTimersExists(userId)) {
      this.usersStates.push({
        userId,
        timeOnline: new Timer(),
        timeOffline: new Timer(),
        timeWithoutCapacity: new Timer()
      });
    } else {
      logger.info("El usuario ya existe en el GlobarTimers Object");
    }
  }

  getUserTimes(userId) {
    return {
      userTimes: this.usersStates.find(element => element.userId == userId),
      usertimesIndex: this.usersStates.findIndex(
        element => element.userId == userId
      )
    };
  }

  initTimerOnline(userId) {
    let element = this.getUserTimes(userId);
    this.usersStates[element.usertimesIndex].timeOnline.start();
    this.usersStates[element.usertimesIndex].timeOffline.stop();
    this.usersStates[element.usertimesIndex].timeWithoutCapacity.stop();
  }

  initTimerOffline(userId) {
    let element = this.getUserTimes(userId);
    this.usersStates[element.usertimesIndex].timeOnline.stop();
    this.usersStates[element.usertimesIndex].timeOffline.start();
    this.usersStates[element.usertimesIndex].timeWithoutCapacity.stop();
  }

  initTimerWithoutCapacity(userId) {
    let element = this.getUserTimes(userId);
    this.usersStates[element.usertimesIndex].timeOnline.stop();
    this.usersStates[element.usertimesIndex].timeOffline.stop();
    this.usersStates[element.usertimesIndex].timeWithoutCapacity.start();
  }

  userTimersExists(userId) {
    let user = this.getUserTimes(userId);
    if (user.userTimes >= 0) {
      return true;
    }
    return false;
  }
}

global.timers = new GlobalTimers();
