'use strict';

import path = require('path');
import fs = require('fs');
import express = require("express");
import * as winston from "winston";
import axios from 'axios';

// Configure logging
winston.configure({
    level: process.env.LOG_LEVEL || "debug",
    transports: [ new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    })
  ]
});

export default class SfmcApiHelper
{
    // Instance variables
    private _clientId = process.env.DF18DEMO_CLIENTID;
    private _clientSecret = process.env.DF18DEMO_CLIENTSECRET;
    private _jwtSecret = process.env.DF18DEMO_JWTSECRET;
    private _jwtFromSFMC = "";
    private _oauthRefreshToken = "";
    private _oauthAccessToken = "";
    private _oauthAccessTokenExpiresIn = "";
    private _sfmcAuthServiceUrl = "https://auth.exacttargetapis.com/v1/requestToken";
    private _deExternalKey = "DF18Demo";
    private _sfmcDataExtensionUrl = "https://www.exacttargetapis.com/hub/v1/dataevents/key:" + this._deExternalKey + "/rowset";


    /**
     * prettyPrintJson: helper to pretty print a flat JSON string
     * 
     */
    private prettyPrintJson(jsonString: string)
    {
        var jsonPretty = JSON.stringify(JSON.parse(jsonString), null, 2);
        return jsonPretty;
    }

    /**
     * getOAuthAccessToken: called by demo app to get an OAuth access token given ClientId and ClientSecret
     * Handles GET on route: /accesstoken
     * 
     * More info: https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-getting-started.meta/mc-getting-started/get-access-token.htm
     * 
     */
    public getOAuthAccessToken(req: express.Request, res: express.Response)
    {
        let self = this;
        let sessionId = req.session.id;
        winston.info("getAccessToken called. SessionId = " + sessionId);

        if (self._clientId && self._clientSecret)
        {
            winston.info("ClientID and ClientSecret found in environment variables.");
            winston.info("Getting OAuth token...");

            let headers = {
                'Content-Type': 'application/json;charset=UTF-8',
            };

            let postBody = {
                'clientId': self._clientId,
                'clientSecret': self._clientSecret
            };

            // POST to Marketing Cloud REST Auth service and get back an OAuth access token.
            axios.post(self._sfmcAuthServiceUrl, postBody, {"headers" : headers})
            .then(function (response) {
                // success
                self._oauthAccessToken = response.data.accessToken;
                self._oauthAccessTokenExpiresIn = response.data.expiresIn;
                winston.info("Got OAuth token: " + self._oauthAccessToken + ", expires = " +  self._oauthAccessTokenExpiresIn);

                res.status(response.status).send(response.statusText + "\n" + self.prettyPrintJson(JSON.stringify(response.data)));
            })
            .catch(function (error) {
                // error
                winston.error("Error getting OAuth token: " + error.message);
                if (error.response)
                {
                    res.status(error.response.status).send(error.message);
                }
                else
                {
                    res.sendStatus(500);
                }
            });
        }
        else
        {
            // error
            let errorMsg = "ClientID or ClientSecret *not* found in environment variables."; 
            winston.error(errorMsg);
            res.status(500).send(errorMsg);
        }
    }

    /**
     * loadData: called by demo app to get an OAuth access token given ClientId and ClientSecret
     * Handles GET on route: /loaddata
     * 
     * More info: https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/postDataExtensionRowsetByKey.htm
     * 
     */
    public loadData(req: express.Request, res: express.Response)
    {
        let self = this;
        let sessionId = req.session.id;
        winston.info("loadData called. SessionId = " + sessionId);
        winston.info("Loading sample data into Data Extension: " + self._deExternalKey);

        if (self._oauthAccessToken)
        {
            winston.info("Using OAuth token: " + self._oauthAccessToken + ", expires = " +  self._oauthAccessTokenExpiresIn);

            let headers = {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + self._oauthAccessToken
            };

            // Read file with sample JSON data
            let sampleDataFilePath = path.join(__dirname,'../static','json','sample-data.json');
            let postBody = fs.readFileSync(sampleDataFilePath, 'utf8');
    
            // POST to Marketing Cloud Data Extension endpoint to load sample data
            axios.post(self._sfmcDataExtensionUrl, postBody, {"headers" : headers})
            .then(function (response) {
                // success
                winston.info("Successfully loaded sample data!");
                res.status(response.status).send(response.statusText + "\n" + self.prettyPrintJson(JSON.stringify(response.data)));
            })
            .catch(function (error) {
                // error
                winston.error("Error loading sample data: " + error.message);
                if (error.response)
                {
                    winston.error(error.response.data);
                    res.status(error.response.status).send(error.message);
                }
                else
                {
                    res.sendStatus(500); // error
                }
            });
        }
        else
        {
            // error
            let errorMsg = "OAuth Access Token *not* found. Please restart demo app."; 
            winston.error(errorMsg);
            res.status(500).send(errorMsg);
        }
    }

    // <!-- Integrate an externally hosted app via iframe. -->
    
    /**
     * login: called by Marketing Cloud when app is launched. Decodes JWT passed by Marketing Cloud.
     * Handles POST on: /login
     * 
     * More info: https://developer.salesforce.com/docs/atlas.en-us.mc-app-development.meta/mc-app-development/decode-jwt.htm
     * More info: https://developer.salesforce.com/docs/atlas.en-us.mc-app-development.meta/mc-app-development/explanation-decoded-jwt.htm
     * 
     */
    public login(req: express.Request, res: express.Response)
    {
        let self = this;
        let sessionId = req.session.id;
        winston.info("login called. SessionId = " + sessionId);

        // Decode JWT from JSON body

        res.sendStatus(202); // accepted
    }
   
    /**
     * logout: called by Marketing Cloud when user logs out
     * Handles POST on: /logout
     * 
     */
    public logout(req: express.Request, res: express.Response)
    {
        let self = this;
        let sessionId = req.session.id;
        winston.info("logout called. SessionId = " + sessionId);

        // Destroy the OAuth refresh token from JWT
        self._oauthRefreshToken = "";
        self._jwtFromSFMC = "";

        res.sendStatus(202); // accepted
    }

    /**
     * jwtinfo: called by web app to obtain JWT for display purposes
     * Handles GET on: /jwtinfo
     * 
     */
    public getJwtInfo(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        winston.info("getJwtInfo called. SessionId = " + sessionId);

        // Parse JWT from body

        res.sendStatus(202); // accepted
    }    
}