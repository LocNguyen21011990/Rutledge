var mysql = require('mysql');

exports.signup = function(id, username, password, fullname, email,status, datecreated, connetion, done) {
    var query = "INSERT INTO user(id,username,password,fullname,name,email,status,datecreated) VALUE(?,?,?,?,?,?,?,?)";
    var table = [id, username, password, fullname,fullname, email,status, datecreated];
    query = mysql.format(query, table);
    connetion.query(query, done);
}

exports.updateUser = function(id,fullname,email,status ,datemodified, connetion, done) {
    var query = "UPDATE user SET fullname = ?,name = ?,email=?,status=?,datemodified=? where id = ?";
    var table = [fullname,fullname,email,status,datemodified, id];
    query = mysql.format(query, table);
    connetion.query(query, done);
}

exports.getAllUser = function(connetion, done) {
    var query = "SELECT * FROM user";
    query = mysql.format(query);
    connetion.query(query, done);
};

exports.getUserById = function(id, connetion, done) {
    var query = "SELECT * FROM user WHERE id=?";
    var table = [id];
    query = mysql.format(query, table);
    connetion.query(query, done)
}

exports.checkUserNameExist = function(username, connetion, done) {
    var query= "SELECT username from user where username=?";
    var table = [username];
    query = mysql.format(query, table);
    connetion.query(query, done);
};

exports.checkEmailExist =function(email,connection,done){
    var query= "SELECT email from user where email=?";
    var table = [email];
    query = mysql.format(query, table);
    connetion.query(query, done);
}

exports.inactive = function(id, status, connetion, done) {
    var query = "UPDATE user SET ?? = ? where id = ?";
    var table = ['status', status, id];
    query = mysql.format(query, table);
    connetion.query(query, done);
}

exports.getUserByEmail = function (email, connection, done) {
    var query = "select * from user where email = ?";
    var table = [email];
    query = mysql.format(query, table);
    connection.query(query,done);
}

exports.getUserByPassword = function (password, connection, done) {
    var query = "select id from user where password = ?";
    var table = [password];
    query = mysql.format(query, table);
    connection.query(query,done);
}

exports.updatePassword = function(objpass, connection, done) {
    var query = "update user set password = ? where email = ? and id != ''";
    var table = [objpass.newPass, objpass.email];
    query = mysql.format(query, table);
    connection.query(query,done);
}