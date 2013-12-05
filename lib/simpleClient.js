var http = require("http");

function createClient(hostname, port){
  	function request(path, method, datas, headers, callback){
		var response = null;
		var error = null;
		var options = {
			hostname: hostname,
			port:port,
			method: method,
			path:path,
			headers : headers
		};
		var req = http.request(options, function(res){
			res.setEncoding('utf8');
			res.on("data",function(chunk){
				if(!response){
					response='';
				}
				response+=chunk;
			});
			res.on("end",function(){
				res.fullResponse = response;
				callback(res,req);
			});
		});
		req.on("error", function(error){
			req.error=error;
			callback(req,null);
		})
		.on("close", function(){
			
		});
		if(datas){
			req.write(datas);
		}
		req.end();	
	}

	var globalHeaders = {};
  	function simpleClone(obj){
  		var res = {};
  		Object.getOwnPropertyNames(obj).forEach(function(p){
  			res[p] = obj[p];
  		});
  		return res;
  	}
  	function simpleMerge(origin, override){
  		var res = simpleClone(origin);
  		if(!override){
  			return res;
  		}
  		Object.getOwnPropertyNames(override).forEach(function(p){
  			res[p] = override[p];
  		});
  		return res;
  	}

	var simpleClient = {
		reset : function(){
			Object.getOwnPropertyNames(globalHeaders).forEach(function(e){
				delete globalHeaders[e];
			});
			globalHeaders['User-Agent'] = 'simpleClient';
			return simpleClient;
		},
		setHeader:function(headerName, value){
			globalHeaders[headerName] = value;
			return simpleClient;
		},
		removeHeader: function(headerName){
			delete globalHeaders[headerName];
			return simpleClient;
		},
		get: function(path, requestHeaders, callback){
			return request(path,'GET',null, simpleMerge(globalHeaders, requestHeaders), callback);
		},
		post: function(path, datas, requestHeaders, callback){
			return request(path,'POST',datas, simpleMerge(globalHeaders, requestHeaders), callback);
		},
		put: function(path, datas, requestHeaders, callback){
			return request(path,'PUT',datas, simpleMerge(globalHeaders, requestHeaders), callback);
		},
		delete: function(path, datas, requestHeaders, callback){
			return request(path,'DELETE',datas, simpleMerge(globalHeaders, requestHeaders), callback);
		},
		options: function(path, datas, requestHeaders, callback){
			return request(path,'OPTIONS',datas, simpleMerge(globalHeaders, requestHeaders), callback);
		}

	};

	return simpleClient.reset();
}


module.exports.createClient=createClient;
