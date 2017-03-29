// auth.json file with secrets
// Recommend saving variables in environment
var auth = require('./auth.json');

// Google Doc ID from project.json file
// If you already have one just add doc_id variable to it and change the path to your project.json file
var docsID = require('./project.json').doc_id;

var async = require("async");
var archieml = require('archieml');
var htmlparser = require('htmlparser2');
var Entities = require('html-entities').AllHtmlEntities;
var url = require('url');
var google = require('googleapis');


module.exports = function(grunt) {

  grunt.registerTask('archieml', 'Parses Google Doc and downloads as JSON', function() {

    if(!auth.client_id || !auth.client_secret) {
      throw new Error('Missing client_id or client_secret');
    };
    var OAuth2 = google.auth.OAuth2;
    var redirectUrls = [''];
    if(auth.redirect_urls && auth.redirect_urls[0]) {
      redirectUrls = auth.redirect_urls[0];
    }
    oauth2Client = new OAuth2(auth.client_id, auth.client_secret, redirectUrls);
    gDrive = google.drive({ version: 'v3', auth: oauth2Client });
    oauth2Client.setCredentials(auth.oAuthTokens);

    var done = this.async();
  
    gDrive.files.export({ fileId:docsID, mimeType: 'text/html'}, function (err, docHtml) {

      var handler = new htmlparser.DomHandler(function (error, dom) {
        var tagHandlers = {
          _base: function (tag) {
            var str = '';
            tag.children.forEach(function (child) {
              if (func = tagHandlers[child.name || child.type]) str += func(child);
            });
            return str;
          },
          text: function (textTag) {
            return textTag.data;
          },
          span: function (spanTag) {
            return tagHandlers._base(spanTag);
          },
          p: function (pTag) {
            return tagHandlers._base(pTag) + '\n';
          },
          a: function (aTag) {
            var href = aTag.attribs.href;
            if (href === undefined) return '';

            // extract real URLs from Google's tracking
            // from: http://www.google.com/url?q=http%3A%2F%2Fwww.sfchronicle.com...
            // to: http://www.sfchronicle.com...
            if (aTag.attribs.href && url.parse(aTag.attribs.href, true).query && url.parse(aTag.attribs.href, true).query.q) {
              href = url.parse(aTag.attribs.href, true).query.q;
            }

            var str = '<a href="' + href + '">';
            str += tagHandlers._base(aTag);
            str += '</a>';
            return str;
          },
          li: function (tag) {
            return '* ' + tagHandlers._base(tag) + '\n';
          }
        };

        ['ul', 'ol'].forEach(function (tag) {
            tagHandlers[tag] = tagHandlers.span;
        });
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function (tag) {
            tagHandlers[tag] = tagHandlers.p;
        });

        var body = dom[0].children[1];
        var parsedText = tagHandlers._base(body);

        // Convert html entities into the characters as they exist in the google doc
        var entities = new Entities();
        parsedText = entities.decode(parsedText);

        // Remove smart quotes from inside tags
        parsedText = parsedText.replace(/<[^<>]*>/g, function (match) {
          return match.replace(/”|“/g, '"').replace(/‘|’/g, "'");
        });

        var parsed = archieml.load(parsedText);
        grunt.file.write('json/text.json',JSON.stringify(parsed, null, 2));
      });

      var parser = new htmlparser.Parser(handler);
      parser.write(docHtml);
      parser.done();
      grunt.log.ok();
      
    });
  });
};