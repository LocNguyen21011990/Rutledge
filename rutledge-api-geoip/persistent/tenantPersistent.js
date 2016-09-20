var mysql = require('mysql')

exports.all = function(connection, done) {
	var query = "SELECT tenantID,tenantName FROM ??";
    var table = ["tenant"];
    query = mysql.format(query,table);
    connection.query(query, done);
}

exports.ownedSensors = function(tenantID, connection, done) {
	var query = "SELECT sensorID,sensorMAC,sensorType,sensorIP,h2s,temp,heartbeat FROM ?? WHERE ??=? ORDER BY lastUpdated DESC";
	var table = ["sensor", "tenantID", tenantID];
	query = mysql.format(query,table);
	connection.query(query, done);
}

exports.ownedGateways = function(tenantID, connection, done) {
	var query = "SELECT gatewayID,gatewayName,gatewayIP FROM ?? WHERE ??=?";
    var table = ["gateway","tenantID",tenantID];
    query = mysql.format(query,table);
    connection.query(query, done);
}