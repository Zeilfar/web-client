"use strict";

var http = require("http");

function simpleClone(obj) {
	var res = {};
	Object.getOwnPropertyNames(obj).forEach(function (p) {
		res[p] = obj[p];
	});
	return res;
}
function simpleMerge(origin, override) {
	var res = simpleClone(origin);
	if (!override) {
		return res;
	}
	Object.getOwnPropertyNames(override).forEach(function (p) {
		res[p] = override[p];
	});
	return res;
}


function createClient(hostname, port) {
	var globalHeaders = {};

	function request(path, method, datas, requestHeaders, callback) {
		var response = null;
		var error = null;
		var headers = simpleMerge(globalHeaders, requestHeaders);
		var options = {
			hostname : hostname,
			port : port,
			method : method,
			path : path,
			headers : headers
		};
		var req = http.request(options, function (res) {
			res.setEncoding('utf8');
			res.on("data", function (chunk) {
				if (!response) {
					response = '';
				}
				response += chunk;
			});
			res.on("end", function () {
				res.fullResponse = response;
				callback(res, req);
			});
		});
		req.on("error", function (error) {
			req.error = error;
			callback(req, null);
		});
		if (datas) {
			req.write(datas);
		}
		req.end();
	}


	var simpleClient = {
		reset : function () {
			Object.getOwnPropertyNames(globalHeaders).forEach(function (e) {
				delete globalHeaders[e];
			});
			globalHeaders['User-Agent'] = 'simpleClient';
			return this;
		},
		setHeader : function (headerName, value) {
			globalHeaders[headerName] = value;
			return this;
		},
		removeHeader : function (headerName) {
			delete globalHeaders[headerName];
			return this;
		},
		get : function (path, requestHeaders, callback) {
			return request(path, 'GET', null, requestHeaders, callback);
		},
		post : function (path, datas, requestHeaders, callback) {
			return request(path, 'POST', datas, requestHeaders, callback);
		},
		put : function (path, datas, requestHeaders, callback) {
			return request(path, 'PUT', datas, requestHeaders, callback);
		},
		delete : function (path, datas, requestHeaders, callback) {
			return request(path, 'DELETE', datas, requestHeaders, callback);
		},
		options : function (path, requestHeaders, callback) {
			return request(path, 'OPTIONS', requestHeaders, callback);
		}
	};

	return simpleClient.reset();
}

exports.createClient = createClient;
