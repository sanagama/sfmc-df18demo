'use strict';

import express = require("express");
import winston = require("winston");

export default class SfmcDataExtensionAPI
{
    private _clientId = "";
    private _clientSecret = "";
    private _jwtSecret = process.env.DF18DEMO_JWTSECRET;
    private _oauthAccessToken = "";
    private _oauthAccessTokenExpiresIn = "";

    /**
     * initAccessToken: called by demo app to get an OAuth access token with ClientId and ClientSecret
     * Handles GET on route: /accesstoken
     * 
     * More info: https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-getting-started.meta/mc-getting-started/get-access-token.htm
     */
    public initAccessToken(req: express.Request, res: express.Response)
    {
        var self = this;
        var sessionId = req.session.id;
        winston.info("initAccessToken called. SessionId = " + sessionId);

        winston.info("Loading API key from environment variables: DF18DEMO_CLIENTID and DF18DEMO_CLIENTSECRET.");
        self._clientId = process.env.DF18DEMO_CLIENTID;
        self._clientSecret = process.env.DF18DEMO_CLIENTSECRET;
        if (self._clientId && self._clientSecret)
        {
            winston.info("ClientID and ClientSecret found in environment variables.");

            var body = { "clientId": self._clientId, "clientSecret": self._clientSecret };
            var sfmcAuthServiceUrl = "https://auth.exacttargetapis.com/v1/requestToken";

            fetch(sfmcAuthServiceUrl, { 
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(json => {
                winston.info("Oauth JSON = " + json);

                self._oauthAccessToken = json.accessToken;
                self._oauthAccessTokenExpiresIn = json.expiresIn;

                winston.info("token = " + self._oauthAccessToken + ", expires = " +  self._oauthAccessTokenExpiresIn);

            })
            .catch((err) => {
                winston.error(err);
                res.sendStatus(500); // error
            });

            res.sendStatus(202); // accepted
        }
        else
        {
            winston.error("ClientID or ClientSecret not found in environment variables. Please set and re-run this app.");
            res.sendStatus(500); // error
        }
    }

    /**
     * loadData: called by Marketing Cloud when app is shutdown
     * Handles POST on route: /loaddata
     */
    public loadData(req: express.Request, res: express.Response)
    {
        var self = this;
        var sessionId = req.session.id;
        winston.info("loadData called. SessionId = " + sessionId);

        // Use ClientID and ClientSecret to call REST API to load data into the new Data Extension in Marketing Cloud

        res.sendStatus(202); // accepted
    }
}