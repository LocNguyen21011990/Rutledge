'use strict'
var scope = angular.element(document.getElementById('content')).scope();
var img, ObjArray = [],
    zoneImageCode;
var canvas = new fabric.Canvas('canvas', {
    HOVER_CURSOR: 'pointer'
});
canvas.on({
    'mouse:down': makeHandler('0'),
    'mouse:up': makeHandler('0'),
    'object:selected': objectSelected,
    'selection:cleared': objectUnselect,
    'object:scaling': objectScaling
});

function loadNewZone() {
    canvas.clear();
    var zoneValue = document.getElementById('zone').value.split(",");
    img = zoneValue[1];
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

    var photo = new PolaroidPhoto(img, {
        selectable: false
    });

    photo.on('image:loaded', canvas.renderAll.bind(canvas));
    photo.drawBorders = photo.drawCorners = function() {
        return this };
    canvas.add(photo);
}

function checkDDRooms() {
    var ddRooms = $('#room');

    ddRooms.children().each(function() {
        var opt = $(this);
        canvas.getObjects().map(function(o) {
          if(o._objects != undefined) {
            if(opt.val() == o._objects[1].id) {
              opt.attr('disabled', 'disabled');
            }
          }
        })
    })
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

function loadImage(e) {
    var host = angular.element(document.getElementById('content')).scope().host;
    var zoneId = document.getElementById('zone').value.split(",");
    canvas.clear();
    $.get(host + "/api/loadShapes", {
            option: zoneId[0]
        },
        function(data, status) {
            if (null == data.rows || data.rows.length == 0) {
                loadNewZone();
            } else {
                var shapes = JSON.parse(data.rows[0].baseCode);
                //Load zone map as a background canvas
                reload(shapes[0]);
                for (var i = shapes.length - 1; i >= 1; i--) {
                    var room = new fabric.Text(shapes[i].roomName, {
                        fontFamily: 'arial black',
                        fontSize: 10,
                        top: shapes[i].top + 4,
                        left: shapes[i].left + 10
                    });
                    var rect = new fabric.Rect({
                        top: shapes[i].top,
                        left: shapes[i].left,
                        width: shapes[i].width,
                        height: shapes[i].height,
                        stroke: shapes[i].stroke,
                        strokeWidth: shapes[i].strokeWidth,
                        fill: shapes[i].fill,
                        id: shapes[i].id,
                        name: shapes[i].roomName,
                        scaleX: shapes[i].scaleX,
                        scaleY: shapes[i].scaleY
                    });

                    var group = new fabric.Group([room, rect]);
                    canvas.add(group);
                }
            }
        });
    setTimeout(checkDDRooms, 1000);
}


function objectSelected() {
    var activeObject = canvas.getActiveObject();
    scope.isShowBtnRoom = true;
    scope.$apply();
}

function objectUnselect() {
    scope.isShowBtnRoom = false;
    scope.$apply();
}

function objectScaling() {
  var activeObject = canvas.getActiveObject();
  var textObject   = activeObject._objects[0];
  var rectObject   = activeObject._objects[1];

  var newHeight = activeObject.getHeight();
  var newWidth = activeObject.getWidth();
  var scaleY = textObject.beginHeight / newHeight;
  var scaleX = textObject.beginWidth/ newWidth;
  var fontLabel = 10 * (1/scaleY);

  textObject.set('fontSize', fontLabel);
  textObject.set('scaleX', scaleX);
  textObject.set('scaleY', scaleY);

  textObject.setCoords();
  activeObject.setCoords();
  canvas.renderAll();
}

var addShape = function() {
    var roomId = document.getElementById('room').value;
    var roomName = $("#room option:selected").text();
    ObjArray = canvas.getObjects();
    for (var i = ObjArray.length - 1; i >= 1; i--) {
        if (ObjArray[i]._objects[1].id == roomId) {
            alert("This room is added");
            return;
        }
    };
    if (null == roomId || roomId.trim() == '' || roomName.trim() == '') {
        alert("All room are added");
        return;
    }

    $("#room option:selected").attr('disabled', 'disabled');

    var room = new fabric.Text(roomName, {
        fontFamily: 'arial black',
        fontSize: 10,
        top: 10,
        left: 635,
        beginWidth: 60,
        beginHeight: 60
    });

    var rect = new fabric.Rect({
        top: 10,
        left: 630,
        width: 60,
        height: 60,
        stroke: '#000000',
        strokeWidth: 1,
        fill: 'rgba(0,0,0,0.0)',
        id: roomId
    });


    var group = new fabric.Group([room, rect]);
    canvas.add(group);
}

function save() {
    var host = angular.element(document.getElementById('content')).scope().host;
    var zoneValue = document.getElementById('zone').value.split(",");
    var zoneId = zoneValue[0];
    ObjArray = canvas.getObjects();
    var shapes = [];
    var zone = {
        zoneImage: zoneValue[1],
        top: ObjArray[0].top,
        left: ObjArray[0].left
    };
    shapes.push(zone);
    for (var i = ObjArray.length - 1; i >= 1; i--) {
        var shape = {
            top: ObjArray[i].top,
            left: ObjArray[i].left,
            width: ObjArray[i].width,
            height: ObjArray[i].height,
            stroke: ObjArray[i]._objects[1].stroke,
            strokeWidth: ObjArray[i]._objects[1].strokeWidth,
            fill: ObjArray[i]._objects[1].fill,
            id: ObjArray[i]._objects[1].id,
            scaleX: ObjArray[i].scaleX,
            scaleY: ObjArray[i].scaleY,
            roomName: ObjArray[i]._objects[0].text
        };
        shapes.push(shape);
    }
    $.post(host + "/api/saveShapes", {
            baseCode: JSON.stringify(shapes),
            zoneId: zoneId
        },
        function(data, status) {
            // alert("save:" + status);
        });
};
//TODO
var removeShapes = function() {
    var activeObject = canvas.getActiveObject();
    var objectid = activeObject._objects[1].id;
    canvas.remove(activeObject);
    $('#room').children().each(function() {
      if($(this).val() == objectid && $(this).attr('disabled') == 'disabled') {
        $(this).attr('disabled', false);
      }
    })
    $('#room').val('');
}

function reload(zoneImageCode) {
    var myDataURL = zoneImageCode;
    var img = new Image();
    img.onload = function() {
        // this is syncronous
        var f_img = new fabric.Image(img);
        canvas.setBackgroundImage(f_img);
        canvas.renderAll();
    };
    img.src = myDataURL;
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

function changeRoom() {
  if($('#room').val() != '') {
    scope.isShowBtnRoom = true;
  }
  else {
    scope.isShowBtnRoom = false;
  }
  scope.$apply();
}