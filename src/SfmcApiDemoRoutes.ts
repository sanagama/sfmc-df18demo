'use strict';

import path = require('path');
import express = require("express");
import SfmcApiHelper from './SfmcApiHelper';
import Utils from './Utils';

export default class SfmcApiDemoRoutes
{
    // Instance variables
    private _apiHelper = new SfmcApiHelper();

    /**
     * GET handler for /apidemooauthtoken
     * getOAuthAccessToken: called by demo app to get an OAuth access token with ClientId/ClientSecret in environment variables
     * 
     * More info: https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-getting-started.meta/mc-getting-started/get-access-token.htm
     * 
     */
    public getOAuthAccessToken(req: express.Request, res: express.Response)
    {
        let self = this;
        let sessionId = req.session.id;
        let clientId = process.env.DF18DEMO_CLIENTID;
        let clientSecret = process.env.DF18DEMO_CLIENTSECRET;

        req.session.oauthAccessToken = "";
        req.session.oauthAccessTokenExpiry = "";

        Utils.logInfo("getOAuthAccessToken route entered. SessionId = " + sessionId);

        if (clientId && clientSecret)
        {
            Utils.logInfo("Getting OAuth Access Token with ClientID and ClientSecret from in environment variables.");

            self._apiHelper.getOAuthAccessToken(clientId, clientSecret)
            .then((result) => {
                req.session.oauthAccessToken = result.oauthAccessToken;
                req.session.oauthAccessTokenExpiry = result.oauthAccessTokenExpiry;
                res.status(result.status).send(result.statusText);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        }
        else
        {
            // error
            let errorMsg = "ClientID or ClientSecret *not* found in environment variables."; 
            Utils.logError(errorMsg);
            res.status(500).send(errorMsg);
        }
    }
    
    /**
     * GET handler for /apidemoloaddata
     * loadData: called by the demo app to load sample data into the Data Extension "DF18Demo";'
     * 
     * More info: https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/postDataExtensionRowsetByKey.htm
     * 
     */
    public loadData(req: express.Request, res: express.Response)
    {
        let self = this;
        Utils.logInfo("loadData route entered.");
        self._apiHelper.loadData(req, res);
    }
}