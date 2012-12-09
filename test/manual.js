var ide = require( 'crosstalk-ide' )();
var config = require( '../config.json' );

var worker = ide.run( __dirname + "/../index.js", { name : "worker", config : config } );
var callback = function (error, response) {
  console.log(error, response);
}

var data = { 
  to: "gospelbass@gmail.com",
  from: "jwilliams@fahrenheitmarketing.com",
  subject: "test message",
  text: "this is a test message"
}

worker.send("sendgrid.smtp.send", {}, null, callback);

worker.shouldCallErrorCallback( "sendgrid.smtp.send" );

worker.send("sendgrid.smtp.send", data, null, callback);

worker.shouldCallCallback( "sendgrid.smtp.send" );
