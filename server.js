'use strict';

var path = process.cwd();

var express = require('express');
var router=require("./app/routes/index");
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session')
var mongoose=require("mongoose");
var cookieParser = require('cookie-parser');

var app = express();

require('dotenv').load();

require("./app/config/passport")(passport); //passport configuration
mongoose.connect(process.env.MONGO_URI);//connect mongodb

//middlewares
app.use('/client', express.static(process.cwd() + '/client'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({
  secret: 'secretVotingApp',
	resave: false,
	saveUninitialized: true 
  
}));
app.use(passport.initialize());//must exec after express-session middleware
app.use(passport.session());

router(app,passport);

var port=process.env.PORT || 8080;
app.listen(port,function(){
  console.log('Node.js listening on port ' + port + '...');
});