/** Dependencies */
const socketIO = require("socket.io");
const logger = require("../utils/logger");
module.exports = function(server) {
  logger.info("SocketIO setup succesfully");
  const io = socketIO(server, {cookie: false});

  io.on("connection", socket => {
    logger.info("New socket connected");

    socket.on("disconnect", () => {
      logger.info("A socket disconnected");
    });

    socket.on("connect_failed", error => {
      logger.info(`Error on conexión with socket: ${error}`);
    });

    socket.on("start-chat", (data, token) => {

    });
    // Get sockets connected
    // io.sockets.clients().server.engine.clientsCount
    // Object.keys(io.sockets.clients().connected).length
  });
};
