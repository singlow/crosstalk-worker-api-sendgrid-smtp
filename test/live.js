var ide = require( 'crosstalk-ide' )();

crosstalkToken = process.env.CROSSTALK_TOKEN;

var callback = function (error, response) {
  console.log(error, response);
}

var data = { 
  to: "gospelbass@gmail.com",
  from: "jwilliams@fahrenheitmarketing.com",
  subject: "test message",
  text: "this is a test message"
}

ide.send(crosstalkToken, "sendgrid.smtp.send", {}, null, callback);

ide.send(crosstalkToken, "sendgrid.smtp.send", data, null, callback);

