'use strict';

import express = require("express");
import * as winston from "winston";
import axios from 'axios';

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
    private _clientId = process.env.DF18DEMO_CLIENTID;
    private _clientSecret = process.env.DF18DEMO_CLIENTSECRET;
    private _jwtSecret = process.env.DF18DEMO_JWTSECRET;
    private _oauthAccessToken = "";
    private _oauthAccessTokenExpiresIn = "";
    private _sfmcAuthServiceUrl = "https://auth.exacttargetapis.com/v1/requestToken";
    private _sfmcDataExtensionUrl = "https://www.exacttargetapis.com/hub/v1/dataevents/";

    /**
     * getOAuthAccessToken: called by demo app to get an OAuth access token given ClientId and ClientSecret
     * Handles GET on route: /accesstoken
     * 
     * More info: https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-getting-started.meta/mc-getting-started/get-access-token.htm
     */
    public getOAuthAccessToken(req: express.Request, res: express.Response)
    {
        var self = this;
        var sessionId = req.session.id;
        winston.info("getAccessToken called. SessionId = " + sessionId);

        if (self._clientId && self._clientSecret)
        {
            winston.info("ClientID and ClientSecret found in environment variables.");
            winston.info("Getting OAuth token...");

            axios.post(self._sfmcAuthServiceUrl,
            {
                "clientId": self._clientId,
                "clientSecret": self._clientSecret
            },
            { 
                "headers": { 'Content-Type': 'application/json' }
            })
            .then(function (response) {
                self._oauthAccessToken = response.data.accessToken;
                self._oauthAccessTokenExpiresIn = response.data.expiresIn;
                winston.info("Got OAuth token: " + self._oauthAccessToken + ", expires = " +  self._oauthAccessTokenExpiresIn);

                res.status(response.status).send(response.statusText + "\n" + JSON.stringify(response.data));
            })
            .catch(function (error) {
                winston.error("Error getting OAuth token: " + error.message);
                if (error.response)
                {
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
            let errorMsg = "ClientID or ClientSecret *not* found in environment variables."; 
            winston.error(errorMsg);
            res.status(500).send(errorMsg);
        }
    }

    /**
     * loadData: called by Marketing Cloud when app is shutdown
     * Handles GET on route: /loaddata
     */
    public loadDataIntoDataExtension(req: express.Request, res: express.Response)
    {
        var self = this;
        var sessionId = req.session.id;
        winston.info("loadData called. SessionId = " + sessionId);

        //https://www.exacttargetapis.com/hub/v1/dataevents/<mark>key:DF18Demo</mark>/rowset</pre>

        // Use ClientID and ClientSecret to call REST API to load data into the new Data Extension in Marketing Cloud

        res.sendStatus(202); // accepted
    }

    /**
     * login: called by Marketing Cloud when app is launched
     * Handles POST on: /login
     */
    public login(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        winston.info("login called. SessionId = " + sessionId);

        // Parse JWT from body

        res.sendStatus(202); // accepted
    }
   
    /**
     * logout: called by Marketing Cloud when app is shutdown
     * Handles POST on: /logout
     */
    public logout(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        winston.info("logout called. SessionId = " + sessionId);

        // Parse JWT from body

        res.sendStatus(202); // accepted
    }

    /**
     * jwtinfo: called by web app to obtain JWT for display purposes
     * Handles GET on: /jwtinfo
     */
    public getJwtInfo(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        winston.info("getJwtInfo called. SessionId = " + sessionId);

        // Parse JWT from body

        res.sendStatus(202); // accepted
    }    
}