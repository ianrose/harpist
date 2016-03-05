var Tabletop = require('Tabletop');
var fs = require('fs');
var stringify = require('json-stringify-safe');

var sheetURL = 'https://docs.google.com/spreadsheets/d/1L0Lm--eCXChTwhgkpfm40fQkrUTr9uPXyZlBmpfljOA/pubhtml';
var outputFilename = './public/_data.json';
var outputData = {
  "humans": {
    "layout": false
  }
};

var options = {
  key: sheetURL,
  callback: onLoad,
  parseNumbers: true,
  wanted: [ "header", "body", "mainArt" ]
};

Tabletop.init(options);

function onLoad(data, tabletop) {
  console.log(data);
  outputData['results'] = data;
  var parsedData = stringify(outputData);

  fs.writeFile(outputFilename, parsedData, function (err) {
    if (err) return console.log(err);
    console.log('JSON saved to ' + outputFilename);
  });
}
