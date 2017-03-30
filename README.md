# grunt-docs-archieml
Generate JSON file from Google Docs with [ArchieML](http://archieml.org/)

## Install
```
npm install grunt-docs-archieml --save
```

## Getting credentials
1. Go to [https://console.developers.google.com](https://console.developers.google.com)
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
10. Under `Step 1` check all `Drive API v3`
11. Click the Gear button in upper right of the page and check `Use your own OAuth credentials`
12. Enter your `Client ID` and `Client secret`
13. Go back to the `Step 1` section on the left and click `Authorize APIs`
14. Click on `Exchange authorization code for tokens` and copy the generated refresh token.
15. Create a file called `.credentials.json` and add the following with your info:
```json
{
  "client_id": "your_CLIENT_ID",
  "client_secret": "your_CLIENT_SECRET",
  "oAuthTokens":{"refresh_token": "your_REFRESH_TOKEN"}
} 
```

> The file can be saved anywhere. Recommended that you save it in your home folder so that your your secret credentials are not uploaded with your project.

## Setup
Grab the Google Doc ID of the ArchieML ready document
>With the Google Doc open, go to File > Publish to web, click on `PUBLISH` under the Link section and copy the ID from the URL. The ID is in between the ‘d’ and ‘pub’ section of the URL.

Enable the plugin inside your Gruntfile with this line of JavaScript:
```js
grunt.loadNpmTasks('grunt-docs-archieml');
```

Add the following within the `grunt.initConfig()` and modify the options as needed.

```js
grunt.initConfig({
  gdocs: {
    options: {
      credentials:'.credentials.json',
      docsID: 'GOOGLE_DOC_ID',
      dest: 'DIRECTORY_FOR_JSON_FILE' 
    }
  },
});
```
Default settings:

`credentials` defaults to your home folder and will look for a .credentials.json file

`docsID` has no default

`dest` defaults to a directory named json

### Running
```
$ grunt gdocs
```
Run the command to generate the JSON file. The file name will be the title of your Google Doc (all lowercase with underscores).
