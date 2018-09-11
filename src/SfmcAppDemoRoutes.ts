'use strict';

import path = require('path');
import express = require("express");
import jwt = require('jwt-simple');
import SfmcApiHelper from './SfmcApiHelper';
import Utils from './Utils';


// <!-- Integrate an externally hosted app via iframe. -->
export default class SfmcAppDemoRoutes
{
    // Instance variables
    private _apiHelper = new SfmcApiHelper();
    private _oauthAccessToken: string;
    private _oauthAccessTokenExpiry: Date;
    private _decodedJWT: any;
    private _refreshTokenFromJWT: string;

    /**
     * login: called by Marketing Cloud when hosted app is launched. Decodes JWT in BODY passed by Marketing Cloud.
     * Handles POST on: /login
     * 
     * Marketing Cloud does a POST on the '/login' route with the following JSON BODY:
     * {
     *  "jwt" : "<encoded JWT from SFMC>"
     * }
     * 
     * More info: https://developer.salesforce.com/docs/atlas.en-us.mc-app-development.meta/mc-app-development/decode-jwt.htm
     * More info: https://developer.salesforce.com/docs/atlas.en-us.mc-app-development.meta/mc-app-development/explanation-decoded-jwt.htm
     * 
     */
    public login(req: express.Request, res: express.Response)
    {
        let self = this;
        let sessionId = req.session.id;
        Utils.logInfo("login called. SessionId = " + sessionId);

        // Decode JWT with the secret from environment variable.
        try
        {
            // Decode JWT
            let encodedJWT = JSON.stringify(req.body.jwt);
            let jwtSecret = process.env.DF18DEMO_JWTSECRET;
            Utils.logInfo("Decoding JWT with secret from DF18DEMO_JWTSECRET = " + jwtSecret);
            self._decodedJWT = jwt.decode(encodedJWT, jwtSecret, true); // pass 'noVerify = true' for this demo
            
            // Store in the current session for redirect URL to pick up later for display
            let decodedJwtJson = Utils.prettyPrintJson(JSON.stringify(self._decodedJWT));
            req.session.jwtFromSFMC = decodedJwtJson;
            Utils.logInfo("Decoded JWT from SFMC = \n" + decodedJwtJson);

            // Get refreshToken from JWT
            self._refreshTokenFromJWT = self._decodedJWT.request.rest.refreshToken;
            Utils.logInfo("refreshToken from JWT = \n" + self._refreshTokenFromJWT);

            let redirectUrl = self._decodedJWT.request.application.redirectUrl;
            Utils.logInfo("Redirecting to: \n" + JSON.stringify(redirectUrl));
            res.redirect(redirectUrl); // redirect to MC app landing page
        }
        catch(error)
        {
            let errorMsg = "Error while decoding JWT. Message: " + error;
            Utils.logError(errorMsg);
            res.status(400).send(errorMsg);
        }
    }
   
    /**
     * POST handler for: /logout
     * logout: called by Marketing Cloud when user logs out
     * 
     */
    public logout(req: express.Request, res: express.Response)
    {
        let self = this;
        let sessionId = req.session.id;
        Utils.logInfo("logout called. SessionId = " + sessionId);

        // Clear out JWT and everything we got from it.
        self._oauthAccessToken = "";
        self._oauthAccessTokenExpiry = null;
        self._decodedJWT = null;
        self._refreshTokenFromJWT = "";
    
        res.sendStatus(202); // accepted
    }

    /**
     * GET handler for: /appdemooauthtoken
     * getOAuthAccessToken: called by demo app to get an OAuth access token
     * 
     * More info: https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-getting-started.meta/mc-getting-started/get-access-token.htm
     * 
     */
    public getOAuthAccessToken(req: express.Request, res: express.Response)
    {
        let self = this;
        let sessionId = req.session.id;
        //let clientId = process.env.DF18DEMO_CLIENTID;
        //let clientSecret = process.env.DF18DEMO_CLIENTSECRET;

        Utils.logInfo("getOAuthAccessToken route entered. SessionId = " + sessionId);

        if (self._refreshTokenFromJWT)
        {
            Utils.logInfo("Getting OAuth Access Token with refreshToken: " + self._refreshTokenFromJWT);

            self._apiHelper.getOAuthAccessTokenFromRefreshToken(self._refreshTokenFromJWT)
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
            let errorMsg = "refreshToken *not* found. Check the '/login' URL specified in your Marketing Cloud App configuration."; 
            Utils.logError(errorMsg);
            res.status(500).send(errorMsg);
        }
    }

    /**
     * GET handler for /appdemoloaddata
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

    /**
     * getJwtInfo: called by web app to obtain JWT for display purposes
     * Handles GET on: /jwtinfo
     * 
     */
    public getJwtInfo(req: express.Request, res: express.Response)
    {
        let self = this;
        let sessionId = req.session.id;
        Utils.logInfo("getJwtInfo called. SessionId = " + sessionId);
        res.status(202).send(Utils.prettyPrintJson(JSON.stringify(self._decodedJWT))); // accepted
    }    
}