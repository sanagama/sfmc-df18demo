/*
 * Main entry point: Start Express App
 */

import * as errorHandler from "errorhandler";
import * as https from 'https';
import fs = require('fs');
import { AddressInfo } from "net";

const app = require("./app");

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

// Run https on localhost
// https://www.kevinleary.net/self-signed-trusted-certificates-node-js-express-js/
var options = {
  key: fs.readFileSync( './localhost.key' ),
  cert: fs.readFileSync( './localhost.cert' ),
  requestCert: false,
  rejectUnauthorized: false
};

/**
 * Start Express server (https)
 */
let server = https.createServer( options, app );
server.listen(app.get("port"), () => {
  console.log(" Salesforce Marketing Cloud demo at Dreamforce 2018.");
  let ai = server.address() as AddressInfo;
  console.log((" Express is running in '%s' mode at https://[%s]:%d, family: %s"), app.get("env"), ai.address, ai.port, ai.family);
  console.log("  Press CTRL-C to stop\n");
} );

export = server;
