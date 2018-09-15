'use strict';

import path = require('path');
import * as winston from "winston";
import express = require("express");
import SfmcApiHelper from './SfmcApiHelper';

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

export default class Utils
{
    // Helper to log messages
    public static logInfo(msg: any)
    {
        winston.info(msg);
    }

    // Helper to log messages
    public static logError(msg: any)
    {
        winston.error(msg);
    }

    // prettyPrintJson: helper to pretty print a flat JSON string
    public static prettyPrintJson(jsonString: string)
    {
        return JSON.stringify(JSON.parse(jsonString), null, 2);
    }

    public static loadDataHelper(apiHelper: SfmcApiHelper, req: express.Request, res: express.Response)
    {
        let sessionId = req.session.id;
        Utils.logInfo("loadDataHelper entered. SessionId = " + sessionId);

        if (req.session.oauthAccessToken)
        {
            Utils.logInfo("Using OAuth token: " + req.session.oauthAccessToken);
            let jsonDataFilePath = path.join(__dirname, '../static', 'json', 'sample-data.json');
            apiHelper.loadData(req.session.oauthAccessToken, jsonDataFilePath)
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
            let errorMsg = "OAuth Access Token *not* found in session.\nPlease complete previous demo step\nto get an OAuth Access Token."; 
            Utils.logError(errorMsg);
            res.status(500).send(errorMsg);
        }
    }    
}