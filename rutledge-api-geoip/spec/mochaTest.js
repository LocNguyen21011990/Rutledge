if (typeof(exports) !== "undefined") {
    var request = require('supertest');
    var server = require('../server.js');

    request = request('http://localhost:9002');
}

var listGet = ['/api/getAllCitys', '/api/getAllDrill', '/api/getDrillById/18857f90-1730-11e6-93a1-b98b50'];
var listPost = [{ "url": '/api/checkUserNameExist', "obj": { "username": 'full1' } }, { "url": '/api/createTokenInfo', "obj": { "regId": 'xuanlvtestthoi' } }];
var listPut = [{ "url": '/api/updateStatusUser', "obj": { "userID": '3ccae269-1bfd-11e6-ad52-ecb1d7f32a10', "status": 1 } }];

describe('Test Route with Token', function() {
    var token = '';
    var objUser = { "name": 'full', "password": 'e10adc3949ba59abbe56e057f20f883e' };

    //get token for authentication.
    before(function(done) {
        request.put('/api/login/').send(objUser)
            .end(function(err, res) {
                token = res.body.token;
                done();
            });
    });


    listGet.forEach(function(index) {
        it(index, function(done) {
            request.get(index)
                .set('x-access-token', token)
                .expect(function(res) {})
                .end(function(err, res) {
                    if (res.body.Error) return done(res.body.Message);
                    if (res.statusCode != 200) return done('Not found!');
                    return done();
                });
        });

    });



    listPost.forEach(function(item) {
        it(item.url, function(done) {
            var obj = item.obj;
            request.post(item.url).send(obj)
                .set('x-access-token', token)
                .expect(function(res) {})
                .end(function(err, res) {
                    if (res.body.Error) return done(res.body.Message);
                    if (res.statusCode != 200) return done('Not found!');
                    return done();
                })
        });
    });


    listPut.forEach(function(item) {
        it(item.url, function(done) {
            var obj = item.obj;
            request.put(item.url).send(obj)
                .set('x-access-token', token)
                .expect(function(res) {})
                .end(function(err, res) {
                    if (res.body.Error) return done(res.body.Message);
                    if (res.statusCode != 200) return done('Not found!');
                    return done();
                })
        });
    });


});
