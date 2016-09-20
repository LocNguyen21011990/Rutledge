var mysql = require('mysql');

exports.createUserGroup = function(id, userid, groupid, connection, done) {
    var query = "INSERT INTO user_group (id,userid,groupid) VALUES(?,?,?)";
    var table = [id, userid, groupid];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.deleteUserGroup = function(userid, connection, done) {
    var query = "DELETE FROM user_group WHERE userid= ?";
    var table = [userid];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getGroupByUserId = function(userid, connection, done) {
    var query = "select `group`.name,`group`.id from `group`\
			left join user_group on user_group.groupid = `group`.id\
			where user_group.userid=?";
    var table = [userid];
    query = mysql.format(query, table);
    connection.query(query, done);
};
