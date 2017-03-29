# grunt-docs-archieml
Generate JSON file from Google Docs with [ArchieML](http://archieml.org/)

## Install
```
npm install grunt-docs-archieml --save
```

### Getting credentials
1. Got to https://console.developers.google.com
2. Create an account
3. Make sure you have the Google Drive API enabled
a. In the left sidebar click `Dashboard` and then click on `ENABLE API`
b. Click on `DRIVE API` and if it’s not enabled just click on `ENABLE`
4. In the right sidebar click `Credentials`
5. Then click `Create credentials`, select `oAuth client ID` and then select `Web Application`
6. Name your Web Application
7. Enter `https://developers.google.com/oauthplayground` as an authorized redirect URL
8. Copy and have your `Client ID` and `Client Secret` ready
9. Go to [https://developers.google.com/oauthplayground/](https://developers.google.com/oauthplayground/)
10. Under `Step 1` check all `Dirve API v3`
11. Click the Gear button in upper right of the page and check `Use your own OAuth credentials`
12. Enter your `Client ID` and `Client secret`
13. Go back to the `Step 1` section on the left and click `Authorize APIs`
14. Click on `Exchange authorization code for tokens` and copy the generated refresh token.
15. Rename `auth.sample.json` to `auth.json` and add your info:
```json
{
  "client_id": "your_CLIENT_ID",
  "client_secret": "your_CLIENT_SECRET",
  "oAuthTokens":{"refresh_token": "your_REFRESH_TOKEN"}
} 
```

### Setup
Grab Google Doc ID and paste into provided `project.json` file or your own. If you have your own, make sure to update the `docsID` variable in the `Gruntfile.js` with the correct path to your `project.json` file.
>With the Google Doc open, go to File > Publish to web, click on `PUBLISH` under the Link section and copy the ID from the URL. The ID is in between the ‘d’ and ‘pub’ part of the URL. See below for example. Below is a sample URL and the Google Doc ID starts wit the number one:
https://docs.google.com/document/d/1phiDD07FGcnApHk93xhLaWfbTRm9LhTmQHs8acsagj0/pub 

### Running
Run the following command and the JSON file will be in the the `json` directory called `text.json`
```
$ grunt archieml
```