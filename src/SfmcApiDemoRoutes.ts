'use strict';

import path = require('path');
import express = require("express");
import SfmcApiHelper from './SfmcApiHelper';
import Utils from './Utils';

export default class SfmcApiDemoRoutes
{
    // Instance variables
    private _apiHelper = new SfmcApiHelper();
    private _oauthAccessToken: string;
    private _oauthAccessTokenExpiry: Date;

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

        Utils.logInfo("getOAuthAccessTokenApiDemo route entered. SessionId = " + sessionId);

        if (clientId && clientSecret)
        {
            Utils.logInfo("Getting OAuth Access Token with ClientID and ClientSecret found in environment variables.");

            self._apiHelper.getOAuthAccessToken(clientId, clientSecret)
            .then((result) => {
                self._oauthAccessToken = result.oauthAccessToken;
                self._oauthAccessTokenExpiry = result.oauthAccessTokenExpiry;
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
        let sessionId = req.session.id;
        Utils.logInfo("loadData route entered. SessionId = " + sessionId);

        if (self._oauthAccessToken)
        {
            Utils.logInfo("Using OAuth token: " + self._oauthAccessToken);
            let jsonDataFilePath = path.join(__dirname, '../static', 'json', 'sample-data.json');
            self._apiHelper.loadData(self._oauthAccessToken, jsonDataFilePath)
            .then((result) => {
                res.status(result.status).send(result.statusText);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        }
        else
        {
            // error
            let errorMsg = "OAuth Access Token *not* found.\nPlease complete previous demo step\nto get an OAuth Access Token."; 
            Utils.logError(errorMsg);
            res.status(500).send(errorMsg);
        }
    }
}