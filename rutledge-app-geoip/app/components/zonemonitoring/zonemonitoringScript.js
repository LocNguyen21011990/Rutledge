'use strict'
var scope = angular.element(document.getElementById('content')).scope();
var factor = 1;
var trackingTimer = setInterval(function() {
    canvas.getObjects().map(function(o) {
        if (o.name == "groupdot") {
            o.set("left", getRandomInt(o.roomleft, o.limitleft));
            o.set("top", getRandomInt(o.roomtop, o.limittop));
            o.setCoords();
        }
    });
    canvas.renderAll();
}, 1000);
var getRandomInt = fabric.util.getRandomInt;
var img, ObjArray = [];
var canvas = new fabric.Canvas('canvas', {
    HOVER_CURSOR: 'pointer'
});
canvas.on({
    'object:selected': loadObject
});

var oldWidthCanvas = 0;
var oldHeightCanvas = 0;

function handleResize() {
    var canvasparent = document.getElementById("canvasParent");
    var w = canvasparent.offsetWidth;
    var h = 500;
    canvas.setWidth(w);
    canvas.setHeight(h);
    factor = canvas.width / oldWidthCanvas;
    zoomIt(factor);
    oldWidthCanvas = canvas.width;
}


function zoomIt(factor) {
    // canvas.setHeight(canvas.getHeight() * factor);
    // canvas.setWidth(canvas.getWidth() * factor);
    if (canvas.backgroundImage) {
        var bi = canvas.backgroundImage;
        bi.width = bi.width * factor;
        bi.height = bi.height * factor;
    }
    var objects = canvas.getObjects();
    if (trackingTimer) {
        clearInterval(trackingTimer);
    }
    for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;

        var tempScaleX = scaleX * factor;
        var tempScaleY = scaleY * factor;
        var tempLeft = left * factor;
        var tempTop = top * factor;

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        if (objects[i].name == "groupdot") {
            var roomleft = objects[i].roomleft * factor;
            var limitleft = objects[i].limitleft * factor;
            var roomtop = objects[i].roomtop * factor;
            var limittop = objects[i].limittop * factor;
            objects[i].roomleft = roomleft;
            objects[i].roomtop = roomtop;
            objects[i].limitleft = limitleft;
            objects[i].limittop = limittop;
            objects[i].set("left", getRandomInt(roomleft, limitleft));
            objects[i].set("top", getRandomInt(roomtop, limittop));
        }
        objects[i].setCoords();

    }
    trackingTimer = setInterval(function() {
        canvas.getObjects().map(function(o) {
            if (o.name == "groupdot") {
                o.set("left", getRandomInt(o.roomleft, o.limitleft));
                o.set("top", getRandomInt(o.roomtop, o.limittop));
                o.setCoords();
            }
        });
        canvas.renderAll();
    }, 1000);
    canvas.renderAll();
    canvas.calcOffset();
}


window.addEventListener("resize", handleResize);

function init() {
    var canvasparent = document.getElementById("canvasParent");
    var w = canvasparent.offsetWidth;
    var h = 500;
    canvas.setWidth(w);
    canvas.setHeight(h);
    oldWidthCanvas = canvas.getWidth();
    oldHeightCanvas = canvas.getHeight();

    setTimeout(function () {
      $('#city').val(scope.cityId);
      $('#drill').val(scope.drillId);
      $('#zone').val(scope.zoneId);
      loadZone(1);
    }, 2000)
}
init();

function clearCanvas() {
    canvas.clear();
    canvas.setBackgroundImage();
    canvas.renderAll();
}

function loadObject() {
    var obj = canvas.getActiveObject();
    var roomId = obj._objects[1].id;
    window.openModal(roomId);
}

function reload(zoneImageCode) {
    img = zoneImageCode.zoneImage;
    var PolaroidPhoto = fabric.util.createClass(fabric.Object, fabric.Observable, {
        H_PADDING: 0,
        V_PADDING: 0,
        originX: 'left',
        originY: 'top',
        initialize: function(src, options) {
            this.callSuper('initialize', options);
            this.image = new Image();
            this.image.src = src;
            this.image.onload = (function() {
                this.width = this.image.width * Math.min(canvas.width / this.image.width, canvas.height / this.image.height);
                this.height = this.image.height * Math.min(canvas.width / this.image.width, canvas.height / this.image.height);
                this.loaded = true;
                this.setCoords();
                this.fire('image:loaded');
            }).bind(this);
        },
        _render: function(ctx) {
            if (this.loaded) {
                var canvas = ctx.canvas;
                var hRatio = canvas.width / this.image.width;
                var vRatio = canvas.height / this.image.height;
                var ratio = Math.min(hRatio, vRatio);
                ctx.fillStyle = '#fff';
                ctx.fillRect(-(this.width / 2) - this.H_PADDING, -(this.height / 2) - this.H_PADDING,
                    this.width + this.H_PADDING * 2,
                    this.height + this.V_PADDING * 2);
                ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.image.width * ratio, this.image.height * ratio);
            }
        }
    });

    var hRatio = canvas.width / 747;
    var vRatio = canvas.height / 378;
    var ratio = Math.min(hRatio, vRatio);
    var photo = new PolaroidPhoto(img, {
        selectable: false
    });

    photo.on('image:loaded', canvas.renderAll.bind(canvas));
    photo.drawBorders = photo.drawCorners = function() {
        return this };
    canvas.add(photo);
}

function makeHandler(arg) {
    return function(e) {
        if (e.target) {
            e.target.animate('angle', arg, {
                duration: 100,
                onChange: canvas.renderAll.bind(canvas)
            });
        }
    };
}




//Load zone
function loadZone(isParam) {
    var host = angular.element(document.getElementById('content')).scope().host;
    var zoneId = '';
    if (isParam == 1) {
      if( scope.paramzoneID != undefined) {
        zoneId = scope.paramzoneID;
      }
    } else {
        zoneId = document.getElementById('zone').value;
    }
    canvas.clear();
    $.get(host + "/api/loadShapes", {
            option: zoneId
        },
        function(data, status) {
            if (data.rows.length == 0) {
                return;
            }
            var shapes = JSON.parse(data.rows[0].baseCode);
            //Load zone map as a background canvas
            reload(shapes[0]);
            var arrRooms = [];
            for (var i = shapes.length - 1; i >= 1; i--) {
                arrRooms.push(shapes[i]);
            }
            showHumanPos(host, arrRooms);
        });

    var socket = io();
    socket.on('data', function(msg) {
        var msg = JSON.parse(msg);
        ObjArray = canvas.getObjects();
        ObjArray.map(function(o) {
            if (o.name != "groupdot" && o.get('type') == "group") {
                if (o._objects[1].id == msg.roomid) {
                    o._objects[2].text = msg.staffnumber + '';
                    viewHumanPos(msg.roomid, msg.staffnumber + '');
                }
            }
        });
        canvas.renderAll();
    });
};

//Called when load zone onto canvas
var showHumanPos = function(host, arrRooms) {
    if (arrRooms.length > 0) {
        $.get(host + '/api/countHumanInRoom/' + arrRooms[0].id).success(function(data) {
            var hRatio = canvas.width / 747;
            var vRatio = canvas.height / 378;
            var ratio = Math.min(hRatio, vRatio);

            var room = new fabric.Text(arrRooms[0].roomName, {
                fontFamily: 'arial black',
                fontSize: 15,
                top: (arrRooms[0].top + 4) * ratio,
                left: (arrRooms[0].left + 10) * ratio
            });

            creategroupdot(arrRooms[0]);

            var staffnumber = new fabric.Text(data.data[0].staffnumber + '', {
                fontFamily: 'arial black',
                fontSize: 30,
                top: (arrRooms[0].top) * ratio,
                left: (arrRooms[0].left + (arrRooms[0].width * arrRooms[0].scaleX) - 30) * ratio
            });



            var rect = new fabric.Rect({
                top: arrRooms[0].top * ratio,
                left: arrRooms[0].left * ratio,
                width: arrRooms[0].width * ratio,
                height: arrRooms[0].height * ratio,
                stroke: arrRooms[0].stroke,
                strokeWidth: arrRooms[0].strokeWidth,
                fill: arrRooms[0].fill,
                id: arrRooms[0].id,
                name: arrRooms[0].roomName,
                scaleX: arrRooms[0].scaleX,
                scaleY: arrRooms[0].scaleY,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true
            });

            var group = new fabric.Group([room, rect, staffnumber]);
            canvas.add(group);
            arrRooms.shift();
            showHumanPos(host, arrRooms);
        });
    }
}

function clearDot() {
    if (canvas.getObjects()) {
        var arrCircleObjs = [];
        canvas.getObjects().map(function(o) {
            if (o.name == "groupdot" && o.roomid == roomid) {
                arrCircleObjs.push(o);
            }
        })
        arrCircleObjs.forEach(function(element, index) {
            canvas.remove(element);
        });
    };
}
//Function called when listening socket.io
function viewHumanPos(roomid, staffnumber) {
    var host = angular.element(document.getElementById('content')).scope().host;
    var zoneId = document.getElementById('zone').value;

    clearDot();

    if (trackingTimer) {
        clearInterval(trackingTimer);
    }
    $.get(host + "/api/loadShapes", {
            option: zoneId
        },
        function(data, status) {
            if (data.rows.length == 0) {
                return;
            }
            var shapes = JSON.parse(data.rows[0].baseCode);
            //Load zone map as a background canvas
            reload(shapes[0]);

            for (var i = shapes.length - 1; i >= 1; i--) {
                if (shapes[i].id == roomid) {
                    creategroupdot(shapes[i]);
                }
            }
            trackingTimer = setInterval(function() {
                canvas.getObjects().map(function(o) {
                    if (o.name == "groupdot") {
                        o.set("left", getRandomInt(o.roomleft, o.limitleft));
                        o.set("top", getRandomInt(o.roomtop, o.limittop));
                        o.setCoords();
                    }
                });
                canvas.renderAll();
            }, 1000);
        });
}

function creategroupdot(obj) {
    var hRatio = canvas.width / 747;
    var vRatio = canvas.height / 378;
    var ratio = Math.min(hRatio, vRatio);
    var host = angular.element(document.getElementById('content')).scope().host;
    $.get(host + '/api/getUserInfoInRoom/' + obj.id).success(function(data) {
        if (data.data.length > 0) {
            data.data.forEach(function(element, index) {
                var dot = new fabric.Circle({
                    left: getRandomInt(obj.left, obj.left + (obj.width * obj.scaleX)) * ratio,
                    top: getRandomInt(obj.top, obj.left + (obj.height * obj.scaleY)) * ratio,
                    radius: 3 * ratio,
                    fill: '#' + Math.random().toString(16).slice(2, 8),
                    roomleft: obj.left * ratio,
                    roomtop: obj.top * ratio,
                    limitleft: (obj.left + (obj.width * obj.scaleX)) * ratio,
                    limittop: (obj.left + (obj.height * obj.scaleY)) * ratio,
                    roomID: obj.id,
                    roomname: obj.roomName
                });

                var textdot = new fabric.Text(element.username, {
                    fontFamily: 'arial black',
                    fontSize: 6,
                    top: dot.top,
                    left: (dot.left + 8)
                });

                var groupdot = new fabric.Group([dot, textdot], {
                    name: 'groupdot',
                    roomid: obj.id,
                    left: getRandomInt(obj.left, obj.left + (obj.width * obj.scaleX)) * ratio,
                    top: getRandomInt(obj.top, obj.top + (obj.height * obj.scaleY)) * ratio,
                    roomleft: obj.left * ratio,
                    roomtop: obj.top * ratio,
                    limitleft: (obj.left + (obj.width * obj.scaleX)) * ratio,
                    limittop: (obj.top + (obj.height * obj.scaleY)) * ratio,
                });
                canvas.add(groupdot);
            });
        }
    });
}
