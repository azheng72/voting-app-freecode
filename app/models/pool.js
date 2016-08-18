

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Options = new Schema({
	
		name: String,
		vote: Number,
		
	
});

var Pool = new Schema({
	
		poolname: String,
		username: String,
		options:[Options]
	
});

module.exports = mongoose.model('Pool', Pool);
