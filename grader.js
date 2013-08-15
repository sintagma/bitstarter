#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/


// Load required packages
var fs = require('fs'); // To read content from files
var program = require('commander'); // to create and define options to call with this program from command line
var cheerio = require('cheerio'); // to scrape HTML (it uses JQuery) 
var restler = require('restler'); // to grab pages via HTTP

// Set default values (for both the file to check and the JSON list of tags to check) in case they are not provided from the comand line
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
  
// This function asserts if needed file exists
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

//This function loads the HTML file into cheerio for parsing
var cheerioHtmlFile = function(htmlfile) { // Receives the html file from checkHtmlFile
    return cheerio.load(fs.readFileSync(htmlfile)); // Uses fs to read into HTML file, and load DOM tree into cheerio with load() method
};

// This function extracts the HTML tags to be checked from the JSON array
var loadChecks = function(checksfile) { // Receives JSON checklist from var checkHtmlFile
    return JSON.parse(fs.readFileSync(checksfile)); // Uses fs to read into file, and then JSON method parse to build a browsable tag list
};

// This function combines the preceding and does the actual job
var checkHtmlFile = function(htmlfile, checksfile) { // Receives HTML and array of tags to check
    $ = cheerioHtmlFile(htmlfile); // Calls previous function to load HTML into cheerio
    var checks = loadChecks(checksfile).sort(); // Calls previous function to load and sort HTML tags to check
    console.log("This is the content of cheerioHtmlFile var: "+ $); // Added by me to see the output
    console.log("This is the content of checks var: " + checks); // Added by me to see the output
    var out = {}; // var to be filled with results of check
    for(var ii in checks) { // Loop through the JSON list of tags to check
        var present = $(checks[ii]).length > 0; // Need to see how this works 
        out[checks[ii]] = present; // Need to see how this works
        console.log("This is the content of var present: " + present); // Added by me to see the output
        console.log("This is the content of var out: " + out); // Added by me to see the output
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

// START HERE
if(require.main == module) { //If this is called directly from the command line and not as a module...
    program // ...Read the following options from the command line
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT) // call and get a copy of assertFileExists results
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT) // call and get a copy of assetsFileExists results
        .option('-u, --url <url_address>', 'Path to URL', clone(assertFileExists), HTMLFILE_DEFAULT) 
        .parse(process.argv); // Process all arguments provided through the command line
    var checkJson = checkHtmlFile(program.file, program.checks); // Call checkHtmlFile, feed it with both the location of file to check and JSON checklist and save results in checkJson
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
