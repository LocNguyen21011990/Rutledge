// var mysql = require("mysql");
var sensorPersistent = require('./persistent/sensorPersistent');
var tenantPersistent = require('./persistent/tenantPersistent');
var notificationPersistent = require('./persistent/notificationPersistent');
var historyPersistent = require('./persistent/historyPersistent');
var geoipPersistent = require('./persistent/geoipPersistent');
var locationPersistent = require('./persistent/locationPersistent');
var rulemasterPersistent = require('./persistent/rulemasterPersistent');
var checkrulePersistent = require('./persistent/checkrulePersistent');
var permissionPersistent = require('./persistent/permissionPersistent');
var pagePersistent = require('./persistent/pagePersistent');

var userPersistent = require('./persistent/userPersistent');
var groupPersistent = require('./persistent/groupPersistent');
var userGroupPersistent = require('./persistent/user_groupPersistent');
var pageGroupPesistent = require('./persistent/page_groupPersistent');

var pushnotificationPersistent = require('./persistent/pushnotificationPersistent');

var uuid = require('node-uuid');
var async = require('async');
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var config = require('./config');

function REST_ROUTER(router, connection, md5,jwt) {
    var self = this;
    self.handleRoutes(router, connection, md5,jwt);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5,jwt) {
    var self = this;

    router.get("/", function(req, res) {
        res.send('Hello api.');
    });

    /*---------CITY--------------*/

    router.post('/createInfoCity', function(req, res) {
        var id = uuid.v1();
        var cityName = req.body.cityName;
        var description = req.body.description;
        var imagecity = req.body.imagecity;
        var countryCode = req.body.countryCode;
        var datecreated = req.body.datecreated;
        var status = req.body.status;
        locationPersistent.createInfoCity(id, cityName, description, imagecity, countryCode, datecreated, status, connection, function(err, result) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": result });
            }
        });
    });

    router.get('/getAllCitys', function(req, res) {
        locationPersistent.allCitys(connection, function(err, citys) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": citys });
            }
        });
    });

    router.get('/getCityById/:cityID', function(req, res) {
        var id = req.params.cityID;
        locationPersistent.cityById(id, connection, function(err, city) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": city });
            }
        });
    });

    router.get('/getCityByDrillId/:drillID', function(req, res) {
        var drillID = req.params.drillID;
        locationPersistent.cityByDrillId(drillID, connection, function(err, city) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": city });
            }
        });
    });

    router.put('/deleteCity', function(req, res) {
        var cityID = req.body.cityID;
        var status = req.body.status;
        locationPersistent.deleteCity(cityID, status, connection, function(err, city) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": city });
            }
        });
    });

    router.post('/updateCity', function(req, res) {
        var id = req.body.id;
        var cityName = req.body.cityName;
        var description = req.body.description;
        var imagecity = req.body.imagecity;
        var countryCode = req.body.countryCode;
        var datemodified = req.body.datemodified;
        var status = req.body.status;
        locationPersistent.updateCity(id, cityName, description, imagecity, countryCode, datemodified, status, connection, function(err, city) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": city });
            }
        });
    });

    /*---------DRILL--------------*/

    router.post('/createInfoDrill', function(req, res) {
        var id = uuid.v1();
        var name = req.body.name;
        var description = req.body.description;
        var imagedrill = req.body.imagedrill;
        var datecreated = req.body.datecreated;
        var status = req.body.status;
        var cityID = req.body.cityID;
        locationPersistent.createInfoDrill(id, name, description, imagedrill, datecreated, status, cityID, connection, function(err, result) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": result });
            }
        });
    });

    router.get('/getAllDrill', function(req, res) {
        locationPersistent.allDrills(connection, function(err, drills) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": drills });
            }
        });
    });

    router.get('/getDrillById/:drillID', function(req, res) {
        var id = req.params.drillID;
        locationPersistent.drillById(id, connection, function(err, drill) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": drill });
            }
        });
    });

    router.get('/getInfoDrill', function(req, res) {
        locationPersistent.infoDrill(connection, function(err, buildings) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": buildings });
            }
        })
    });

    router.put('/deleteDrill', function(req, res) {
        var drillID = req.body.drillID;
        var status = req.body.status;
        locationPersistent.deleteDrill(drillID, status, connection, function(err, city) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": city });
            }
        });
    });

    router.post('/updateDrill', function(req, res) {
        var id = req.body.id;
        var name = req.body.name;
        var description = req.body.description;
        var imagedrill = req.body.imagedrill;
        var cityID = req.body.cityID;
        var datemodified = req.body.datemodified;
        var status = req.body.status;
        locationPersistent.updateDrill(id, name, description, imagedrill, datemodified, status, cityID, connection, function(err, drill) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": drill });
            }
        });
    });

    /*---------ZONE--------------*/

    router.post('/createInfoZone', function(req, res) {
        var id = uuid.v1();
        var name = req.body.name;
        var description = req.body.description;
        var zonemap = req.body.zonemap;
        var datecreated = req.body.datecreated;
        var status = req.body.status;
        var drillID = req.body.drillID;
        locationPersistent.createInfoZone(id, name, description, zonemap, datecreated, status, drillID, connection, function(err, result) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": result });
            }
        });
    });

    router.get('/getAllZones', function(req, res) {
        locationPersistent.allZones(connection, function(err, zones) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": zones });
            }
        })
    });

    router.get('/getInfoZone', function(req, res) {
        locationPersistent.infoZone(connection, function(err, zones) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": zones });
            }
        })
    });

    router.get('/getZoneById/:zoneID', function(req, res) {
        var id = req.params.zoneID;
        locationPersistent.zoneById(id, connection, function(err, zone) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": zone });
            }
        });
    })

    router.post('/updateZone', function(req, res) {
        var id = req.body.id;
        var name = req.body.name;
        var description = req.body.description;
        var zonemap = req.body.zonemap;
        var drillID = req.body.drillID;
        var datemodified = req.body.datemodified;
        var status = req.body.status;
        locationPersistent.updateZone(id, name, description, zonemap, datemodified, status, drillID, connection, function(err, zone) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": zone });
            }
        })
    });

    router.put('/deleteZone', function(req, res) {
        var zoneID = req.body.zoneID;
        var status = req.body.status;
        locationPersistent.deleteZone(zoneID, status, connection, function(err, zone) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": zone });
            }
        });
    });

    /*---------ROOM--------------*/

    router.post('/createInfoRoom', function(req, res) {
        var id = uuid.v1();
        var name = req.body.name;
        var description = req.body.description;
        var datecreated = req.body.datecreated;
        var status = req.body.status;
        var zoneID = req.body.zoneID;
        var cityID = req.body.cityID;
        var drillID = req.body.drillID;
        locationPersistent.createInfoRoom(id, name, description, datecreated, status, zoneID, drillID, cityID, connection, function(err, room) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": room });
            }
        });
    });

    router.get('/getAllRoom', function(req, res) {
        locationPersistent.allRoom(connection, function(err, rooms) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": rooms });
            }
        });
    });

    router.get('/getInfoRoom', function(req, res) {
        locationPersistent.infoRoom(connection, function(err, rooms) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": rooms });
            }
        });
    });

    router.get('/getRoomById/:roomID', function(req, res) {
        var id = req.params.roomID;
        locationPersistent.roomById(id, connection, function(err, room) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": room });
            }
        });
    });

    router.post('/updateRoom', function(req, res) {
        var id = req.body.id;
        var name = req.body.name;
        var description = req.body.description;
        var datemodified = req.body.datemodified;
        var status = req.body.status;
        var zoneID = req.body.zoneID;
        var drillID = req.body.drillID;
        var cityID = req.body.cityID;
        locationPersistent.updateRoom(id, name, description, datemodified, status, zoneID, drillID, cityID, connection, function(err, room) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": room });
            }
        });
    });

    router.put('/deleteRoom', function(req, res) {
        var roomID = req.body.roomID;
        var status = req.body.status;
        locationPersistent.deleteRoom(roomID, status, connection, function(err, room) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": room });
            }
        })
    });

    /*---------RULE MASTER--------------*/
    router.get('/typetemplates', function(req, res) {
        rulemasterPersistent.typetemplate(connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/events', function(req, res) {
        rulemasterPersistent.event(connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.put('/rulemaster', function(req, res) {
        var stayhourID = uuid.v1();
        var rulemasterID = uuid.v1();

        var title = req.body.title;
        var message = req.body.message;
        var description = req.body.description;
        var typetemplateid = req.body.ttpID;
        var templateid = stayhourID;
        var timeLimit = req.body.timeLimit;
        var priority = req.body.priority;
        var aRoomID = req.body.roomID;
        var aEventID = req.body.eventID;
        var datecreated = req.body.datecreated;

        rulemasterPersistent.addStayHour(stayhourID, timeLimit, datecreated, connection, function(err, data) {});

        rulemasterPersistent.addRuleMaster(rulemasterID, title, message, description, typetemplateid, priority, templateid, datecreated, connection, function(err, data) {});

        for (var i = 0; i < aRoomID.length; i++) {
            var ruleroomID = uuid.v1();
            rulemasterPersistent.addRuleRoom(ruleroomID, rulemasterID, aRoomID[i], datecreated, connection, function(err, data) {});
        }

        for (var i = 0; i < aEventID.length; i++) {
            var ruleeventID = uuid.v1();
            rulemasterPersistent.addRuleEvent(ruleeventID, rulemasterID, aEventID[i], datecreated, connection, function(err, data) {});
        }

        res.jsonp({ "Error": true, "Message": "Success", "data": "data" });


    });
    /*time access*/
    router.put('/rulemaster-timeaccess', function(req, res) {
        var stayhourID = uuid.v1();
        var rulemasterID = uuid.v1();

        var title = req.body.title;
        var message = req.body.message;
        var description = req.body.description;
        var typetemplateid = req.body.ttpID;
        var templateid = stayhourID;
        var timebegin = req.body.timeBegin;
        var timeend = req.body.timeEnd;
        var priority = req.body.priority;
        var aRoomID = req.body.roomID;
        var aEventID = req.body.eventID;
        var datecreated = req.body.datecreated;

        rulemasterPersistent.addTimeAccess(stayhourID, timebegin, timeend, datecreated, connection, function(err, data) {});

        rulemasterPersistent.addRuleMaster(rulemasterID, title, message, description, typetemplateid, priority, templateid, datecreated, connection, function(err, data) {});

        for (var i = 0; i < aRoomID.length; i++) {
            var ruleroomID = uuid.v1();
            rulemasterPersistent.addRuleRoom(ruleroomID, rulemasterID, aRoomID[i], datecreated, connection, function(err, data) {});
        }

        for (var i = 0; i < aEventID.length; i++) {
            var ruleeventID = uuid.v1();
            rulemasterPersistent.addRuleEvent(ruleeventID, rulemasterID, aEventID[i], datecreated, connection, function(err, data) {});
        }

        res.jsonp({ "Error": true, "Message": "Success", "data": "data" });
    });

    router.put('/updateRuleMaster', function(req, res) {
        var data = req.body;
        var id = data.id;
        var title = data.title;
        var message = data.message;
        var description = data.description;
        var datemodified = data.datemodified;
        var templateid = req.body.templateId;
        var typetemplateid = req.body.typetemplateid;
        var rooms = req.body.roomID;
        var events = req.body.eventID;
        var priority = req.body.priority;
        var datecreated = req.body.datemodified;
        rulemasterPersistent.deleteRuleRoomByRuleId(id, connection, function(err, data) {});
        rulemasterPersistent.deleteRuleEventByRuleId(id, connection, function(err, data) {});
        rulemasterPersistent.updateRuleMaster(id, title, message, description, typetemplateid, priority, templateid, datemodified, connection, function(err, data) {});
        if (req.body.tablename === 'stayhour') {
            var timeLimit = data.timeLimit;
            rulemasterPersistent.updateStayHour(templateid, timeLimit, datemodified, connection, function(err, data) {

            });
        } else if (req.body.tablename === 'timeaccess') {
            var timebegin = data.timeBegin;
            var timeend = data.timeEnd;
            rulemasterPersistent.updateTimeAccess(templateid, timebegin, timeend, datemodified, connection, function(err, data) {

            })
        }
        for (var i = 0; i < rooms.length; i++) {
            var ruleroomID = uuid.v1();
            rulemasterPersistent.addRuleRoom(ruleroomID, id, rooms[i], datecreated, connection, function(err, data) {});
        }

        for (var i = 0; i < events.length; i++) {
            var ruleeventID = uuid.v1();
            rulemasterPersistent.addRuleEvent(ruleeventID, id, events[i], datecreated, connection, function(err, data) {});
        }

        res.jsonp({ "Error": true, "Message": "Success", "data": "data" });

    });

    router.get('/rulemasters', function(req, res) {
        rulemasterPersistent.rulemaster(connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });

    router.get('/detailrulemaster/:rulemasterID', function(req, res) {
        var rulemasterID = req.params.rulemasterID;
        rulemasterPersistent.detailrulemaster(rulemasterID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    })

    router.get('/detailruleroom/:rulemasterID', function(req, res) {
        var rulemasterID = req.params.rulemasterID;
        rulemasterPersistent.detailRuleRoom(rulemasterID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });

    router.get('/detailruleevent/:rulemasterID', function(req, res) {
        var rulemasterID = req.params.rulemasterID;
        rulemasterPersistent.detailruleEvent(rulemasterID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    })

    router.get('/detailTypeRule/:rulemasterID/:tablename', function(req, res) {
        var rulemasterID = req.params.rulemasterID;
        var tablename = req.params.tablename;
        if (tablename === 'stayhour') {
            rulemasterPersistent.detailStayHour(rulemasterID, connection, function(err, data) {
                if (err) {
                    res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
                } else {
                    res.jsonp({ "Error": false, "Message": "Success", "data": data });
                }
            });
        } else {
            rulemasterPersistent.detailTimeAccess(rulemasterID, connection, function(err, data) {
                if (err) {
                    res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
                } else {
                    res.jsonp({ "Error": false, "Message": "Success", "data": data });
                }
            });
        }
    });

    router.get('/getDetailStayHourByRuleId/:rulemasterID', function(req, res) {
        var rulemasterID = req.params.rulemasterID;
        rulemasterPersistent.detailStayHour(rulemasterID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });

    router.get('/getDetailTimeAccessByRuleId/:rulemasterID', function(req, res) {
        var rulemasterID = req.params.rulemasterID;
        rulemasterPersistent.detailTimeAccess(rulemasterID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    })


    router.get('/viewDetailEvents/:eventID', function(req, res) {
        var eventID = req.params.eventID;
        rulemasterPersistent.viewDetailEvents(eventID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });

    router.get('/drill/:cityID', function(req, res) {
        var cityID = req.params.cityID;
        locationPersistent.getDrillByCityID(cityID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getDrillByZoneId/:zoneID', function(req, res) {
        var zoneID = req.params.zoneID;
        locationPersistent.getDrillByzoneID(zoneID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    })

    router.get('/zone/:drillID', function(req, res) {
        var drillID = req.params.drillID;
        locationPersistent.getZoneByDrillID(drillID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });

    router.get('/room/:zoneID', function(req, res) {
        var zoneID = req.params.zoneID;
        locationPersistent.getRoomByZoneID(zoneID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });
    router.post("/saveShapes", function(req, res) {
        var checkExist = "SELECT * FROM ?? WHERE ?? = ?";
        var checkTable = ["zonecanvas", "zoneId", req.body.zoneId];
        checkExist = mysql.format(checkExist, checkTable);
        connection.query(checkExist, function(err, rows) {
            //check available zoneId, if exist, update record
            if (null != rows.length && rows.length > 0) {
                var query = "UPDATE ?? SET ?? = ?  WHERE ?? = ?";
                var table = ["zonecanvas", "baseCode", req.body.baseCode, "zoneId", req.body.zoneId];
                query = mysql.format(query, table);
                connection.query(query, function(err, rows) {
                    if (err) {
                        res.json({
                            "Result": false,
                            "Message": "Error executing MySQL query"
                        });
                    } else {
                        res.json({
                            "Result": true,
                            "Message": "Saved shapes."
                        });
                    }
                });
            } else {
                var query = "INSERT INTO ??(??,??) VALUES (?,?)";
                var table = ["zonecanvas", "zoneId", "baseCode", req.body.zoneId, req.body.baseCode];
                query = mysql.format(query, table);
                connection.query(query, function(err, rows) {
                    if (err) {
                        res.json({
                            "Result": false,
                            "Message": "Error executing MySQL query"
                        });
                    } else {
                        res.json({
                            "Result": true,
                            "Message": "Saved shapes."
                        });
                    }
                });
            }
        });
    });

    router.get("/loadShapes", function(req, res) {
        var query = "SELECT ?? FROM ?? WHERE ?? = ?";
        var table = ["baseCode", "zonecanvas", "zoneId", req.query.option];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Result": false,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "rows": rows
                });
            }
        });
    });

    /*NOTIFICATION*/
    router.get('/ruleroom', function(req, res) {
        rulemasterPersistent.ruleroom(connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getRuleByRoom/:roomid', function(req, res) {
        var roomid = req.params.roomid;
        rulemasterPersistent.viewRuleByRoom(roomid, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    })

    router.get('/getNotification', function(req, res) {
        notificationPersistent.get(connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });


    router.get('/getHumanInRoom/:roomID', function(req, res) {
        var roomID = req.params.roomID;
        locationPersistent.getHumanInRoom(roomID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });

    router.get('/getInfoDrillByCityID/:cityID', function(req, res) {
        var cityID = req.params.cityID;
        locationPersistent.getInfoDrillByCityID(cityID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getInfoZoneByCityID/:cityID', function(req, res) {
        var cityID = req.params.cityID;
        locationPersistent.getInfoZoneByCityID(cityID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getInfoZoneByDrillID/:drillID', function(req, res) {
        var drillID = req.params.drillID;
        locationPersistent.getInfoZoneByDrillID(drillID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getInfoRoomByCityID/:cityID', function(req, res) {
        var cityID = req.params.cityID;
        locationPersistent.getInfoRoomByCityID(cityID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getInfoRoomByDrillID/:drillID', function(req, res) {
        var drillID = req.params.drillID;
        locationPersistent.getInfoRoomByDrillID(drillID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getInfoRoomByZoneID/:zoneID', function(req, res) {
        var zoneID = req.params.zoneID;
        locationPersistent.getInfoRoomByZoneID(zoneID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getHistory', function(req, res) {
        historyPersistent.getHistory(connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });
    /*Notification*/

    router.get('/getPeopleAccessZone/:drillID', function(req, res) {
        var drillID = req.params.drillID;
        locationPersistent.getPeopleAccessZoneByDrillId(drillID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    })

    router.get('/getZoneWithStaffByDrillId/:drillId', function(req, res) {
        var drillId = req.params.drillId;
        locationPersistent.getZoneWithStaffByDrillId(drillId, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    })

    router.get('/getPeopleAccessZonesByDate/:dateBegin/:dateEnd', function(req, res) {
        var dateBegin = req.params.dateBegin;
        var dateEnd = req.params.dateEnd;
        notificationPersistent.getByDate(dateBegin, dateEnd, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });


    router.get('/countHumanInRoom/:roomID', function(req, res) {
        checkrulePersistent.getNumberInRoom(req.params.roomID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getPeopleByZoneId/:zoneId', function(req, res) {

        var zoneID = req.params.zoneId;
        locationPersistent.getPeopleByZone(zoneID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })

    })

    router.get('/getCityWithStaffNumber', function(req, res) {
        locationPersistent.getCityWithStaffNumber(connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })

    });

    router.get('/getUserInfoInRoom/:roomID', function(req, res) {
        var roomID = req.params.roomID;
        locationPersistent.getUserInfoInRoom(roomID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.put('/login', function(req, res) {
        var user = req.body;
        permissionPersistent.login(user, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": err, "Message": "Error executing MySQL query" });
            } else {
                // create a token
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.jsonp({ "Error": false, "Message": "Success", "data": data ,"token": token});
            }
        })
    });



    router.get('/getListPageByUserId/:userID', function(req, res) {

        var userID = req.params.userID;
        permissionPersistent.getListPageByUserId(userID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });



    router.get('/getPages', function(req, res) {
        pagePersistent.getPages(connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });


    router.get('/getDrillWithStaffByCityId/:cityId', function(req, res) {
        var cityID = req.params.cityId;
        locationPersistent.getDrillWithStaffByCityId(cityID, connection, function(err, data) {

            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    /*---------PUSH NOTIFICATION--------------*/
    router.post('/createTokenInfo', function(req, res) {

        var regId = req.body.regId;
        var dateCreate = new Date();
        var isActive = 1;
        pushnotificationPersistent.createTokenInfo(regId, dateCreate, isActive, connection, function(err) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success" });
            }
        });
    });

    router.post('/signup', function(req, res) {
        var id = uuid.v1();
        var username = req.body.username;
        var password = req.body.password;
        var fullname = req.body.fullname;
        var email = req.body.email;
        var datecreated = req.body.datecreated;
        var status = req.body.status;
        var group = req.body.group;
        userPersistent.signup(id, username, password, fullname, email, status, datecreated, connection, function(err, data) {});
        for (var i = 0; i < group.length; i++) {
            var userGroupId = uuid.v1();
            userGroupPersistent.createUserGroup(userGroupId, id, group[i], connection, function(err, data) {});
        }
        res.jsonp({ "Error": false, "Message": "Success", "data": "data" });
    });

    router.post('/checkUserNameAndEmailExist', function(req, res) {
        var email = req.body.email;
        var username = req.body.username;
        userPersistent.checkUserNameExist(username, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                if (data.length == '') {
                    res.jsonp({ "Error": false, "Message": "Success", "data": "true" });
                } else {
                    res.jsonp({ "Error": false, "Message": "Success", "data": "false" });
                }
            }
        });
        userPersistent.checkEmailExist(email, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                if (data.length == '') {
                    res.jsonp({ "Error": false, "Message": "Success", "data": "true" });
                } else {
                    res.jsonp({ "Error": false, "Message": "Success", "data": "false" });
                }
            }
        });
    })

    router.put('/updateUser/:id', function(req, res) {
        var id = req.params.id;
        var username = req.body.username;
        // var password = req.body.password;
        var fullname = req.body.fullname;
        var datemodified = req.body.datemodified;
        var status = req.body.status;
        var email = req.body.email;
        var group = req.body.group;
        //update info of user
        userPersistent.updateUser(id, fullname, email, status, datemodified, connection, function(err, data) {});
        //delele usergroupby userid
        userGroupPersistent.deleteUserGroup(id, connection, function(err, data) {

        });
        //create new user group
        for (var i = 0; i < group.length; i++) {
            var userGroupId = uuid.v1();
            userGroupPersistent.createUserGroup(userGroupId, id, group[i], connection, function(err, data) {

            });
        }

        res.jsonp({ "Error": false, "Message": "Success", "data": "data" });

    });

    router.get('/getAllUser', function(req, res) {
        userPersistent.getAllUser(connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getUserById/:id', function(req, res) {
        var id = req.params.id;
        userPersistent.getUserById(id, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });


    router.put('/updateStatusUser', function(req, res) {
        var userID = req.body.userID;
        var status = req.body.status;
        userPersistent.inactive(userID, status, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });

    router.post('/createGroup', function(req, res) {
        var id = uuid.v1();
        var name = req.body.name;
        var description = req.body.description;
        var pages = req.body.pages;

        var datecreated = req.body.datecreated;
        groupPersistent.createGroup(id, name, description, datecreated, connection, function(err, data) {});
        for (var i = 0; i < pages.length; i++) {
            var pageGroupId = uuid.v1();
            pageGroupPesistent.createPageGroup(pageGroupId, pages[i], id, connection, function(err, data) {});
        }
        res.jsonp({ "Error": false, "Message": "Success", "data": "data" });
    });

    router.get('/getGroupById/:id', function(req, res) {
        var id = req.params.id;
        groupPersistent.getGroupById(id, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getGroupByUserId/:userId', function(req, res) {
        var userID = req.params.userId;
        userGroupPersistent.getGroupByUserId(userID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    })

    router.get('/getAllGroup', function(req, res) {
        groupPersistent.getAllGroup(connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.put('/updateGroup/:id', function(req, res) {
        var id = req.params.id;
        var name = req.body.name;
        var description = req.body.description;
        var datemodified = req.body.datemodified;
        var pages = req.body.pages;
        //update info of group
        groupPersistent.updateGroup(id, name, description, datemodified, connection, function(err, data) {

        });

        //delete page by groupid
        pageGroupPesistent.deletePageGroup(id, connection, function(err, data) {

        });

        //create new pagegroup
        for (var i = 0; i < pages.length; i++) {
            var pageGroupId = uuid.v1();
            pageGroupPesistent.createPageGroup(pageGroupId, pages[i], id, connection, function(err, data) {

            });
        }
        res.jsonp({ "Error": false, "Message": "Success", "data": "data" });

    });

    router.get('/getPageByGroupId/:groupId', function(req, res) {
        var groupID = req.params.groupId;
        pageGroupPesistent.getPageByGroupId(groupID, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getUserByEmail/:email', function(req, res) {
        var email = req.params.email;
        userPersistent.getUserByEmail(email, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.get('/getUserByPassword/:password', function(req, res) {
        var password = req.params.password;
        userPersistent.getUserByPassword(password, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.put('/updatePassword', function(req, res) {
        var objpass = req.body;
        userPersistent.updatePassword(objpass, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success" });
            }
        })
    });

    router.post('/sendEmailPassword', function(req, res) {
        var emailData = req.body
        var transporter = nodemailer.createTransport(config.mailerConfig);

        var mailOptions = {
            from: '<rasiarutledge@gmail.com>',
            to: '<' + emailData.email + '>',
            subject: 'Reset your password',
            text: 'Your new password is "' + emailData.newPass + '". Thank you !'
        };

        transporter.sendMail(mailOptions, function(error, info) {

            if (error) {
                res.jsonp({ "Error": true, "Message": "Error sending email", data: info });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", data: info });
            }
        });
    });

    router.post('/createPage', function(req, res) {
        var id = uuid.v1();
        var title = req.body.title;
        var link = req.body.link;
        var icon = req.body.icon;
        var keyLanguage = req.body.keyLanguage;
        var sortOrder = req.body.sortOrder;
        var showInMenu = req.body.showInMenu;
        var status = req.body.status;
        var datecreated = req.body.datecreated;
        pagePersistent.createPage(id, title, link, icon, keyLanguage, sortOrder, showInMenu, status, datecreated, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    });

    router.put('/updateStatusPage', function(req, res) {
        var pageId = req.body.pageId;
        var status = req.body.status;
        pagePersistent.inactive(pageId, status, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    });

    router.put('/showInMenu', function(req, res) {
        var pageId = req.body.pageId;
        var showmenu = req.body.showmenu;
        pagePersistent.showInMenu(pageId, showmenu, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    })

    router.get('/getPageById/:pageId', function(req, res) {
        var pageId = req.params.pageId;
        pagePersistent.getPageById(pageId, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        });
    })

    router.put('/updatePage/:pageId', function(req, res) {
        var pageId = req.params.pageId;
        var title = req.body.title;
        var link = req.body.link;
        var icon = req.body.icon;
        var keyLanguage = req.body.keyLanguage;
        var sortOrder = req.body.sortOrder;
        var showInMenu = req.body.showInMenu;
        var status = req.body.status;
        var datemodified = req.body.datemodified;
        pagePersistent.updatePage(pageId, title, link, icon, keyLanguage, sortOrder, showInMenu, status, datemodified, connection, function(err, data) {
            if (err) {
                res.jsonp({ "Error": true, "Message": "Error executing MySQL query" });
            } else {
                res.jsonp({ "Error": false, "Message": "Success", "data": data });
            }
        })
    })

}

module.exports = REST_ROUTER;
