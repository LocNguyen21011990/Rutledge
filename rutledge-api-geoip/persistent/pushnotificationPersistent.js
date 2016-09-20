var mysql = require('mysql');

exports.createTokenInfo = function(regId, dateCreate, isActive, connection, done) {
    var query = "INSERT INTO devicelist (regId,dateCreate,isActive) VALUES(?,?,?)";
    var table = [regId, dateCreate, isActive];
    query = mysql.format(query, table);

    connection.query(query, done);
};

exports.getTokenInfoList = function(connection, done) {
    var query = "SELECT ?? FROM ??  WHERE ?? = ?";
    var table = ["RegId", "devicelist", "isActive", 1];
    query = mysql.format(query, table);

    connection.query(query, done);
};
