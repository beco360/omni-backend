/** Dependencies */
const express = require("express");
const app = express();
const path = require("path");
const logger = require("./utils/logger");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require('body-parser');


/** Settings */
app.set("PORT", process.env.PORT || 3000);

/** Middlewares */
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json
app.use(
  morgan(
    'HTTP/:http-version :method :url :status :res[content-length] - :response-time ms ":referrer" ":user-agent"',
    { stream: logger.stream }
  )
); // Listen petitions HTTP
app.use(express.static(path.join(__dirname, "dist"))); // Static folder
app.use(express.static(path.join(__dirname, "public"))); // Static folder
app.use(helmet());

/** Routes */
app.use("/api/auth", require("./routes/authRouter"));
app.use("/api/chat", require("./routes/chat"));
app.use("/integrations/facebook", require("./routes/integrations/facebookMessenger"));

module.exports = app;