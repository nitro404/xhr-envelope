(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
	typeof define === "function" && define.amd ? define(factory) :
	(global.envelope = factory());
} (this, function() {

	"use strict";

	if(typeof require !== "undefined") {
		if(typeof utilities === "undefined") {
			global.utilities = require("extra-utilities");
		}
	}

	var envelope = { };

	var validMethods = Object.freeze(["HEAD", "GET", "POST", "PUT", "PATCH", "DELETE"]);

	var defaultOptions = {
		baseUrl: null,
		authorization: null,
		timeout: 30000
	};

	envelope.hasBaseUrl = function() {
		return utilities.isNonEmptyString(defaultOptions.baseUrl);
	};

	envelope.getBaseUrl = function() {
		return defaultOptions.baseUrl;
	};

	envelope.setBaseUrl = function(url) {
		if(utilities.isEmptyString(url)) {
			return;
		}

		defaultOptions.baseUrl = url;
	};

	envelope.clearBaseUrl = function() {
		defaultOptions.baseUrl = null;
	};

	envelope.hasAuthorization = function() {
		return utilities.isNonEmptyString(defaultOptions.authorization);
	};

	envelope.getAuthorization = function() {
		return defaultOptions.authorization;
	};

	envelope.setAuthorizationToken = function(token) {
		if(utilities.isEmptyString(token)) { return; }

		defaultOptions.authorization = token;
	};

	envelope.setBasicAuthorization = function(userName, password) {
		if(utilities.isEmptyString(userName) || utilities.isEmptyString(password)) { return; }

		defaultOptions.authorization = "Basic " + btoa(userName + ":" + password);
	};

	envelope.clearAuthorization = function() {
		defaultOptions.authorization = null;
	};

	envelope.hasTimeout = function() {
		return utilities.isValid(defaultOptions.timeout);
	};

	envelope.getTimeout = function() {
		return defaultOptions.timeout;
	};

	envelope.setTimeout = function(timeout) {
		var formattedTimeout = utilities.parseInteger(timeout);

		if(utilities.isInvalidNumber(formattedTimeout) || formattedTimeout < 1) {
			return;
		}

		defaultOptions.timeout = formattedTimeout;
	};

	envelope.clearTimeout = function() {
		defaultOptions.timeout = null;
	};

	envelope.request = function(method, path, data, query, options, callback) {
		if(utilities.isFunction(data)) {
			callback = data;
			options = null;
			query = null;
			data = null;
		}
		else if(utilities.isFunction(query)) {
			callback = query;
			options = null;
			query = null;
		}
		else if(utilities.isFunction(options)) {
			callback = options;
			options = null;
		}

		if(!utilities.isFunction(callback)) {
			throw new Error("Missing or invalid callback function!");
		}

		if(utilities.isEmptyString(method)) {
			return callback(new Error("Missing or invalid method type."));
		}

		var formattedMethod = method.toUpperCase().trim();
		var isUpload = formattedMethod === "UPLOAD";

		if(isUpload) {
			formattedMethod = "POST";
		}

		var validMethod = false;

		for(var i = 0; i < validMethods.length; i++) {
			if(formattedMethod === validMethods[i]) {
				validMethod = true;
				break;
			}
		}

		if(!validMethod) {
			return callback(new Error("Invalid method type: \"" + formattedMethod + "\" - expected one of: " + validMethods.join(", ") + "."));
		}

		var hasBody = formattedMethod === "POST" ||
					  formattedMethod === "PUT" ||
					  formattedMethod === "PATCH";

		if(utilities.isValid(data) && !hasBody) {
			options = query;
			query = data;
			data = null;
		}

		var newOptions = utilities.isObject(options) ? utilities.clone(options) : { };
		newOptions.method = formattedMethod;

		if(newOptions.timeout !== null && !Number.isInteger(newOptions.timeout)) {
			newOptions.timeout = defaultOptions.timeout;
		}

		if(utilities.isInvalid(newOptions.timeout)) {
			delete newOptions.timeout;
		}

		if(utilities.isNonEmptyString(newOptions.baseUrl)) {
			newOptions.url = newOptions.baseUrl;
		}
		else {
			newOptions.url = (utilities.isNonEmptyString(defaultOptions.baseUrl) ? defaultOptions.baseUrl : "");
		}

		newOptions.url += utilities.prependSlash(path);
		newOptions.url += utilities.createQueryString(query, true);

		if(hasBody && utilities.isValid(data)) {
			newOptions.data = utilities.isObject(data) ? JSON.stringify(data) : data;
		}

		if(!utilities.isObject(newOptions.headers)) {
			newOptions.headers = { };
		}

		if(isUpload) {
			newOptions.headers["Content-Type"] = undefined;
		}
		else if(utilities.isEmptyString(newOptions.headers["Content-Type"])) {
			newOptions.headers["Content-Type"] = "application/json";
		}

		if(utilities.isEmptyString(newOptions.headers.Accepts)) {
			newOptions.headers.Accepts = "application/json";
		}

		if(utilities.isValid(newOptions.authorization)) {
			if(utilities.isNonEmptyString(newOptions.authorization)) {
				if(utilities.isNonEmptyString(newOptions.headers.Authorization)) {
					console.error("Authorization specified in header data is being overridden by authorization at root level of options.");
				}

				newOptions.headers.Authorization = newOptions.authorization;
			}

			delete newOptions.authorization;
		}

		if(utilities.isEmptyString(newOptions.headers.Authorization)) {
			if(utilities.isNonEmptyString(defaultOptions.authorization)) {
				newOptions.headers.Authorization = defaultOptions.authorization;
			}
		}

		var request = new XMLHttpRequest();

		request.open(newOptions.method, newOptions.url, true);

		if(utilities.isObjectStrict(newOptions.headers)) {
			var headerName = null;
			var headerNames = Object.keys(newOptions.headers);

			for(var i = 0; i < headerNames.length; i++) {
				headerName = headerNames[i];

				request.setRequestHeader(headerName, newOptions.headers[headerName]);
			}
		}

		request.setRequestHeader("Content-Type", "application/json");

		request.timeout = newOptions.timeout;

		request.addEventListener("load", function(event) {
			if(typeof request.responseText === "string" && request.responseText.length !== 0) {
				var responseJSON = null;

				try {
					responseJSON = JSON.parse(request.responseText);
				}
				catch(error) {
					error.message = "Invalid response data: " + error.message;
					error.status = request.status;

					return callback(error, null, request.status);
				}

				if(utilities.isObjectStrict(responseJSON) && utilities.isObjectStrict(responseJSON.error)) {
					var message = responseJSON.error.message;

					if(utilities.isEmptyString(message)) {
						message = "Unknown error.";
					}

					var error = new Error(message);

					var attributeName = null;
					var attributeNames = Object.getOwnPropertyNames(responseJSON.error);

					for(var i = 0; i < attributeNames.length; i++) {
						attributeName = attributeNames[i];

						error[attributeName] = responseJSON.error[attributeName];
					}

					error.status = request.status;

					return callback(error, null, request.status);
				}
				else {
					return callback(null, responseJSON, request.status);
				}
			}
			else {
				return callback(null, null, request.status);
			}
		});

		request.addEventListener("error", function(event) {
			return callback(utilities.createError("Connection failed!", 0), null, 0);
		});

		if(utilities.isObject(newOptions)) {
			request.send(newOptions.data);
		}
		else {
			request.send();
		}
	};

	envelope.head = function(path, data, query, options, callback) {
		return envelope.request("HEAD", path, data, query, options, callback);
	};

	envelope.get = function(path, data, query, options, callback) {
		return envelope.request("GET", path, data, query, options, callback);
	};

	envelope.post = function(path, data, query, options, callback) {
		return envelope.request("POST", path, data, query, options, callback);
	};

	envelope.put = function(path, data, query, options, callback) {
		return envelope.request("PUT", path, data, query, options, callback);
	};

	envelope.patch = function(path, data, query, options, callback) {
		return envelope.request("PATCH", path, data, query, options, callback);
	};

	envelope.delete = function(path, data, query, options, callback) {
		return envelope.request("DELETE", path, data, query, options, callback);
	};

	envelope.upload = function(path, data, query, options, file, callback) {
		var fileDescriptor = new FormData();

		if(utilities.isValid(file)) {
			fileDescriptor.append("file", file);
		}

		if(utilities.isObjectStrict(data)) {
			for(var attribute in data) {
				if(attribute === "file") {
					continue;
				}

				fileDescriptor.append(attribute, data[attribute]);
			}
		}

		return envelope.request("UPLOAD", path, fileDescriptor, query, options, callback);
	};

	return envelope;

}));

//# sourceMappingURL=envelope.js.map
