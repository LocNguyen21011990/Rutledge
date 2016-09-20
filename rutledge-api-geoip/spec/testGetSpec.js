var request = require('request');
var md5 = require('MD5');
var async = require('async');
var host = 'http://localhost:9002/';
var listGET = ['api/getPages', 'api/getCityWithStaffNumber', 'api/getAllUser', 'api/getAllZones'];

describe("Test api at " + host, function() {

    describe("GET /", function() {

        it("Return Hello api.", function(done) {
            request.get(host + 'api', function(error, response, body) {
                expect(body).toBe('Hello api.');
                done();
            });
        });

        it("Returns status code 200 or Error false", function() {
            for (var i = 0; i < listGET.length; i++) {
                request.get(host + listGET[i], function(error, response, body) {
                    expect(response.statusCode).toBe(200);
                });
            }
        });

        // for (i = 0; i < listGET.length; i++) {
        //     var current = listGET[i];
        //     it("should add for " + current, (function(current) {
        //         request.get(host + current, function(error, response, body) {
        //             expect(response.body.Error).toBe(false);
        //         });
        //     })(current));
        // }

        it("Test login with username and password", function(done) {
            var testCase = {
                username: 'full',
                password: 'e10adc3949ba59abbe56e057f20f883e'
            }

            request({
                url: host + 'api/login',
                method: 'POST',
                json: testCase
            }, function(error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    expect(response.body.Error).toBe(false);
                    done();
                }
            });
        });

        it("Test  create a user", function(done) {
            var testCase = {
                username: 'sonnguyen',
                password: md5(123456)
            }
            done();
        });
    });
});
