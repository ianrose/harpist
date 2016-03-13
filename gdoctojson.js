var myConfig  = require('./config_gdocs.json').google;
var GoogleDocToJSON = require('googledoc-to-json');
var gDocToJSON = new GoogleDocToJSON(myConfig);
var fs = require('fs');

var options = {
    fileId: '1Pcg44oV-mzcMxZXNGoeuB-RthWyhNBxxZzRLR88NaxQ',
    oAuthTokens: myConfig.oAuthTokens
};

var outputFilename = './public/_data.json';
var outputData = {
  "humans": {
    "layout": false
  }
};

gDocToJSON.getArchieML(options, function (err, aml) {
  if(err) {
    return console.error(err);
  }

  outputData['results'] = aml;
  var JSONParesd = JSON.stringify(outputData);
  fs.writeFile(outputFilename, JSONParesd, function (err) {
    if (err) return console.log(err);
    console.log('JSON saved to ' + outputFilename);
  });
});
