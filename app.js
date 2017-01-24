var express = require('express');
var app = express();
var path = require('path');

var port = process.env.PORT || 3000;
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var mnths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var unixReg = new RegExp('^\\d+$');
var yearReg = new RegExp('\\D\\d{4}\\D');
var dayReg = new RegExp ('\\D\\d{1,2}\\D');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

var returnNull = function (res) {
  res.json({'unix': 'null', 'natural': 'null'});
}

var convertDate = function (input) {
  if (unixReg.test(input) ) {
    var date = new Date (input*1000);
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    return months[month] + ' ' + day + ', ' + year;
  }
  else {
    var date = new Date (input);
    return date.getTime()/1000;
  }
}

app.get('/:path', function(req, res) {
  var inputString = req.params.path;

  if (unixReg.test(inputString) ) {
    if (inputString.length >13) {
      returnNull(res);
    }
    var unixString = parseInt(inputString);
    res.json({'unix': unixString, 'natural': convertDate(unixString)});
  }

  else {
    var naturalString = 'x' + inputString + 'x';
    var natural = false;
    var mnth = "";
    for (var i=0; i<mnths.length; i++) {
      if (naturalString.includes(mnths[i])) {
        natural = true;
        mnth = months[i];
      }
    }
    if (natural) {
      if (yearReg.test(naturalString)) {
        var yr = naturalString.match('\\d{4}')[0];
        console.log("YEAR: " + yr);
        //res.send('There is a four digit year!');
        if (dayReg.test(naturalString)) {
          var dy1 = naturalString.match(dayReg)[0]
          var dy = dy1.slice(1,dy1.length-1);
          console.log("DAY : " + dy);
          var naturalDate = mnth + ' ' + dy + ', ' + yr;
          res.json({'unix': convertDate(naturalDate), 'natural': naturalDate});

        }
        else {
          dy = 1;
          var naturalDate = mnth + ' ' + dy + ', ' + yr;
          res.json({'unix': convertDate(naturalDate), 'natural': naturalDate});

        }

        res.JSON
      }
      else {
        returnNull(res);
      }
    }
    else {
      returnNull(res);
    }

    // CHECK IF YEAR PRESENT

    // CHECK IF DAY IS PRESENT


  }

  });



app.listen(port);
