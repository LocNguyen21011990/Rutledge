var mysql = require('mysql')

exports.getPages = function(connection, done) {
    var query = "select * from page";
    query = mysql.format(query);
    connection.query(query, done);
};

exports.createPage = function(id, title, link, icon, keyLanguage, sortOrder, showInMenu, status, datecreated, connection, done) {
    var query = "INSERT INTO page(id,title,link,icon,keylanguage,sortorder,showmenu,status,datecreated) VALUE(?,?,?,?,?,?,?,?,?)";
    var table = [id, title, link, icon, keyLanguage, sortOrder, showInMenu, status,datecreated];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.inactive = function(id, status, connection, done) {
    var query = "UPDATE page SET ?? = ? where id = ?";
    var table = ['status', status, id];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.showInMenu = function(id, showmenu, connection, done) {
    var query = "UPDATE page SET ?? = ? where id = ?";
    var table = ['showmenu', showmenu, id];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getPageById = function(id, connection, done) {
    var query = "select * from page where ??=?";
    var table = ['id', id];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.updatePage = function(id, title, link, icon, keyLanguage, sortOrder, showInMenu, status, datemodified, connection, done) {
    var query = "UPDATE page SET title = ?,link = ?,icon=?,keylanguage=?,sortorder=?,showmenu=?,status=?,datemodified=? where id = ?";
    var table = [title, link, icon, keyLanguage, sortOrder, showInMenu, status,datemodified,id];
    query = mysql.format(query, table);
    connection.query(query, done);
}
