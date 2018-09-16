/*
 * Main entry point: Start Express App
 */

import * as errorHandler from "errorhandler";
import * as http from 'http';
import * as https from 'https';
import fs = require('fs');
import { AddressInfo } from "net";

const app = require("./app");

// Error Handler. Provides full stack - remove for production
app.use(errorHandler());

// If running in Heroku then run 'http' server, else run 'https' server
// See: https://stackoverflow.com/questions/28472113/is-there-a-programmatic-way-to-know-a-node-js-app-is-running-in-heroku
//
var httpsOptions = {
  key: fs.readFileSync( './localhost.key' ),
  cert: fs.readFileSync( './localhost.cert' ),
  requestCert: false,
  rejectUnauthorized: false
};

if(process.env.RUNNING_IN_HEROKU)
{
  // Start 'http' server because SSL termination occurs at Heroku's load balancers
  // See: https://stackoverflow.com/questions/25148507/https-ssl-on-heroku-node-express
  let server = http.createServer(app).listen(app.get("port"), () => {
    onListening(false, app.get("env"), server.address() as AddressInfo);
  });
}
else
{
  // Start 'https' server and use self-signed certificate
  // See: https://www.kevinleary.net/self-signed-trusted-certificates-node-js-express-js/
  let server = https.createServer(httpsOptions, app).listen(app.get("port"), () => {
    onListening(true, app.get("env"), server.address() as AddressInfo);
  });
}

// Helper to log status after Express starts
function onListening(isHttps: boolean, mode: string, addressInfo: AddressInfo)
{
  let scheme = isHttps ? "https" : "http";
  console.log(" Salesforce Marketing Cloud demo at Dreamforce 2018.");
  console.log((" Express is running '%s' server in '%s' mode at %s://[%s]:%d, family: %s"),
    scheme, mode, scheme, addressInfo.address, addressInfo.port, addressInfo.family);
  console.log("  Press CTRL-C to stop\n");
}
