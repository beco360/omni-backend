/** Dependencies */
const logger = require("./utils/logger");

const app = require("./appConfig");
const initSocketIO = require("./sockets");
const initDatabase = require("./db");

/** Initializations */
(async function() {
  const server = await app.listen(app.get("PORT"), () => {
    logger.info(`Listen on ${process.env.HOST}`);
  });
  await initSocketIO(server);
  await initDatabase();
  await require("./setupGlobalTimers");
})();
