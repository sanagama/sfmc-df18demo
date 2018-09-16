'use strict';

import * as winston from "winston";
import * as shortid from "shortid";

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
    /**
     * logInfo: Helper to log Info messages
     * 
     */
    public static logInfo(msg: any)
    {
        winston.info(msg);
    }

    /**
     * logError: Helper to log Error messages
     * 
     */
    public static logError(msg: any)
    {
        winston.error(msg);
    }

    /**
     * prettyPrintJson: helper to pretty print a flat JSON string
     * 
     */
    public static prettyPrintJson(jsonString: string)
    {
        return JSON.stringify(JSON.parse(jsonString), null, 2);
    }

    /**
     * initSampleDataAndRenderView: Called to render /apidemo and /appdemo views
     * 
     * Helper to init sample JSON data for this session and pass the session to the view
     * This lets the view access session variables (e.g. JWT JSON and sample data) for display purposes.
     * 
     */
    public static initSampleDataAndRenderView(req: any, res: any, viewName: string)
    {
      Utils.initSampleData()
      .then((sampleData: string) => {
        req.session.sampleJsonData = sampleData;
        res.render(viewName, { session: req.session });
      });
    }

    /**
     * initSampleData: Called on session start to generate sample JSON data to insert into Data Extension
     * 
     */
    private static initSampleData() : Promise<string>
    {
        Utils.logInfo("initSampleData called.");
        return new Promise<string>((resolve, reject) =>
        {
            let sampleData = [
                {
                    keys: {
                        id: shortid.generate()
                    },
                    values: {
                        name: 'Sanjay - ' + shortid.generate(),
                        email: 'sanjay-' + shortid.generate() + '@sanjay.com',
                    }
                },
                {
                    keys: {
                        id: shortid.generate()
                    },
                    values: {
                        name: 'Savita - ' + shortid.generate(),
                        email: 'savita-' + shortid.generate() + '@savita.com'
                    }
                }             
            ];

            resolve(Utils.prettyPrintJson(JSON.stringify(sampleData)));
        });
    }
}