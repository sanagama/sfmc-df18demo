# What's here?

## A Node.js web app that uses Marketing Cloud REST APIs to load sample data into a Data Extension.

## Introduction

These demos were shown in the session [Getting Started with Marketing Cloud API Integrations](https://success.salesforce.com/sessions?eventId=a1Q3A00001XoCSUUA3#/session/a2q3A0000022FHaQAM) at Dreamforce 2018.

This web app consists of 2 demos:
1. A standalone web app that uses REST APIs to load data into Marketing Cloud
1. The same web app running as a Marketing Cloud app within the Marketing Cloud UI

## One-time demo setup

### Step #1: Create a Data Extension for this demo to use

Login to your Marketing Cloud account and follow instructions at [Create Data Extension](https://help.salesforce.com/articleView?id=mc_cab_create_a_new_data_extension.htm&type=5) to create a new Standard Data Extension.

Property | Value
--------------- | ------------
*Name* | DF18Demo
*External Key* | DF18Demo
*Is Sendable* | No

Next, add the 4 fields below to the ```DF18Demo``` Data Extension:

Field Name | Data Type | Length | Primary Key | Nullable? | Default Value
--------------- | ------------ | ----- | ------- | ------ | -----
*id* | Text | 15 | Yes (Checked) | No (Unchecked) | (Empty)
*name* | Text | 50 | No (Unchecked) | No (Unchecked) | (Empty)
*email* | EmailAddress | 254 | No (Unchecked) | No (Unchecked) | (Empty) 
*created_dts* | Date | N/A | No (Unchecked) | No (Unchecked) | *Current Date*

### Step #2: Create a Marketing Cloud App
Follow instructions at [Create a Marketing Cloud App](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/create-a-mc-app.htm) to create a new Marketing Cloud App and use the values below:

Property | Value
--------------- | ------------
*Name* | Enter a name you wish. *The name you enter here shows up in the Marketing Cloud menu*
*Description* | Enter the description you wish.
*Login* | https://localhost:5000/login
*Redirect* | https://localhost:5000/appdemo
*Logout* | https://localhost:5000/logout

### Step #3: Add an API Integration component
Add an ```API Integration``` component to the Marketing Cloud App you just created.

1. Click ```Add Component``` in the Marketing Cloud App and choose ```API Integration```
1. Make sure *Perform server-to-server requests* is *checked*.
1. Make sure *Perform requests on behalf of the user* is *checked*.
1. When selecting the Marketing Cloud scope for your API calls, make sure the following permissions are *checked*:
    - DATA -> Data Extensions -> Read
    - DATA -> Data Extensions -> Write

See [API Integration](https://developer.salesforce.com/docs/atlas.en-us.mc-app-development.meta/mc-app-development/api-integration.htm) for more details.

### Step #4: Set environment variables

1. Get the ```ClientID``` and ```ClientSecret``` from API Integration component and put in the following environment variables on your local computer:
    - ```DF18DEMO_CLIENTID=YOUR_CLIENTID```
    - ```DF18DEMO_CLIENTSECRET=YOUR_CLIENTSECRET```

1. Get the ```JWT SIGNING SECRET``` from the Marketing Cloud App put in the following environment variable on your local computer:
    - ```DF18DEMO_JWTSECRET=YOUR_JWT_SIGNING_SECRET```

See [Get an API Key](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-getting-started.meta/mc-getting-started/get-api-key.htm) for more details.

## Run locally on your computer

The steps below are for MacOS. Modify as needed for your operating system.

### Install Node.js
Download and install Node.js for your operating system: <https://nodejs.org/en/download/>

### Get the source code

> *TIP:* If you have ```Git``` installed then you can do ```git clone https://github.com/sanagama/sfmc-df18demo.git``` instead.

1. Browse to <https://github.com/sanagama/sfmc-df18demo>
1. Click ```Clone or Download``` then click ```Download ZIP```
1. Save the ZIP file to your ```HOME``` directory as ```~/sfmc-df18demo.zip```
1. Extract the zip file to your ```HOME``` directory ```~/sfmc-df18demo.zip```

### Run the web app

Type the following commands in the ```Terminal``` window to run the web app:

```
cd ~/sfmc-df18demo
npm install
npm run
```

### Demo #1: Standalone app

In this demo, the web app running locally on ```https://localhost:5000``` calls the appropriate Marketing Cloud REST APIs to load sample data into the ```DF18Demo``` Data Extension.

1. Launch your browser and navigate to <https://localhost:5000>
1. You've already completed Step #1 and Step #2.
1. In Step #3, click ```Execute Request``` to get an OAuth token.
1. In Step #4, click ```Execute Request``` to load the sample data.
1. Go back to Marketing Cloud and navigate to the ```DF18Demo``` Data Extension.
1. Click ```Records``` to see 2 new records added by the web app.

### Demo #2: Marketing Cloud App

In this demo, the web app running locally on ```https://localhost:5000``` is displayed within Marketing Cloud web UI (in an IFRAME) and is launched via the Marketing Cloud app menu to load sample data into the ```DF18Demo``` Data Extension.

1. Login into Marketing Cloud
1. Click on your Marketing Cloud App under ```AppExchange``` in the top navigation bar.
1. Note that the same web app is now running within the Marketing Cloud UI (in an IFRAME).
1. You've already completed Step #1 and Step #2
1. In Step #3, click ```Execute Request``` to get a Refresh token.
1. In Step #4, click ```Execute Request``` to get an OAuth token from the Refresh token.
1. In Step #5, click ```Execute Request``` to load the sample data.
1. Navigate to the ```DF18Demo``` Data Extension.
1. Click ```Records``` to see 2 new records added by the web app.

## Run in Heroku

If you wish, you can also run this web app in Heroku, AWS, Azure, GCP, etc.

Here are detailed instructions on running Node.js web apps in Heroku: https://devcenter.heroku.com/articles/deploying-nodejs

> *TIP:* Remember to set the following environment variables for the Herkou app:

- ```RUNNING_IN_HEROKU=true```
- ```DF18DEMO_CLIENTID=YOUR_CLIENTID```
- ```DF18DEMO_CLIENTSECRET=YOUR_CLIENTSECRET```
- ```DF18DEMO_JWTSECRET=YOUR_JWT_SIGNING_SECRET```


# Looking for more info?

Check out these resources to help you get going:

- Marketing Cloud Developer Center: https://developer.salesforce.com/devcenter/marketing-cloud
- Create an Installed Package: https://sforce.co/InstalledPackage
- Marketing Cloud APIs: https://sforce.co/CloudAPI
- Marketing Cloud SDKs: https://sforce.co/SDK
- Content Block SDK: https://github.com/salesforce-marketingcloud/blocksdk
- Content Builder SDK: https://sforce.co/ContentBuilder
- MobilePush and Journey Builder SDKs: https://sforce.co/MobilePushSDK 
