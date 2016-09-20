//mqtt protocol
var mqtt = require('mqtt');
var mysql   = require("mysql");
var config = require('./config'); // get our config file
var moment = require('moment');

var async = require('async');
var uuid = require('node-uuid');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || config.socket_port;
var ipadr = process.env.OPENSHIFT_NODEJS_IP || config.localhost;

var io = require('socket.io')(port);
var gcm = require('node-gcm');



var stage = process.env.NODE_ENV || "development";

var locationPersistent = require('./persistent/locationPersistent');
var checkrulePersistent = require('./persistent/checkrulePersistent');
var pushnotificationPersistent = require('./persistent/pushnotificationPersistent');
var server = mqtt.connect(config.brokerPort, {
             username : config.username
            ,password : config.password
            });

server.on('connect', function() {
	server.subscribe('logstash');
});
	
var pool = mysql.createPool(config["db_conn"][stage]);
pool.getConnection(function(err, connection){
   
    if(!err) {
     	console.log('Starting MQTT...At Port '+port );
      	configMQTT(connection);

    }

});

function configMQTT(connection) {
server.on('message', function(topic, message) {
    if('logstash' === topic){

    	
    	var oData = JSON.parse(message);
    	var roomid = oData.roomId;
        var zoneid = oData.zoneId;
        var drillid = oData.drillId;
        var cityid = oData.drillId;
    	var eventid = oData.eventId;
    	var timeCheckIn = oData.dateCheckin;
    	var timeCheckOut = oData.dateCheckout;
        var userName = oData.userName;
        var roomName = oData.roomName;
    	var userid = oData.userId;
    	var description = 'Test';
    	var datecreated = new Date();
    	var datemodified = datecreated;
    	var dateevented = timeCheckIn;


    	var tci = moment(timeCheckIn).format('hh:mm');
    	var tco = moment(timeCheckIn).format('hh:mm');

    	var status = 1;
    	if(timeCheckOut.length){
    		status = 0;
    		dateevented = timeCheckOut;
    	}

    	var sdid = uuid.v1();


    	if(status == 1){
            //Need to save data to staffdetect table .
            checkrulePersistent.addStaffDetect(sdid,userid,description,status,dateevented,datecreated,datemodified,roomid,eventid,connection,function(err,data){

            });

    		var sirid = uuid.v1();
	    	checkrulePersistent.addStaffInRoom(sirid,roomid,zoneid,drillid,cityid,userid,status,dateevented,datecreated,datemodified,connection,function(err,sirdata){

	    	});
    	}
    	else{
            //update data to staffdetect table
             checkrulePersistent.updateStaffDetect(userid,dateevented,datemodified,roomid,connection,function(err,data){

            });

            //update data to staffinroom table
			checkrulePersistent.updateStaffInRoom(roomid,userid,status,dateevented,datemodified,connection,function(err,sirdata){

			});
    	}

        //publist number in room to activemq with topic inout.

        async.waterfall([
        getNumberStaff,
        publistToActiveMQ,
        ], function (err, result) {
            // console.log(result);
        });

        function getNumberStaff(callback){
             checkrulePersistent.getNumberInRoom(roomid,connection,function(err,data){
                callback(null,data);
            });
        }

        function publistToActiveMQ (arg1,callback){
            if (arg1.length){            
                server.publish('inout', JSON.stringify(arg1[0]));
            }
            callback(null,'true');
        }
       
        

    	//begin asyn
    	async.waterfall([
	    getRules,
	    checkRules,
		], function (err, result) {
		    // console.log(result);
		});



		function getRules(callback) {
		    checkrulePersistent.rules(roomid,eventid,connection, function(err,rules){
		    	callback(null, rules);
		    });  
		}

		function checkRules(arg1, callback) {
			if(arg1.length > 0){
        		var item = arg1[0];
				var tablename = item.tablename;
    			var ttpid = item.templateid;
    			var title = item.title;
                var ruleid = item.id;
                var message = item.message;
				if(tablename ==='timeaccess'){
					checkrulePersistent.getDetailRule(tablename,ttpid,connection, function(err,data){
						if(tci < data[0].timebegin || tco > data[0].timeend ){
							//not alow so need to notification and save to db
							console.log(title+"------------"+ data[0].timebegin);
							var id = uuid.v1();
							// var message = '['+ userName +']'+ ' violate rule ' +title + ' on ' + datecreated;
							checkrulePersistent.addNotification(id,message,ruleid,userid,roomid,datecreated,datemodified,connection,function(err,ndata){
							});

                            //imit data by socket io
                            var messageimit = '['+ userName +'] '+ message + ' on ' +roomName +' at '+datecreated;
                            io.emit('news', { message: messageimit });
                            gcmSender(connection,messageimit);
                           

						}
						else{
			              arg1.splice(0, 1);
			              checkRules(arg1,callback);
			            }
					});
				}
		     }
		     else{
		        callback(null, arg1);
		     }
		}
    	//end asyn
    }
});
//Push notification to the devices list wich was registered.
function gcmSender(connection,ms) {
        var sender = new gcm.Sender('AIzaSyB47huF6TTAomRewls_EezcBnXXEM2soG4');
        var message = new gcm.Message();
        var registrationIds = [];
            message.addData('message', ms);
            message.delay_while_idle = 1;
        // Get all active RegId
        pushnotificationPersistent.getTokenInfoList(connection,function(err,data){
        if (null != data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                // At least one token is required - each app will
                // register a different token
                registrationIds.push(data[i].RegId);
            }
            /**
            * Params: message-literal, registrationIds-array, No. of
            * retries, callback-function
            */
            sender.send(message, registrationIds, 4, function(err,
                result) {
            console.log(result);
            });

            /**
            * Without retries
            */
            // sender.sendNoRetry(message, registrationIds, function
            // (err, result) {
            // console.log(result);
            // });
        }
    });
}



}



	
