window.page.currentPosition = {};
window.page.markers = [];

//记录显示过的所有marker
window.page.markerAll = [];

window.page.cursor = {
    x: 0,
    y: 0
};
window.page.MapIcons = {
    'blue': page.baseUrl + "/images/marker/blue_Marker.png",
    'yellow': page.baseUrl + "/images/marker/yellow_Marker.png",
    'darkgreen': page.baseUrl + "/images/marker/darkgreen_Marker.png",
    'pink': page.baseUrl + "/images/marker/pink_Marker.png",
    'c_cold': page.baseUrl + "/images/marker/cold_Marker.png",
    'c_cool': page.baseUrl + "/images/marker/cool_Marker.png",
    'c_hot': page.baseUrl + "/images/marker/hot_Marker.png",
    'c_warm': page.baseUrl + "/images/marker/warm_Marker.png",
    'c_dislike': page.baseUrl + "/images/marker/dislike_Marker.png",
    'c_fave': page.baseUrl + "/images/marker/fave_Marker.png",
    'c_like': page.baseUrl + "/images/marker/like_Marker.png",
    'c_knew': page.baseUrl + "/images/marker/knew_Marker.png"
};

window.page.MapIcons_isLike = [page.baseUrl + "/images/marker/cold_Marker.png", page.baseUrl + "/images/marker/cool_Marker.png", page.baseUrl + "/images/marker/warm_Marker.png", page.baseUrl + "/images/marker/hot_Marker.png", 'space', page.baseUrl + "/images/marker/fave_Marker.png", page.baseUrl + "/images/marker/like_Marker.png", page.baseUrl + "/images/marker/knew_Marker.png", page.baseUrl + "/images/marker/dislike_Marker.png"];
window.onload = function(){
    /***
     * 检查鼠标位置与当前marker的相对情况来适时清除popup。
     * @param {Object} e
     */
    $('#map').mousemove(function(e){
        page.cursor.x = e.pageX;
        page.cursor.y = e.pageY;
        
        if (page.currentMarker) {
            var p = $(page.currentMarker.bn).offset();
            var marker_pos = {
                x: p.left,
                y: p.top
            };
            
            /*
             var r2 = (page.cursor.x - marker_pos.x) * (page.cursor.x - marker_pos.x) + (page.cursor.y - marker_pos.y) * (page.cursor.y - marker_pos.y);
             parent.document.title = r2;
             if (r2>400&&(page.cursor.y - marker_pos.y) > 10) {
             window.clearTimeout(window.pop_map_message_t);
             parent.$('#pop_map_message').hide();
             page.currentMarker=null;
             }
             */
            if ((page.cursor.y - marker_pos.y) > 40) {
                window.clearTimeout(window.pop_map_message_t);
                parent.$('#pop_map_message').hide();
                page.currentMarker = null;
            }
            
        }
    });
    
    if (GBrowserIsCompatible()) {
        g.map = new google.maps.Map(document.getElementById("map"));
        
        //g.map.addControl(new GLargeMapControl());
        g.map.addControl(new GLargeMapControl3D());
        // g.map.addControl(new GMapTypeControl());
        // g.map.addControl(new GScaleControl());
        
        //位于屏幕右下的鸟瞰地图
        //g.map.addControl(new google.maps.OverviewMapControl());
        //g.map.setUIToDefault();
        g.map.enableDoubleClickZoom();
        g.map.enableScrollWheelZoom();
        
        //setMapResolution(g.map,10,17);
        g.geocoder = new GClientGeocoder();
        
        
        GEvent.addListener(g.map, "moveend", function(){
            var center = g.map.getCenter();
            
            //document.getElementById("message").innerHTML = center.toString();
        });
        
        
        var icon = new GIcon();
        //icon.image = "http://labs.google.com/ridefinder/images/mm_20_red.png";
        // icon.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
        icon.image = page.baseUrl + "/images/marker/flag.png";
        icon.shadow = page.baseUrl + "/images/marker/flag.png";
        icon.iconSize = new GSize(12, 20);
        icon.shadowSize = new GSize(22, 20);
        icon.iconAnchor = new GPoint(6, 20);
        icon.infoWindowAnchor = new GPoint(5, 1);
        //icon=null;
        g.getCenterPosition = function(point){
            if (point) {
                g.map.setCenter(point, 6);
                var marker = new GMarker(point, icon);
                g.map.addOverlay(marker);
                var info = "<strong>" + point + "</strong>";
                document.getElementById("info").innerHTML = info;
                marker.openInfoWindowHtml(info);
                marker.__address_info = info;
                /**
                 GEvent.addListener(marker, "click", function(){
                 g.map.setCenter(this.getLatLng());
                 this.openInfoWindowHtml(this.__address_info);
                 document.getElementById("info").innerHTML = info;
                 });
                 ***/
            }
        }
        
        g.setPlaceCenter = function(address){
            g.geocoder.getLocations(addresstxt, function(response){
                if (!response || response.Status.code != 200) {
                    alert("Status Code: " + response.Status.code);
                }
                else {
                    var place = response.Placemark[0];
                    var point = new GLatLng(place.Point.coordinates[1], place.Point.coordinates[0]);
                    var countrycode = place.AddressDetails.Country.CountryNameCode
                    displayTwinsByPlaceName(addresstxt, point, place.AddressDetails.Accuracy, countrycode);
                    return place;
                }
            });
        }
        g.getCoordinatesMap = function(address, level){
            level = level || 10;
            g.geocoder.getLatLng(address, function(point){
                //var point = new GLatLng(px, py);
                if (point) {
                    g.map.setCenter(point, level);
                }
                else {
                    //document.getElementById('mask').style.display = 'block';
                    //document.getElementById('mask_message').innerHTML = "无法解析: " + address;
                
                }
            });
        }
        
        g.getCoordinates = function(address, level){
            level = level || 10;
            g.geocoder.getLatLng(address, function(point){
                //var point = new GLatLng(px, py);
                if (point) {
                    g.map.setCenter(point, level);
                    //var marker = new GMarker(point, icon);
                    /*
                     var marker = new GMarker(point);
                     g.map.addOverlay(marker);
                     var info = "<strong>" + address + "</strong>";
                     document.getElementById("info").innerHTML = info;
                     marker.openInfoWindowHtml(info);
                     marker.__address_info = info;
                     GEvent.addListener(marker, "click", function(){
                     g.map.setCenter(this.getLatLng());
                     this.openInfoWindowHtml(this.__address_info);
                     document.getElementById("info").innerHTML = info;
                     });
                     */
                }
                else {
                    //document.getElementById('mask').style.display = 'block';
                    //document.getElementById('mask_message').innerHTML = "无法解析: " + address;
                
                }
            });
        }
        //g.getCoordinates('montreal');
        //readyForPost();
        //createContextMenu();//创建右键菜单
        
        GEvent.addListener(g.map, "singlerightclick", function(pixel, tile){
            //关于右键菜单
            /*
             clickedPixel = pixel;
             var x = pixel.x;
             var y = pixel.y;
             page.currentPosition.px = pixel.x;
             page.currentPosition.py = pixel.y;
             
             if (x > g.map.getSize().width - 120) {
             x = g.map.getSize().width - 120
             }
             if (y > g.map.getSize().height - 100) {
             y = g.map.getSize().height - 100
             }
             var pos = new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(x, y));
             pos.apply(contextmenu);
             contextmenu.style.visibility = "visible";
             */
            MapClear();
        });
        
        GEvent.addListener(g.map, "click", function(){
            MapClear();
        });
        
        GEvent.addListener(g.map, "zoomstart", function(){
            MapClear();
        });
        GEvent.addListener(g.map, "movestart", function(){
            MapClear();
        });
        GEvent.addListener(g.map, "dragstart", function(){
            MapClear();
        });
        
        GEvent.addListener(g.map, "dblclick", function(){
            MapClear();
        });
        GEvent.addListener(g.map, "dblclick", function(){
            MapClear();
        });
        
		/*
        $("#map").mouseup(function(){
            var geocoder = new GClientGeocoder();
            var bounds = g.map.getBounds();
            var southWest = bounds.getSouthWest();
            var northEast = bounds.getNorthEast();
            
            var checkPoints = [];
            checkPoints.push(southWest, northEast, new GLatLng(southWest.lat(), northEast.lng()), new GLatLng(northEast.lat(), southWest.lng()));
            
            checkPoints.push(g.map.getCenter());
            
            var checkOver = false;
            var checkResults = [];
            var checkMapChange = function(place){
            
            
                var countrycode = place.AddressDetails ? place.AddressDetails.Country.CountryNameCode : 'countrycode';
                
                var province = place.AddressDetails.Country.AdministrativeArea ? place.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName : 'province';
                
                
                checkResults.push({
                    'countrycode': countrycode,
                    'provincecode': province
                });
                if (checkResults.length == checkPoints.length) {
                    checkOver = true;
                }
                if (checkOver) {
                
                    var country = '';
                    var province = '';
                    for (var i = 0; i < checkResults.length; ++i) {
                        country += checkResults[i].countrycode;
                        province += checkResults[i].provincecode;
                    }
                    parent.document.title = country + '--' + province;
                }
            };
            
            
			
            for (var i = 0; i < checkPoints.length; ++i) {
                geocoder.getLocations(checkPoints[i], function(response){
                    if (!response || response.Status.code != 200) {
                    }
                    else {
                        checkMapChange(response.Placemark[0]);
                    }
                });
                
            }
            
        });
        */
    }
    else {
        alert('不支持的浏览器');
    }
}


window.onunload = function(){
    GUnload();
}

function MapClear(){
    clearPopMapInfo();//清除popup 窗口
}

function ShowAddActivity(){
    var point = new GLatLng(page.currentPosition.px, page.currentPosition.py);
    var marker2 = new GMarker(point, {
        draggable: true
    });
    g.map.addOverlay(marker2);
    GEvent.addListener(marker2, "click", function(){
        marker2.openInfoWindowHtml(js_template($('#addAcivitiyTemplate').val(), {
            'px': page.currentPosition.px,
            'py': page.currentPosition.py,
            'title': 'TOM'
        }));
    });
}

function createContextMenu(){
    contextmenu = document.createElement("div");
    contextmenu.style.visibility = "hidden";
    contextmenu.style.background = "#ffffff";
    contextmenu.style.border = "1px solid #8888FF";
    
    contextmenu.innerHTML = "<div onfcus='alert(\"hello\");'><a href='javascript:zoomIn()'><div class='context'>  Zoom in  </div></a>" +
    "<a href='javascript:ShowAddActivity();'><div class='context'>  Add Activity </div></a>" +
    "<a href='javascript:zoomInHere()'><div class='context'>  Zoom in here  </div></a>" +
    "<a href='javascript:zoomOutHere()'><div class='context'>  Zoom out here  </div></a>" +
    "<a href='javascript:centreMapHere()'><div class='context'>  Centre map here  </div></a></div>";
    
    g.map.getContainer().appendChild(contextmenu);
    GEvent.addListener(g.map, "singlerightclick", function(pixel, tile){
        clickedPixel = pixel;
        var x = pixel.x;
        var y = pixel.y;
        page.currentPosition.px = pixel.x;
        page.currentPosition.py = pixel.y;
        
        if (x > g.map.getSize().width - 120) {
            x = g.map.getSize().width - 120
        }
        if (y > g.map.getSize().height - 100) {
            y = g.map.getSize().height - 100
        }
        var pos = new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(x, y));
        pos.apply(contextmenu);
        contextmenu.style.visibility = "visible";
    });
    GEvent.addListener(contextmenu, "click", function(){
        contextmenu.style.visibility = "hidden";
    });
    GEvent.addListener(g.map, "click", function(){
        contextmenu.style.visibility = "hidden";
    });
    
    GEvent.addListener(g.map, "zoomstart", function(){
        contextmenu.style.visibility = "hidden";
    });
    GEvent.addListener(g.map, "movestart", function(){
        contextmenu.style.visibility = "hidden";
    });
    GEvent.addListener(g.map, "dragstart", function(){
        contextmenu.style.visibility = "hidden";
    });
    
    GEvent.addListener(g.map, "dblclick", function(){
        contextmenu.style.visibility = "hidden";
    });
}

function zoomIn(){
    g.map.zoomIn();
    contextmenu.style.visibility = "hidden";
}

function zoomOut(){
    g.map.zoomOut();
    contextmenu.style.visibility = "hidden";
}

function zoomInHere(){
    var point = g.map.fromContainerPixelToLatLng(clickedPixel)
    g.map.zoomIn(point, true);
    contextmenu.style.visibility = "hidden";
}

function zoomOutHere(){
    var point = g.map.fromContainerPixelToLatLng(clickedPixel)
    g.map.setCenter(point, map.getZoom() - 1);
    contextmenu.style.visibility = "hidden";
}

function centreMapHere(){
    var point = g.map.fromContainerPixelToLatLng(clickedPixel)
    g.map.setCenter(point);
    contextmenu.style.visibility = "hidden";
}

function mapInfo(){
    alert('mapINfo');
}


function addActivity(positionX, positionY){
    var tel = $('#actphone').val();
    var address = $('#actaddress').val();
    var site = $('#actsite').val();
    var des = $('#actdes').val();
    var cate = $('#actcate option:selected').val();
    var title = $('#actitle').val();
    
    $.getJSON(page.baseUrl + '/activityscape/save', {
        title: title,
        des: des,
        category: cate,
        px: positionX,
        py: positionY,
        telphone: tel,
        site: site,
        address: address
    }, function(orgjson){
    
    });
    
    alert('save success!')
}


function getMarker(filter){
    if (filter.position) {
        for (var i = 0; i < page.markers.length; ++i) {
            var pos = page.markers[i].getLatLng();
            var s = pos.lat() + '-' + pos.lng();
            var t = filter.position.lat() + '-' + filter.position.lng();
            if (s == t) {
                return page.markers[i];
            }
        }
    }
    
    if (filter.actid) {
        for (var i = 0; i < page.markers.length; ++i) {
            if (page.markers[i].activity.id == filter.actid) {
                return page.markers[i];
            }
        }
    }
    return null;
}

function setActivty(activity){
    if (activity.positionx) {
        var point = new GLatLng(parseFloat(activity.positionx), parseFloat(activity.positiony));
        if (point) {
            g.map.setCenter(point, 14);
            var marker = getMarker({
                position: point
            });
            
            
            if (marker != null) {
                //marker.clickShow();
                //marker.setImage(page.MapIcons['darkgreen']);
            }
            
        }
    }
    else {
        g.geocoder.getLatLng(activity.city, function(point){
            if (point) {
                g.map.setCenter(point, 10);
                var marker = new GMarker(point);
                g.map.addOverlay(marker);
                var info = "<strong>" + address + "</strong>";
                document.getElementById("info").innerHTML = info;
                
                /*
                 marker.__address_info = info;
                 var click_info = "<table><tr><td colspan=2 align='center'><h3>Activityinfo</h3></td></tr><tr><td>City</td><td>" + activity.city + "</td></tr><tr><td>Address</td><td>" + activity.address + "</td></tr><tr><td>Details</td><td>Hotel for all over the world</td></tr><tr><td>Telphone</td><td>" + activity.telephone + "</td></tr><tr><td>Site</td><td>" + activity.site + "</td></tr></table>";
                 GEvent.addListener(marker, "click", function(){
                 g.map.setCenter(this.getLatLng());
                 this.openInfoWindowHtml(click_info);
                 //this.openInfoWindowHtml(this.__address_info);
                 document.getElementById("info").innerHTML = info;
                 });
                 marker.openInfoWindowHtml(click_info);
                 */
            }
            else {
                //document.getElementById('mask').style.display = 'block';
                //document.getElementById('mask_message').innerHTML = "无法解析: " + address;
            
            }
        });
    }
}

function print_info(o){
    var s = "";
    for (var i in o) {
        s += '[' + i + ']=' + o[i] + '\n';
    }
    return s;
}

//隐藏地图的pop窗口
function clearPopMapInfo(){
    if (parent.window.pop_map_focus) {
        window.clearTimeout(window.pop_map_message_t);
        return;
    }
    parent.$('#pop_map_message').hide();
}

function showActivityList(){

    var activitys = parent.page.activitys;
    
    if (activitys == null) {
        g.getCoordinatesMap('Wellness', 1);
        return;
    }
    var b = new google.maps.LatLngBounds();
    var icon = new GIcon();
    //icon.image = "http://labs.google.com/ridefinder/images/mm_20_red.png";
    // icon.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
    icon.image = page.baseUrl + "/images/marker/flag.png";
    icon.shadow = page.baseUrl + "/images/marker/flag-shadow.png";
    icon.iconSize = new GSize(12, 20);
    icon.shadowSize = new GSize(22, 20);
    icon.iconAnchor = new GPoint(6, 20);
    icon.infoWindowAnchor = new GPoint(5, 1);
    for (var i = 0; i < activitys.length; i++) {
    
        var activity = activitys[i];
        
        var point = new GLatLng(parseFloat(activity.positionx), parseFloat(activity.positiony));
        b.extend(point);
        
        if (page.markerAll[activity.id]) {
            continue;
        }//如果已经显示了就不再加载
        var tinyIcon = new GIcon(G_DEFAULT_ICON);
        var markerOptions = {
            icon: tinyIcon
        };
        var marker = new GMarker(point, markerOptions);
        marker.activity = activity;
        g.map.addOverlay(marker);
        if (activity.is_like && (Math.abs(parseInt(activity.is_like)) < 5)) {
            var t = parseInt(activity.is_like) + 4;
            if (t != 4) {
                marker.setImage(window.page.MapIcons_isLike[t]);
            }
        }
        /*
         marker.clickShow = function(){
         this.openInfoWindowHtml(js_template($('#activityInfoPop').val(), {
         'activity': this.activity
         }));
         }*/
        GEvent.addListener(marker, "click", function(){
            //marker.openInfoWindowHtml("<table><tr><td colspan=2 align='center'><h3>Activityinfo</h3></td></tr><tr><td>City</td><td>Montreal</td></tr><tr><td>Address</td><td>Montreal</td></tr><tr><td>Details</td><td>Hotel for all over the world</td></tr><tr><td>Telphone</td><td>64575676575</td></tr><tr><td>Site</td><td>www.google.com</td></tr></table>");
            parent.click_activity_list(this.activity.id);
        });
        
        GEvent.addListener(marker, "mouseover", function(){
        
            //alert(this.bn.nodeName);
            if (window.pop_map_message_t) {
                clearTimeout(window.pop_map_message_t);
            }
            //this.setImage(page.MapIcons['darkgreen']);
            /*
             this.openInfoWindowHtml(js_template($('#activityInfoPop').val(), {
             'activity': this.activity
             }));
             */
            $(this.bn).css({
                border: 'solid green 1px'
            });
            var pos = parent.$('#map_iframe').offset();
            
            //var marker_pos=g.map.fromLatLngToDivPixel(this.getLatLng());
            var p = $(this.bn).offset();
            var marker_pos = {
                x: p.left,
                y: p.top
            };
            
            //var marker_pos=g.map.getCurrentMapType().getProjection().fromLatLngToPixel(this.getLatLng(),g.map.getZoom());
            //alert(marker_pos);
            parent.popMapMessage(js_template($('#activityInfoPop').val(), {
                'activity': this.activity
            }), pos.left + marker_pos.x, pos.top + marker_pos.y);
            
            window.page.currentMarker = this;
        });
        
        GEvent.addListener(marker, "mouseout", function(){
            //this.setImage(page.MapIcons['pink']);
            $(this.bn).css({
                border: 'none'
            });
            window.pop_map_message_t = setTimeout(function(){
                clearPopMapInfo();
            }, 3000);
            
        });
        page.markers.push(marker);
        page.markerAll[marker.activity.id] = true;
    }
    g.map.setCenter(b.getCenter(), Math.min(g.map.getBoundsZoomLevel(b), 18));
}


function change_islike(actid, is_like_value, is_like_marker, obj){
    $('div.activity_Rating_button_choosed').removeClass('activity_Rating_button_choosed');
    $(obj).addClass('activity_Rating_button_choosed');
    $.getJSON(page.baseUrl + '/activityscape/likeactivity', {
        actid: actid,
        is_like: is_like_value
    }, function(orgjson){
        var marker = getMarker({
            actid: actid
        });
        marker.setImage(page.MapIcons['c_' + is_like_marker]);
    });
}

function change_icon(actid, is_like_marker){
    var marker = getMarker({
        actid: actid
    });
    marker.setImage(page.MapIcons['c_' + is_like_marker]);
}

function setCenter(x, y){
    g.getCenterPosition((new GLatLng(parseFloat(x), parseFloat(y))));
}


function setAddress(address, level){
    g.getCoordinates(address, level);
}
