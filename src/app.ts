/*
 * Express App
 */

import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as session from "express-session";

import SfmcDataExtensionAPI from './SfmcDataExtensionAPI';
import SfmcAppHelper from './SfmcAppHelper';

const PORT = process.env.PORT || 5000

// Create & configure Express server
const app = express();

// Express configuration
app.set("port", PORT);
app.set("views", path.join(__dirname, "../views"));
app.set('view engine', 'ejs');

// Use helmet. More info: https://expressjs.com/en/advanced/best-practice-security.html
var helmet = require('helmet')
app.use(helmet());

// Allow X-Frame from Marketing Cloud. Sets "X-Frame-Options: ALLOW-FROM http://exacttarget.com".
app.use(helmet.frameguard({
    action: 'allow-from',
    domain: 'http://exacttarget.com'
  }))

app.use(session({
    name: 'server-session-cookie-id',
    secret: 'sanagama-df18',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup static paths
app.use(express.static(path.join(__dirname, "../static")));
app.use(favicon(path.join(__dirname,'../static','images','favicons', 'favicon.ico')));

// Routes: pages
app.get('/', function(req, res) { res.render("index"); });
app.get('/demo1', function(req, res) { res.render("demo1"); });
app.get('/demo2', function(req, res) { res.render("demo2"); });

// Routes: used by this app to call Marketing Cloud APIs
const deApi = new SfmcDataExtensionAPI();

app.get('/accesstoken', function(req, res) {
  deApi.initAccessToken(req, res); });

app.post('/loaddata', function(req, res) {
  deApi.loadData(req, res); });
  
// Routes: called by Marketing Cloud when hosted within IFRAME
const sfmcAppHelper = new SfmcAppHelper();

app.post('/login', function(req, res) {
  sfmcAppHelper.login(req, res); });

app.post('/logout', function(req, res) {
  sfmcAppHelper.logout(req, res); });

app.get('/jwtinfo', function(req, res) {
  sfmcAppHelper.getJwtInfo(req, res); });

module.exports = app;