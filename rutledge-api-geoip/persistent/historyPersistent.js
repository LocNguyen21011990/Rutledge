var mysql = require('mysql')

exports.getHistory = function(connection, done) {
	var query = "select sd.status, u.name as username, sd.datecheckin, sd.datecheckout, r.name as roomname \
				from ?? sd inner join user u on sd.userid = u.id \
				inner join room r on sd.roomid = r.id \
				order by sd.datecheckin desc";
	var table = ["staffdetect"];
    query = mysql.format(query,table);
    connection.query(query, done);
}