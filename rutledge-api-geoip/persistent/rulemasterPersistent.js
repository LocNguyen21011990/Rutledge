var mysql = require('mysql');

exports.typetemplate = function(connection, done) {
    var query = "SELECT * FROM ?? "
    var table = ['typetemplate'];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.event = function(connection, done) {
    var query = "SELECT * FROM ?? "
    var table = ['event'];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.addStayHour = function(id, timelimit, datecreated, connection, done) {
    var query = "INSERT INTO stayhour (id,timelimit,datecreated,datemodified) VALUES(?,?,?,?)";
    var table = [id, timelimit, datecreated, datecreated];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.updateStayHour = function(id, timelimit, datemodified, connection, done) {
    var query = "UPDATE stayhour SET timelimit = ?,datemodified=? where id = ?";
    var table = [timelimit, datemodified, id];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.addRuleMaster = function(id, title, message, description, typetemplateid, priority, templateid, datecreated, connection, done) {
    var query = "INSERT INTO rulemaster (id,title,message,description,typetemplateid,priority,templateid,datecreated,datemodified) VALUES(?,?,?,?,?,?,?,?,?)";
    var table = [id, title, message, description, typetemplateid, priority, templateid, datecreated, datecreated];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.updateRuleMaster = function(id, title, message, description, typetemplateid, priority, templateid, datemodified, connection, done) {
    var query = "UPDATE rulemaster SET title = ?,message = ?,description=?,typetemplateid=?,priority = ?,templateid=?,datemodified=? where id = ?";
    var table = [title, message, description, typetemplateid, priority, templateid, datemodified, id];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.addRuleRoom = function(id, ruleid, roomid, datecreated, connection, done) {
    var query = "INSERT INTO ruleroom (id,ruleid,roomid,datecreated,datemodified) VALUES(?,?,?,?,?)";
    var table = [id, ruleid, roomid, datecreated, datecreated];
    query = mysql.format(query, table);
    connection.query(query, done);
};



exports.addRuleEvent = function(id, ruleid, eventid, datecreated, connection, done) {
    var query = "INSERT INTO ruleevent (id,ruleid,eventid,datecreated,datemodified) VALUES(?,?,?,?,?)";
    var table = [id, ruleid, eventid, datecreated, datecreated];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.addTimeAccess = function(id, timebegin, timeend, datecreated, connection, done) {
    var query = "INSERT INTO timeaccess (id,timebegin,timeend,datecreated,datemodified) VALUES(?,?,?,?,?)";
    var table = [id, timebegin, timeend, datecreated, datecreated];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.updateTimeAccess = function(id, timebegin, timeend, datemodified, connection, done) {
    var query = "UPDATE timeaccess SET timebegin = ?,timeend=?,datemodified=? where id = ?";
    var table = [timebegin, timeend, datemodified, id];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.rulemaster = function(connection, done) {
    var query = "SELECT r.id as rid ,r.title,r.message,r.description,r.priority,r.datecreated,r.datemodified,t.name as typetemplate,t.id as templateid,t.tablename FROM ?? r JOIN ?? t on r.typetemplateid =t.id ";
    var table = ['rulemaster', 'typetemplate'];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.detailrulemaster = function(rulemasterID, connection, done) {
    var query = "SELECT * FROM ?? where rulemaster.id = ?";
    var table = ['rulemaster', rulemasterID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.detailRuleRoom = function(rulemasterID, connection, done) {
    var query = "select ruleroom.*,room.name,room.id as roomid from ??\
                inner join ?? on rulemaster.id = ruleroom.ruleid\
                inner join ?? on ruleroom.roomid = room.id\
                where rulemaster.id= ?";
    var table = ["rulemaster", "ruleroom", "room", rulemasterID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.detailruleEvent = function(rulemasterID, connection, done) {
    var query = "select rulemaster.id as mid,ruleevent.datecreated,ruleevent.datemodified,event.name,event.id as eventid from ??\
                left join ?? on rulemaster.id = ruleevent.ruleid\
                left join ?? on ruleevent.eventid = event.id\
                where rulemaster.id = ?";
    var table = ["rulemaster", "ruleevent", "event", rulemasterID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.detailStayHour = function(rulemasterID, connection, done) {
    var query = "select stayhour.*,rulemaster.typetemplateid from ??\
            left join ?? on stayhour.id = rulemaster.templateid\
            where rulemaster.id=?;"
    var table = ["stayhour", "rulemaster", rulemasterID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.detailTimeAccess = function(rulemasterID, connection, done) {
    var query = "select timeaccess.*,rulemaster.typetemplateid from ??\
            left join ?? on timeaccess.id = rulemaster.templateid\
            where rulemaster.id=?;"
    var table = ["timeaccess", "rulemaster", rulemasterID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.viewDetailEvents = function(eventID, connection, done) {
    var query = "select rulemaster.id as rid,rulemaster.title as title,rulemaster.message as message,\
            rulemaster.description as description,rulemaster.priority,typetemplate.name as typetemplate,\
            typetemplate.tablename,rulemaster.datecreated,rulemaster.datemodified,event.name as eventname\
            from ?? inner join ?? on event.id = ruleevent.eventid\
            inner join ?? on ruleevent.ruleid = rulemaster.id\
            inner join ?? on rulemaster.typetemplateid = typetemplate.id\
            where if('all'<>?,event.id=?, 1=1);"
    var table = ["event", "ruleevent", "rulemaster", "typetemplate", eventID, eventID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.ruleroom = function(connection, done) {
    var query = "select distinct(name),room.id from ??\
            inner join ?? on room.id = ruleroom.roomid";
    var table = ["room", "ruleroom"];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.viewRuleByRoom = function(roomid, connection, done) {
    var query = "select rulemaster.id as rid,rulemaster.priority,rulemaster.title,rulemaster.message,\
            rulemaster.description,rulemaster.datecreated,rulemaster.datemodified,\
            typetemplate.name as typetemplate,typetemplate.tablename,room.name as room from ??\
            inner join ?? on rulemaster.id = ruleroom.ruleid\
            inner join ?? on rulemaster.typetemplateid = typetemplate.id\
            inner join ?? on ruleroom.roomid = room.id \
            where if('all'<>?,ruleroom.roomid=?,1=1)";
    var table = ["ruleroom", "rulemaster", "typetemplate", "room", roomid, roomid];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.deleteRuleRoomByRuleId = function(ruleId,connection,done){
    var query = "DELETE FROM ruleroom WHERE ruleid= ?";
    var table = [ruleId];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.deleteRuleEventByRuleId =function(ruleId,connection,done){
    var query = "DELETE FROM ruleevent WHERE ruleid= ?";
    var table = [ruleId];
    query = mysql.format(query, table);
    connection.query(query, done);
}