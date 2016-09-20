var mysql = require('mysql')

exports.detail = function(sensorID, connection, done) {
	var query = "SELECT sensorID,sensorMAC,sensorType,sensorIP,h2s,temp,heartbeat,userName,groupName,tenantName FROM sensor,`group`,user,tenant WHERE sensor.userID=user.userID and sensor.groupID=`group`.groupID and sensor.tenantID=tenant.tenantID and ??=?";
	var table = ["sensorID",sensorID];
	query = mysql.format(query,table);
	connection.query(query, done);
}

exports.topFive = function(sensorID, connection, done) {
	var query = "SELECT h2s,temp,heartbeat,createDate FROM ?? WHERE ??=? ORDER BY createDate LIMIT 5";
	var table = ["history","sensorID",sensorID];
	query = mysql.format(query,table);
	connection.query(query, done);
}