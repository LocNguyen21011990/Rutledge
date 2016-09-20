var mysql = require('mysql');

exports.createInfoCity = function(id, cityName, description, imagecity, countryCode, datecreated, status, connection, done) {
    var query = "INSERT INTO city (id,name,description,imagecity,country_code,datecreated,datemodified,active) VALUES(?,?,?,?,?,?,?,?)";
    var table = [id, cityName, description, imagecity, countryCode, datecreated, datecreated, status];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.allCitys = function(connection, done) {
    var query = "SELECT * FROM ?? ORDER BY datemodified desc";
    var table = ["city"];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.cityById = function(id, connection, done) {
    var query = "SELECT * FROM ?? where city.id = ?";
    var table = ["city", id];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.cityByDrillId = function(drillID, connection, done) {
    var query = "SELECT drill.id,city.* FROM ?? \
            join ?? on city.id = drill.cityid\
            where drill.id = ?;"
    var table = ["drill", "city", drillID];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.deleteCity = function(cityID, status, connection, done) {
    var query = "UPDATE ?? SET ??=? where ?? = ?";
    var table = ["city", "active", status, "id", cityID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.updateCity = function(id, cityName, description, imagecity, countryCode, datemodified, status, connection, done) {
    var query = "UPDATE ?? SET ??=?,??=?,??=?,??=?,??=?,??=? where city.id = ?;";
    var table = ["city", "name", cityName, "description", description, "imagecity", imagecity, "country_code", countryCode, "datemodified", datemodified, "active", status, id];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.createInfoDrill = function(id, name, description, imagedrill, datecreated, status, cityid, connection, done) {
    var query = "INSERT INTO drill (id,name,description,imagedrill,datecreated,datemodified,active,cityid) VALUES(?,?,?,?,?,?,?,?)";
    var table = [id, name, description, imagedrill, datecreated, datecreated, status, cityid];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.allDrills = function(connection, done) {
    var query = "SELECT * FROM ?? ORDER BY datemodified desc";
    var table = ["drill"];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.drillById = function(id, connection, done) {
    var query = "SELECT * FROM ?? where drill.id =?";
    var table = ["drill", id];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.infoDrill = function(connection, done) {
    var query = "SELECT drill.*,city.name as cityName,city.country_code  FROM ?? INNER JOIN ?? ON drill.cityid = city.id ORDER BY drill.datemodified desc"
    var table = ["drill", "city"];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getDrillByzoneID = function(zoneID, connection, done) {
    var query = "SELECT zone.id,drill.* FROM ?? \
            join ?? on drill.id = zone.drillid\
            where zone.id = ?;"
    var table = ["zone", "drill", zoneID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.deleteDrill = function(drillID, status, connection, done) {
    var query = "UPDATE ?? SET ??=? where ?? = ?";
    var table = ["drill", "active", status, "id", drillID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.updateDrill = function(id, name, description, imagedrill, datemodified, status, cityID, connection, done) {
    var query = "UPDATE ?? SET ??=?,??=?,??=?,??=?,??=?,??=? where drill.id = ?;";
    var table = ["drill", "name", name, "description", description, "imagedrill", imagedrill, 'datemodified', datemodified, 'active', status, 'cityid', cityID, id];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.createInfoZone = function(id, name, description, zonemap, datecreated, status, drillID, connection, done) {
    var query = "INSERT INTO zone (id,name,description,zonemap,datecreated,datemodified,active,drillid) VALUES(?,?,?,?,?,?,?,?)";
    var table = [id, name, description, zonemap, datecreated, datecreated, status, drillID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.allZones = function(connection, done) {
    var query = "SELECT * FROM ??";
    var table = ["zone"];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.infoZone = function(connection, done) {
    var query = "select z.id, z.name as zName ,z.description,z.active,z.datecreated,z.datemodified,d.name as drillName,c.name as cityName from ?? z inner join ?? d on z.drillid =  d.id inner join ?? c on d.cityid = c.id order by z.name";
    var table = ["zone", "drill", "city"];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.zoneById = function(id, connection, done) {
    var query = "SELECT * FROM ?? where zone.id =?";
    var table = ["zone", id];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.updateZone = function(id, name, description, zonemap, datemodified, status, drillID, connection, done) {
    var query = "UPDATE ?? SET ??=?,??=?,??=?,??=?,??=?,??=? where zone.id = ?;";
    var table = ["zone", "name", name, "description", description, "zonemap", zonemap, 'datemodified', datemodified, 'active', status, 'drillid', drillID, id];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.deleteZone = function(zoneID, status, connection, done) {
    var query = "UPDATE ?? SET ??=? where ?? = ?";
    var table = ["zone", "active", status, "id", zoneID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.createInfoRoom = function(id, name, description, datecreated, status, zoneID,drillID,cityID, connection, done) {
    var query = "INSERT INTO room (id,name,description,datecreated,datemodified,active,zoneid,drillid,cityid) VALUES(?,?,?,?,?,?,?,?,?)";
    var table = [id, name, description, datecreated, datecreated, status, zoneID,drillID,cityID];
    query = mysql.format(query, table);
    connection.query(query, done);
};


exports.infoRoom = function(connection, done) {
    var query = "select r.id,r.name as rName, r.description,r.active,r.datecreated,r.datemodified,z.name as zoneName,\
     d.name as drillName,c.name as cityName from room r inner join zone z on r.zoneid = z.id inner join drill d on \
     z.drillid =d.id inner join city c on d.cityid = c.id order by r.name";
    var table = ["room", "zone", "drill", "city"];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.allRoom = function(connection, done) {
    var query = "SELECT * FROM ??";
    var table = ["room"];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.roomById = function(id, connection, done) {
    var query = "SELECT * FROM ?? where room.id = ?";
    var table = ["room", id];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.updateRoom = function(id, name, description, datemodified, status, zoneID,drillID,cityID, connection, done) {
    var query = "UPDATE ?? SET ??=?,??=?,??=?,??=?,??=?,??=?,??=? where room.id = ?;";
    var table = ["room", "name", name, "description", description, 'datemodified', datemodified, 'active', status, 'zoneid', zoneID,'drillid',drillID,'cityid',cityID, id];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.deleteRoom = function(roomID, status, connection, done) {
    var query = "UPDATE ?? SET ??=? where ?? = ?";
    var table = ["room", "active", status, "id", roomID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getDrillByCityID = function(cityID, connection, done) {
    var query = "SELECT drill.* FROM drill inner join city ON drill.cityid = city.id where ?? = ?  ";
    var table = ["drill.cityid", cityID];
    query = mysql.format(query, table);
    connection.query(query, done);
};
exports.getRoomByZoneID = function(zoneID, connection, done) {
    var query = "SELECT room.* FROM room inner join zone ON room.zoneid = zone.id where ?? = ?  ";
    var table = ["room.zoneid", zoneID];
    query = mysql.format(query, table);
    connection.query(query, done);
};
exports.getZoneByDrillID = function(drillID, connection, done) {
    var query = "SELECT zone.* FROM zone inner join drill ON zone.drillid = drill.id where ?? = ? ";
    var table = ["zone.drillid", drillID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getHumanInRoom = function(roomID, connection, done) {
    var query = "Select staffinroom.status, user.name as username, room.name as roomname, zone.name as zonename, drill.name as drillname, city.name as cityname \
                From staffinroom \
                inner join user on staffinroom.userid = user.id \
                inner join room on room.id = staffinroom.roomid \
                inner join zone on zone.id = room.zoneid \
                inner join drill on drill.id = zone.drillid \
                inner join city on city.id = drill.cityid \
                where staffinroom.roomid = ? and staffinroom.status = 1";
    var table = [roomID];
    query = mysql.format(query, table);
    connection.query(query, done);
};


exports.getInfoDrillByCityID = function(cityID, connection, done) {
    var query = "SELECT drill.*,city.name as cityName,city.country_code  FROM ?? INNER JOIN ?? ON drill.cityid = city.id where drill.cityid = ? ORDER BY drill.datemodified desc"
    var table = ["drill", "city", cityID];
    query = mysql.format(query, table);
    connection.query(query, done);
}


exports.getInfoZoneByCityID = function(cityID, connection, done) {
    var query = "select z.id, z.name as zName ,z.description,z.active,z.datecreated,z.datemodified,d.name as drillName,c.name as cityName from ?? z inner join ?? d on z.drillid =  d.id inner join ?? c on d.cityid = c.id where c.id = ? order by z.name";
    var table = ["zone", "drill", "city", cityID];
    query = mysql.format(query, table);
    connection.query(query, done);
}

exports.getInfoZoneByDrillID = function(drillID, connection, done) {
    var query = "select z.id, z.name as zName ,z.description,z.active,z.datecreated,z.datemodified,d.name as drillName,c.name as cityName from ?? z inner join ?? d on z.drillid =  d.id inner join ?? c on d.cityid = c.id where z.drillid = ? order by z.name";
    var table = ["zone", "drill", "city", drillID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getInfoRoomByCityID = function(cityID, connection, done) {
    var query = "select r.id,r.name as rName, r.description,r.active,r.datecreated,r.datemodified,z.name as zoneName,\
     d.name as drillName,c.name as cityName from room r inner join zone z on r.zoneid = z.id inner join drill d on \
     z.drillid =d.id inner join city c on d.cityid = c.id where c.id = ? order by r.name";
    var table = [cityID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getInfoRoomByDrillID = function(drillID, connection, done) {
    var query = "select r.id,r.name as rName, r.description,r.active,r.datecreated,r.datemodified,z.name as zoneName,\
     d.name as drillName,c.name as cityName from room r inner join zone z on r.zoneid = z.id inner join drill d on \
     z.drillid =d.id inner join city c on d.cityid = c.id where d.id = ? order by r.name";
    var table = [drillID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getInfoRoomByZoneID = function(zoneID, connection, done) {
    var query = "select r.id,r.name as rName, r.description,r.active,r.datecreated,r.datemodified,z.name as zoneName,\
     d.name as drillName,c.name as cityName from room r inner join zone z on r.zoneid = z.id inner join drill d on \
     z.drillid =d.id inner join city c on d.cityid = c.id where z.id = ? order by r.name";
    var table = [zoneID];
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getPeopleByZone = function(zoneID, connection, done) {
    var query = "SELECT staffinroom.roomid,sum(status) as staffnumber FROM staffinroom\
            left join room on room.id = staffinroom.roomid\
            where room.zoneid = '5435cc80-1342-11e6-83d2-bbfe2430f480'\
            group by room.id";
    query = mysql.format(query);
    connection.query(query, done);
}

exports.getUserInfoInRoom = function(roomID, connection, done) {
    var query = "SELECT user.id as userid, user.name as username FROM ?? \
                inner join user on staffinroom.userid = user.id \
                where roomid = ? and staffinroom.status = 1";
    var table = ["staffinroom", roomID]
    query = mysql.format(query, table);
    connection.query(query, done);
};

exports.getCityWithStaffNumber = function(connection, done) {
    var query = "SELECT  ifnull(sum(staffinroom.status),0) as staffnumber,city.id,city.name,city.imagecity FROM city\
    left join staffinroom on staffinroom.cityid = city.id group by city.id";
    query = mysql.format(query);
    connection.query(query, done);
};

exports.getDrillWithStaffByCityId = function(cityID, connection, done) {
    var query = "SELECT  ifnull(sum(staffinroom.status),0) as staffnumber,drill.id,drill.name,drill.imagedrill FROM drill\
    left join staffinroom on staffinroom.drillid = drill.id\
    where drill.cityid = ?\
    group by drill.id";
    var table = [cityID];
    query = mysql.format(query,table);
    connection.query(query, done);
};

exports.getZoneWithStaffByDrillId = function(drillId, connection, done) {
    var query = "SELECT  ifnull(sum(staffinroom.status),0) as staffnumber,zone.id,zone.name,zone.zonemap FROM zone\
    left join staffinroom on staffinroom.zoneid = zone.id\
    where zone.drillid = ?\
    group by zone.id";
    var table = [drillId];
    query = mysql.format(query,table);
    connection.query(query, done);
};
