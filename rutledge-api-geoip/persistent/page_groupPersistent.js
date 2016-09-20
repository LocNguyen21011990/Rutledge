var mysql = require('mysql');

exports.createPageGroup = function(id, pageid, accessgroup, connection, done) {
    var query = "INSERT INTO page_group (id,pageid,accessgroup) VALUES(?,?,?)";
    var table = [id, pageid, accessgroup];
    query = mysql.format(query, table);
   	connection.query(query, done);
};

exports.deletePageGroup = function(groupid, connection, done) {
    var query = "DELETE FROM page_group WHERE accessgroup = ?";
    var table = [groupid];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getPageByGroupId = function(groupid, connection, done) {
    var query = "select page.* from page \
    left join page_group on page.id = page_group.pageid \
	where accessgroup = ?" ;
	    var table = [groupid];
    query = mysql.format(query, table);
    connection.query(query, done);
};

