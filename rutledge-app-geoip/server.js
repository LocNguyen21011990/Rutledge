var express = require("express");
var bodyParser = require("body-parser");
var md5 = require('MD5');
var client = require("./client.js");
var config = require('./config'); // get our config file
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var expressLayouts = require('express-ejs-layouts');
var app = express();
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || config.port;
var ipadr = process.env.OPENSHIFT_NODEJS_IP || config.localhost;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mqtt = require('mqtt');
var multipart = require('connect-multiparty');


function REST() {
    var self = this;
    self.configureExpress();
};

function dataEmitHTML() {
    var server = mqtt.connect(config.brokerPort, {
        username: config.username,
        password: config.password
    });
    server.on('connect', function() {
        server.subscribe('inout');
        server.on('message', function(topic, message) {
            if ('inout' === topic) {
                io.emit('data', message);
            }
        });
    });
}



REST.prototype.configureExpress = function() {
    var self = this;
    app.use(bodyParser.urlencoded({limit:'50mb', extended: true }));
    app.use(bodyParser.json({limit:'50mb'}));
    app.use(multipart({
        uploadDir: './uploads'
    }));
    app.use(express.static(__dirname));
    app.use(express.static(__dirname + '/assets'));


    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
        if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
        } else {
            return next();
        }
    });

    app.set('view engine', 'ejs');
    app.set('layout', 'layouts/layout'); // defaults to 'layout'
    app.use(expressLayouts);

    var client_router = express.Router();
    app.use("/", client_router);
    var client_router_test = new client(client_router, md5);


    self.startServer();
}

REST.prototype.startServer = function() {
    http.listen(port, function() {
        console.log("All right ! I am alive at Port '" + port + "'.");
    });
    dataEmitHTML();
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    process.exit(1);
}

new REST();
