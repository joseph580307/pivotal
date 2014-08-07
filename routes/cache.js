/* jshint node:true */

/*
 * Cache related operation
 * Replace Websphere Extreme Scale with Redis
 */
// var WXS = require('../wxs');
// USE FOR CLOUDFOUNDRY DEPLOYMENT
// var env = JSON.parse(process.env.VCAP_SERVICES);
var env = process.env.VCAP_SERVICES;
console.log(env.toString()); // Will print `env`

//var wxsprops = getEnv(env);
//var wxsclient = new WXS(wxsprops);
var rediscloud_service = JSON.parse(env)["rediscloud"][0]
var credentials = rediscloud_service.credentials;

var redis = require('redis');
var redis_client = redis.createClient(credentials.port, credentials.hostname, {no_ready_check: true});
redis_client.auth(credentials.password);
 

exports.getCache = function(req, res) {
	var key = req.params.key;
	console.log("get key:" + key);
/*	redis_client.get(key, function(wxsres) {
		res.json({
			value : wxsres
		});
	});
	*/
	redis_client.get(key, function (err, reply) {
//	    console.log(reply.toString()); // Will print `bar`
	    res.json({
			value : reply
		});
	    
	});
};

exports.putCache = function(req, res) {
	var key = req.query.key;
	var value = req.query.value;
/*	redis_client.put(key, value, function() {
		res.json({
			value : "Put successfully."
		});
	});
	*/
	redis_client.set(key, value,function(){
		res.json({
			value : "Put successfully."
		});
	});
};

exports.removeCache = function(req, res) {
	var key = req.params.key;
/*	redis_client.remove(key, function() {
		res.json({
			value : "Remove successfully."
		});
		console.log('finished remove');
	}); */
	redis_client.remove(key);
};

/**
 * Need to ignore the version number of DataCache when getting the credentials.
 */
function getEnv(vcapEnv) {
   for (var serviceOfferingName in vcapEnv) {
   	    if (vcapEnv.hasOwnProperty(serviceOfferingName) &&
   	    		serviceOfferingName.indexOf("DataCache-") === 0) {
   	    	var serviceBindingData = vcapEnv[serviceOfferingName][0];
   	    	return serviceBindingData.credentials;
   	    }
   }
}