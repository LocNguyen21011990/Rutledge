var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var rest = require("./restfulapi.js");
var config = require('./config'); // get our config file
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var app  = express();
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || config.api_port;
var ipadr = process.env.OPENSHIFT_NODEJS_IP || config.localhost;
var stage = process.env.NODE_ENV || "development";

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool(config["db_conn"][stage]);
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });


    
    // var poolCluster = mysql.createPoolCluster();
    // var masterConfig = {  host     : '172.16.0.69',
    //                       user     : 'root',
    //                       password : 'root',
    //                       database : 'xuan-test'};

    // var slave1Config = {  host     : '172.16.0.68',
    //                       user     : 'dev',
    //                       password : 'dev123',
    //                       database : 'xuan-test-rut'};

    // poolCluster.add('MASTER', masterConfig);
    // poolCluster.add('SLAVE1', slave1Config);
    // poolCluster.getConnection(function (err, connection) {

    //   if(err){
    //     console.log(err);

    //   }else{
    //     self.configureExpress(connection);
    //   }
    // });

}

REST.prototype.configureExpress = function(connection) {
      var self = this;
      app.use(bodyParser.urlencoded({limit:'50mb', extended: true }));
      app.use(bodyParser.json({limit:'50mb'}));

      //cross domain.
      app.use(function(req, res, next) {
         res.header("Access-Control-Allow-Origin", "*");
         res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
         res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control,x-access-token");
         if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        } else {
          return next();
        }
      });

      var router = express.Router();

      router.use(function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.param.token || req.headers['x-access-token'] || req.query.token;

 
        if(req.url == '/login/' || req.method == 'GET'){
          next();
          return;
        }

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config.secret, function(err, decoded) {   
             
              if (err) {
                 return res.status(403).send({ 
                    success: false, 
                    message: 'Failed to authenticate token or token expried.'
                  }); 
              } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;  
                next();
              }
            });
        } else {


          // if there is no token
          // return an error
          return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
          });
        }
      });

      app.use('/api', router);
      var rest_router = new rest(router,connection,md5,jwt);

      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(port,function(){
          console.log("All right ! I am alive at Port '"+port+"'.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    process.exit(1);
}

exports.closeServer =function(connection){
  var self = this;
  startServer.close();
}

new REST();
