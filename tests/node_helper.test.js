const expect = require("chai").expect;
require("module-alias/register");
var Module = require("../node_helper.js");
var helper = new Module();
helper.setName("MMM-PrometheusAlerts");

describe("Functions in node_helper.js", function () {
	describe("checkFetchStatus", function () {
		it(`for a string should return an array`, function () {
			var testResponse = {
				ok: true,
				data: {
					name: "Test Response"
				}
			};

			expect(helper.checkFetchStatus(testResponse)).to.eql(testResponse);
		});
	});
});
