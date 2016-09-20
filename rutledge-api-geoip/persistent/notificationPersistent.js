var mysql = require('mysql')

exports.get = function(connection, done) {
	var query = "SELECT n.message, n.datecreated, u.name as username, r.name as roomname \
				FROM notification n \
				inner join user u on n.userid = u.id \
				inner join room r on n.roomid = r.id ";
	var table = ["notification"];
    query = mysql.format(query,table);
    connection.query(query, done);
}

exports.getPeopleAccessZoneByDrillId = function(drillId, connection, done) {
    var query = "select rulemaster.title,zone.name,zone.*,count(notification.ruleid) as people from zone\
			left join notification on zone.id = (select zoneid from room where room.id = notification.roomid)\
			left join rulemaster on rulemaster.id = notification.ruleid\
			where zone.drillid =?\
			group by zone.id,notification.ruleid\
			having people >0";
    var table = [drillId];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getPeopleAccessZones = function(connection, done) {
    var query = "select rulemaster.title,zone.*,count(notification.ruleid) as people from zone\
			left join notification on zone.id = (select zoneid from room where room.id = notification.roomid)\
			left join rulemaster on rulemaster.id = notification.ruleid\
			group by zone.id,notification.ruleid\
			having people >0";
    var table = ["zone", "room", "notification", "rulemaster"];
    query = mysql.format(query);
    connection.query(query, done);
}

exports.getByDate = function(dateBegin,dateEnd,connection, done) {
    var query = "SELECT zone.id,zone.name,count(notification.userid) as people,rulemaster.title as rule FROM ??\
		left join ?? on room.zoneid = zone.id\
		left join ?? on notification.roomid = room.id\
		left join ?? on  notification.ruleid = rulemaster.id\
		where notification.datecreated between ? and ? \
		group by zone.id having people > 0";
    var table = ["zone", "room", "notification", "rulemaster",dateBegin,dateEnd];
    query = mysql.format(query, table);
    connection.query(query, done);
}
