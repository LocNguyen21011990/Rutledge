var mysql = require('mysql')

exports.login = function(user, connection, done) {
    var query = "select * from user \
    			where user.username = ? and user.password = ?";
    var table = [user.name, user.password];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getListPageByUserId = function(userID, connection, done) {
    var query = "select p.* from `page` p \
                inner join page_group pg on pg.pageid = p.id \
                inner join user_group ug on ug.groupid = pg.accessgroup \
                where ug.userid = ? and p.status = 1 and showmenu =1 group by p.id";
    var table = [userID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getListPageByGroupId = function(userID, connection, done) {
    var query = "select p.* from `page` p \
                inner join page_group pg on pg.pageid = p.id \
                inner join user_group ug on ug.groupid = pg.accessgroup \
                where ug.userid = ? and p.status = 1 group by p.id";
    var table = [userID];
    query = mysql.format(query, table);
    connection.query(query, done);
};
