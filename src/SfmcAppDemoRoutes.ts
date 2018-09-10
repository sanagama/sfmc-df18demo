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
    private _jwtFromSFMC: string;
    private _refreshTokenFromJwt: string;

    /**
     * login: called by Marketing Cloud when hosted app is launched. Decodes JWT in BODY passed by Marketing Cloud.
     * Handles POST on: /login
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

        Utils.logInfo("POST body = \n" + JSON.stringify(req.body));

        let encodedJWT = JSON.stringify(req.body.jwt);
        Utils.logInfo("Encoded JWT = \n" + encodedJWT);

        let jwtSecret = process.env.DF18DEMO_JWTSECRET;
        Utils.logInfo("jwtSecret = \n" + jwtSecret);
        let decodedJWT = jwt.decode(encodedJWT, jwtSecret, true); // passing 'noVerify = true' for this demo

        Utils.logInfo("Decoded JWT = \n" + JSON.stringify(decodedJWT));

        let sfmcRequest = decodedJWT.request;
        Utils.logInfo("sfmcRequest from JWT = \n" + JSON.stringify(sfmcRequest));

        let sfmcRest = decodedJWT.request.rest;
        Utils.logInfo("sfmcRest from JWT = \n" + JSON.stringify(sfmcRest));

        let authEndpoint = sfmcRest.authEndpoint;
        Utils.logInfo("authEndpoint from JWT = \n" + authEndpoint);

        let apiEndpointBase = sfmcRest.apiEndpointBase;
        Utils.logInfo("apiEndpointBase from JWT = \n" + apiEndpointBase);

        let refreshToken = sfmcRest.refreshToken;
        Utils.logInfo("refreshToken from JWT = \n" + refreshToken);

        let sfmcUser = sfmcRequest.user;
        Utils.logInfo("sfmcUser from JWT = \n" + JSON.stringify(sfmcUser));

        let sfmcOrganization = sfmcRequest.organization;
        Utils.logInfo("sfmcOrganization from JWT = \n" + JSON.stringify(sfmcOrganization));

        let sfmcApplication = sfmcRequest.application;
        Utils.logInfo("sfmcApplication from JWT = \n" + JSON.stringify(sfmcApplication));

        let redirectUrl = sfmcApplication.redirectUrl;
        Utils.logInfo("Redirecting to: \n" + JSON.stringify(redirectUrl));

        res.redirect(redirectUrl); // redirect to MC app landing page
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

        // Destroy OAuth refresh token from JWT
        self._refreshTokenFromJwt = "";
        self._jwtFromSFMC = "";

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
        let clientId = process.env.DF18DEMO_CLIENTID;
        let clientSecret = process.env.DF18DEMO_CLIENTSECRET;

        Utils.logInfo("getOAuthAccessToken route entered. SessionId = " + sessionId);

        if (self._refreshTokenFromJwt)
        {
            Utils.logInfo("Getting OAuth Access Token with refreshToken: " + self._refreshTokenFromJwt);

            self._apiHelper.getOAuthAccessTokenFromRefreshToken(self._refreshTokenFromJwt)
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
     * jwtinfo: called by web app to obtain JWT for display purposes
     * Handles GET on: /jwtinfo
     * 
     */
    public getJwtInfo(req: express.Request, res: express.Response)
    {
        let self = this;
        let sessionId = req.session.id;
        Utils.logInfo("getJwtInfo called. SessionId = " + sessionId);


        res.sendStatus(202); // accepted
    }    
}