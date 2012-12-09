/*
 * index.js: Sendgrid SMTP API Worker
 *
 * (C) 2012 Jacob Williams.
 */
"use strict";

var async = require( 'async' ),
    https = require( 'https' ),
    querystring = require( 'querystring' ),
    _ = require( 'underscore' ),
    config = require ( 'config' );

var API_ENDPOINT = "sendgrid.com",
    HTTP_VERB = "POST",
    REQUEST_URI = "/api/mail.send.json";

var send = function send( params, callback ) {

  callback = callback || function() { };
  params = params || {};

  //
  // required params
  //
  if ( ! params.to ) return callback( { message : "missing recipient" } );
  if ( ! params.from ) return callback( { message : "missing sender" } );
  if ( ! params.subject ) return callback( { message : "missing subject" } );
  if ( ! params.text && ! params.html ) return callback( { message : "missing body" } );

  if ( params.toname && _.isArray(params.to)
      && ( ! _.isArray(params.toname) || params.toname.length !== params.to.length) ) {
    return callback( { message: "tonames length does not match to length" } );
  }

  var data = {
    api_user : config.api_user,
    api_key : config.api_key,
    to : params.to,
    from : params.from,
    subject : params.subject,
    text : params.text,
    html : params.html,
    bcc : params.bcc,
    replyTo : params.replyTo
  }

  var postData = querystring.stringify(data);

  var requestOptions = {
    host : API_ENDPOINT,
    method : HTTP_VERB,
    path : REQUEST_URI,
    headers : {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' : postData.length
    }
  }

  var req = https.request( requestOptions );

  req.on( 'response', function ( response ) {

    var body = "";

    response.setEncoding( 'utf8' );
    response.on( 'data', function ( chunk ) {
      body += chunk;
    });

    response.on( 'end', function () {
      var json = JSON.parse(body);
      if (json.message == "success") {
        return callback( null, json )
      } else {
        return callback( json.error );
      }
    });

  }); // req.on 'response'

  req.on( 'error', function ( error ) {
    return callback( error );
  });

  req.write(postData);

  req.end();

}; // makeRequest

crosstalk.on( 'sendgrid.smtp.send', send );
