"use strict";

var simpleClient = require("./simpleClient");

function parseResponse(callback) {
	return function (res, req) {
		if (res.fullResponse) {
			res.jsonResponse = JSON.parse(res.fullResponse);
		}
		callback(req, res);
	};
}

function stringify(obj) {
	if (!obj) {
		return null;
	}
	return JSON.stringify(obj);
}

function createClient(hostname, port) {
	var client = simpleClient.createClient(hostname, port);
	var jsonClient = {
		reset : function () {
			client.reset();
			client.setHeader("Content-Type", "application/json");
			client.setHeader("User-Agent", "jsonClient");
			return this;
		},
		setHeader : function (headerName, value) {
			client.setHeader(headerName, value);
			return this;
		},
		get : function (path, requestHeaders, callback) {
			return client.get(path, requestHeaders, parseResponse(callback));
		},
		post : function (path, datas, requestHeaders, callback) {
			return client.post(path, stringify(datas), requestHeaders, parseResponse(callback));
		},
		put : function (path, datas, requestHeaders, callback) {
			return client.put(path, stringify(datas), requestHeaders, parseResponse(callback));
		},
		delete : function (path, datas, requestHeaders, callback) {
			return client.delete(path, stringify(datas), requestHeaders, parseResponse(callback));
		},
		options : function (path, requestHeaders, callback) {
			return client.options(path, requestHeaders, parseResponse(callback));
		}
	};
	return jsonClient.reset();
}

exports.createClient = createClient;
