var simpleClient = require("./simpleClient");

function createClient(hostname, port){
	var client = simpleClient.createClient(hostname, port);
	var jsonClient = {
		reset:function(){
			client.reset();
			client.setHeader("Content-Type","application/json");
			client.setHeader("User-Agent","jsonClient");
			return jsonClient;
		},
		setHeader : function(headerName, value){
			client.setHeader(headerName, value);
			return jsonClient;
		},
		get: function(path, requestHeaders, callback){
			return client.get(path, requestHeaders, function(res,req){
				if(res.fullResponse){
					res.jsonResponse = JSON.parse(res.fullResponse);
				}
				callback(req,res);
			});
		},
		post: function(path, datas, requestHeaders,callback){
			var str_datas = JSON.stringify(datas);
			return client.post(path,str_datas,requestHeaders, function(res,req){
				if(res.fullResponse)
					res.jsonResponse = JSON.parse(res.fullResponse);
				callback(req,res);
			});
		},
		put: function(path, datas, requestHeaders,callback){
			var str_datas = JSON.stringify(datas);
			return client.put(path,str_datas, requestHeaders,function(res,req){
				if(res.fullResponse)
					res.jsonResponse = JSON.parse(res.fullResponse);
				callback(req,res);
			});
		},
		delete: function(path, datas,requestHeaders, callback){
			var str_datas = JSON.stringify(datas);
			return client.delete(path, str_datas, requestHeaders,function(res,req){
				if(res.fullResponse)
					res.jsonResponse = JSON.parse(res.fullResponse);
				callback(req,res);
			});
		},
		options: function(path, datas,  requestHeaders,callback){
			var str_datas = JSON.stringify(datas);
			return client.options(path,str_datas, requestHeaders,function(res,req){
				if(res.fullResponse)
					res.jsonResponse = JSON.parse(res.fullResponse);
				callback(req,res);
			});
		}
	};
	return jsonClient.reset();
}

module.exports.createClient=createClient 