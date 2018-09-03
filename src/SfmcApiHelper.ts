'use strict';

import express = require("express");
import path = require('path');
import Utils = require('./utils');

export default class SfmcApiHelper
{
    private static _requestStatusMap = new Map<string, string>();
    
    /**
     * newDataExtension: called web app to create a new Data Extension in Marketing Cloud
     * Handles POST on: /newdataextension
     */
    public newDataExtension(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        Utils.logDebug("newDataExtension called. SessionId = " + sessionId);

        // Use ClientID and ClientSecret to call REST API to create a new Data Extension in Marketing Cloud

        res.sendStatus(202); // accepted
    }
   
    /**
     * loadData: called by Marketing Cloud when app is shutdown
     * Handles POST on: /loaddata
     */
    public loadData(req: express.Request, res: express.Response)
    {
        var sessionId = req.session.id;
        Utils.logDebug("loadData called. SessionId = " + sessionId);

        // Use ClientID and ClientSecret to call REST API to load data into the new Data Extension in Marketing Cloud

        res.sendStatus(202); // accepted
    }
}