var mysql = require('mysql');

exports.room = function(connection, done) {
    var query = "SELECT * FROM ?? "
    var table = ['room'];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.countPeopleInRoom = function(connection, done) {
    var query = "SELECT roomID, COUNT('peopleInRoomID') as people FROM ??  GROUP By roomID;";
    var table = ['peopleinroom'];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.currentH2S = function(roomID, connection, done) {
    var query = "SELECT h2s FROM ?? WHERE ??=? ORDER BY createDate DESC LIMIT 0,1";
    var table = ['h2sdetect', 'roomID', roomID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.roomInfos = function(connection, done) {
    var query = "SELECT room.roomID,room.roomName, h2stemp.h2s,h2stemp.createDate,ifnull(ptemp.npeople,0) as npeople FROM ?? LEFT JOIN ( SELECT s1.h2s,s1.createDate,s1.roomID FROM ?? as s1 LEFT JOIN ?? AS s2 ON s1.roomID = s2.roomID AND s1.createDate < s2.createDate WHERE s2.roomID IS NULL ) as h2stemp ON room.roomID = h2stemp.roomID left join (select count(*) as npeople,roomID from ?? as p group by roomID) as ptemp on room.roomID = ptemp.roomID";
    var table = ['room', 'h2sdetect', 'h2sdetect', 'peopleinroom'];
    query = mysql.format(query, table);
    connection.query(query, done);
};


exports.roomDetail= function(roomID,connection,done){
    var query = "SELECT * FROM ?? where peopleinroom.roomID=?";
    var table = ['peopleinroom',roomID];
    query = mysql.format(query,table);
    connection.query(query,done);
};

exports.h2s=function(roomID,connection,done){
    var query = "SELECT * FROM ?? WHERE ?? =?";
    var table = ['h2sdetect','roomID',roomID];
    query = mysql.format(query,table);
    connection.query(query,done);
}