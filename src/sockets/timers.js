module.exports = function(socket) {
  socket.on("addUserTimers", userId => {
    global.timers.addUserTimers(userId);
  });
  socket.on("initTimerOnline", userId => {
    global.timers.initTimerOnline(userId);
  });
  socket.emit("timesOfUser", {
    timeOnline: global.timers.getUserTimes(1).userTimes.timeOnline.getTimeValues().toString()
  })
};
