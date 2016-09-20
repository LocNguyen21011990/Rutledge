var mysql = require('mysql');

exports.createGroup = function(id, name, description, datecreated, connection, done) {
    var query = "INSERT INTO `group` (id,name,description,datecreated) VALUES(?,?,?,?)";
    var table = [id, name, description, datecreated];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.updateGroup = function(id, name, description, datemodified, connection, done) {
    var query = "UPDATE `group` SET ?? = ?,?? = ?,??=? where id = ?";
    var table = ['name', name, 'description', description, 'datemodified', datemodified, id];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getAllGroup = function(connection, done) {
    var query = "SELECT * FROM `group`";
    query = mysql.format(query);
    connection.query(query, done);
};

exports.getGroupById = function(id, connection, done) {
    var query = "SELECT * FROM `group` WHERE id = ?";
    var table = [id];
    query = mysql.format(query, table);
    connection.query(query, done);
};
