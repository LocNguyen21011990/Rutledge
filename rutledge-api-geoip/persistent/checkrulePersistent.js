var mysql = require('mysql')
exports.rules = function(roomid,eventid,connection, done) {
    var query = "select rulemaster.*,typetemplate.tablename from rulemaster " + 
    "inner join ruleevent on ruleevent.ruleid = rulemaster.id "+
    "inner join ruleroom on ruleroom.ruleid = rulemaster.id "+
    "inner join typetemplate on rulemaster.typetemplateid = typetemplate.id "+
    "and ruleevent.eventid = ? "+
    "and ruleroom.roomid= ? "+
    " order by rulemaster.priority";
    var table = [eventid,roomid];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getDetailRule = function(tablename,ruleid,connection,done){
	var query = "select * from ?? where id = ?";
	var table = [tablename,ruleid];
	query = mysql.format(query,table);
	connection.query(query,done);
}

exports.addStaffDetect = function(id,userid,description,status,datecheckin,datecreated,datemodified,roomid,eventid,connection,done){
	var query = "INSERT INTO staffdetect (id,userid,description,status,datecheckin,datecreated,datemodified,roomid,eventid) VALUES(?,?,?,?,?,?,?,?,?)";
    var table = [id,userid,description,status,datecheckin,datecreated,datemodified,roomid,eventid];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.updateStaffDetect = function(userid,datecheckout,datemodified,roomid,connection,done){
    var query = "UPDATE staffdetect SET datecheckout = ? ,datemodified = ? WHERE userid =? and roomid =? AND datecheckout IS NULL";
    var table = [datecheckout,datemodified,userid,roomid];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.addNotification = function(id,message,ruleid,userid,roomid,datecreated,datemodified,connection,done){
	var query = "INSERT INTO notification (id,message,ruleid,userid,roomid,datecreated,datemodified) VALUES(?,?,?,?,?,?,?)";
    var table = [id,message,ruleid,userid,roomid,datecreated,datemodified];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.addStaffInRoom = function(id,roomid,zoneid,drillid,cityid,userid,status,dateevented,datecreated,datemodified,connection,done){
	var query = "INSERT INTO staffinroom (id,roomid,zoneid,drillid,cityid,userid,status,dateevented,datecreated,datemodified) VALUES(?,?,?,?,?,?,?,?,?,?)";
    var table = [id,roomid,zoneid,drillid,cityid,userid,status,dateevented,datecreated,datemodified];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.updateStaffInRoom = function(roomid,userid,status,dateevented,datemodified,connection,done){
	var query = "UPDATE staffinroom SET status=?,dateevented=?,datemodified=? WHERE roomid=? and userid=?";
    var table = [status,dateevented,datemodified,roomid,userid];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getNumberInRoom = function(roomid,connection,done){
    var query = "SELECT roomid,ifnull(sum(status),0) as staffnumber FROM staffinroom where roomid=?";
    var table = [roomid];
    query = mysql.format(query,table);
    connection.query(query,done);
}