var SheetReader = require('googlesheets-reader');
var fs = require('fs');

var outputFilename = './public/_data.json';

SheetReader({
  key: '1INGc-QFBfCS0raSZgprennLRvJ8YWJHCV4YmuEkYoP4'
}, function(err, spreadsheet) {

  spreadsheet.worksheets[0].rows({
    limit: 5,
    excludeHeader: true
  }, function(err, sheet1rows) {

    var JSONParesd = JSON.stringify(sheet1rows);
    fs.writeFile(outputFilename, JSONParesd, function(err) {
      if (err) return console.log(err);
      console.log('JSON saved to ' + outputFilename);
    });
  });
});
