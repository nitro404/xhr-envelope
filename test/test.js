"use strict";

global.utilities = undefined;

const envelope = require("../src/envelope.js");
const utilities = require("extra-utilities");
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

describe("Envelope", function() {
	describe("getBaseUrl", function() {
		it("should be a function", function() {
			expect(envelope.getBaseUrl instanceof Function).to.equal(true);
		});
	});

	describe("setBaseUrl", function() {
		it("should be a function", function() {
			expect(envelope.setBaseUrl instanceof Function).to.equal(true);
		});
	});

	describe("clearBaseUrl", function() {
		it("should be a function", function() {
			expect(envelope.clearBaseUrl instanceof Function).to.equal(true);
		});
	});

	describe("getAuthorization", function() {
		it("should be a function", function() {
			expect(envelope.getAuthorization instanceof Function).to.equal(true);
		});
	});

	describe("hasAuthorization", function() {
		it("should be a function", function() {
			expect(envelope.hasAuthorization instanceof Function).to.equal(true);
		});
	});

	describe("setAuthorizationToken", function() {
		it("should be a function", function() {
			expect(envelope.setAuthorizationToken instanceof Function).to.equal(true);
		});
	});

	describe("setBasicAuthorization", function() {
		it("should be a function", function() {
			expect(envelope.setBasicAuthorization instanceof Function).to.equal(true);
		});
	});

	describe("clearAuthorization", function() {
		it("should be a function", function() {
			expect(envelope.clearAuthorization instanceof Function).to.equal(true);
		});
	});

	describe("hasTimeout", function() {
		it("should be a function", function() {
			expect(envelope.hasTimeout instanceof Function).to.equal(true);
		});
	});

	describe("getTimeout", function() {
		it("should be a function", function() {
			expect(envelope.getTimeout instanceof Function).to.equal(true);
		});
	});

	describe("setTimeout", function() {
		it("should be a function", function() {
			expect(envelope.setTimeout instanceof Function).to.equal(true);
		});
	});

	describe("request", function() {
		it("should be a function", function() {
			expect(envelope.request instanceof Function).to.equal(true);
		});
	});

	describe("head", function() {
		it("should be a function", function() {
			expect(envelope.head instanceof Function).to.equal(true);
		});
	});

	describe("get", function() {
		it("should be a function", function() {
			expect(envelope.get instanceof Function).to.equal(true);
		});
	});

	describe("post", function() {
		it("should be a function", function() {
			expect(envelope.post instanceof Function).to.equal(true);
		});
	});

	describe("put", function() {
		it("should be a function", function() {
			expect(envelope.put instanceof Function).to.equal(true);
		});
	});

	describe("patch", function() {
		it("should be a function", function() {
			expect(envelope.patch instanceof Function).to.equal(true);
		});
	});

	describe("delete", function() {
		it("should be a function", function() {
			expect(envelope.delete instanceof Function).to.equal(true);
		});
	});

	describe("upload", function() {
		it("should be a function", function() {
			expect(envelope.upload instanceof Function).to.equal(true);
		});
	});
});
