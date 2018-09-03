/*
 * Main entry point: Start Express App
 */

import * as errorHandler from "errorhandler";

const app = require("./app");

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log(" Salesforce Marketing Cloud demo at Dreamforce 2018.");
  console.log((" Express is running at port: %d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});

export = server;
