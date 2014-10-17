if (window.twinium == null) {
	window.twinium = {};
}

twinium.baseUrl = window.baseUrl;//记录zendframework的baseUrl

/**
 * 负责map上相关操作
 */
twinium.map = {
	currentPosition:{}, //当前位置
	activitys:[], //当前map上的 activitys
	markers:[],
	activitymarkersHash:{},
	currentMarker:{},//当前选中或mouseover鼠标触发的marker对象
	currentMarkerOption:{}, //当前marker附加信息如
	markerAll:[], //记录显示过的所有marker
	lastBounds:null,
	currentBounds:null
};

twinium.map.Continents = {
	"AF": {
		"name": "Africa",
		"center": [1.054628, 29.53125],
		"countries": ["DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CD", "CG", "CI", "DJ", "EG", "GQ", "ER", "ET", "GA", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "YT", "MA", "MZ", "NA", "NE", "NG", "RE", "RW", "SH", "ST", "SN", "SC", "SL", "SO", "ZA", "SD", "SZ", "TZ", "TG", "TN", "UG", "EH", "ZM", "ZW"]
	},
	
	"AS": {
		"name": "Asia",
		"center": [30.448674, 125.15625],
		"countries": ["AF", "AM", "AZ", "BH", "BD", "BT", "IO", "BN", "KH", "CN", "CX", "CC", "CY", "GE", "HK", "IN", "ID", "IR", "IQ", "IL", "JP", "JO", "KZ", "KP", "KR", "KW", "KG", "LA", "LB", "MO", "MY", "MV", "MN", "MM", "NP", "OM", "PK", "PS", "PH", "QA", "SA", "SG", "LK", "SY", "TW", "TJ", "TH", "TL", "TR", "TM", "AE", "UZ", "VN", "YE"]
	},
	
	"EU": {
		"name": "Europe",
		"center": [45.521744, 21.972656],
		"countries": ["AX", "AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CZ", "DK", "EE", "FO", "FI", "FR", "DE", "GI", "GR", "GG", "VA", "HU", "IS", "IE", "IM", "IT", "JE", "LV", "LI", "LT", "LU", "MK", "MT", "MD", "MC", "ME", "NL", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SJ", "SE", "CH", "UA", "GB"]
	},
	
	"NA": {
		"name": "North America",
		"center": [47.694974, -94.042969],
		"countries": ["AI", "AG", "AW", "BS", "BB", "BZ", "BM", "VG", "CA", "KY", "CR", "CU", "DM", "DO", "SV", "GL", "GD", "GP", "GT", "HT", "HN", "JM", "MQ", "MX", "MS", "AN", "NI", "PA", "PR", "BL", "KN", "LC", "MF", "PM", "VC", "TT", "TC", "US", "VI"]
	},
	
	"SA": {
		"name": "South America",
		"center": [-4.039618, -65.039062],
		"countries": ["AR", "BO", "BR", "CL", "CO", "EC", "FK", "GF", "GY", "PY", "PE", "SR", "UY", "VE"]
	},
	
	"OC": {
		"name": "Oceania",
		"center": [-8.05923, 142.734375],
		"countries": ["AS", "AU", "CK", "FJ", "PF", "GU", "KI", "MH", "FM", "NR", "NC", "NZ", "NU", "NF", "MP", "PW", "PG", "PN", "WS", "SB", "TK", "TO", "TV", "UM", "VU", "WF"]
	},
	
	"AN": {
		"name": "Antarctica",
		"center": [-78.836065, 39.375],
		"countries": ["AQ", "BV", "TF", "HM", "GS"]
	}
}
twinium.map.Continents.getContinentInfo=function(countrycode)
{
  var continentInfo={};
  countrycode=$.trim(countrycode);
  
  var continentlist=['AF','AS','EU','NA','SA','OC','AN'];
  for(var i=0;i< continentlist.length;i++)
  {  
    var continent=twinium.map.Continents[continentlist[i]];
	if(jQuery.inArray(countrycode,continent["countries"])!=-1)
	{
	 continentInfo.continentName=continent["name"];
	 continentInfo.lat=continent["center"][0];
	 continentInfo.lng=continent["center"][1];
	 return continentInfo;
	}
  }	
  return "";
}

twinium.map.Continents.getContinent=function(countrycode)
{
  var continentInfo={};
  countrycode=$.trim(countrycode);
  var continentlist=['AF','AS','EU','NA','SA','OC','AN'];
  for(var i=0;i< continentlist.length;i++)
  {  
    var continent=twinium.map.Continents[continentlist[i]];
	if(jQuery.inArray(countrycode,continent["countries"])!=-1)
	{
	 return continentlist[i];
	}
  }	
  return "";
}

/*******************************************************************************
 * 地图的图标图片
 */
twinium.map.MapIcons = {
	'blue' : twinium.baseUrl + "/images/marker/blue_Marker.png",
	'yellow' : twinium.baseUrl + "/images/marker/yellow_Marker.png",
	'darkgreen' : twinium.baseUrl + "/images/marker/darkgreen_Marker.png",
	'pink' : twinium.baseUrl + "/images/marker/pink_Marker.png",
	'pink-dot' : twinium.baseUrl + "/images/marker/pink-dot.png",
	'c_cold' : twinium.baseUrl + "/images/marker/cold_Marker.png",
	'c_cool' : twinium.baseUrl + "/images/marker/cool_Marker.png",
	'c_hot' : twinium.baseUrl + "/images/marker/hot_Marker.png",
	'c_warm' : twinium.baseUrl + "/images/marker/warm_Marker.png",
	'c_dislike' : twinium.baseUrl + "/images/marker/dislike_Marker.png",
	'c_fave' : twinium.baseUrl + "/images/marker/fave_Marker.png",
	'c_like' : twinium.baseUrl + "/images/marker/like_Marker.png",
	'c_knew' : twinium.baseUrl + "/images/marker/knew_Marker.png"
};

twinium.map.MapIcons_isLike = [
        twinium.baseUrl + "/images/marker/flag.png",
		twinium.baseUrl + "/images/marker/cold_Marker.png",
		twinium.baseUrl + "/images/marker/cool_Marker.png",
		twinium.baseUrl + "/images/marker/warm_Marker.png",
		twinium.baseUrl + "/images/marker/hot_Marker.png", 
		twinium.baseUrl + "/images/marker/fave_Marker.png",
		twinium.baseUrl + "/images/marker/like_Marker.png",
		twinium.baseUrl + "/images/marker/knew_Marker.png",
		twinium.baseUrl + "/images/marker/dislike_Marker.png"];

twinium.map.MapIcons_aggregateLike = function(meLike, twinLike) {
	switch(meLike) {
	case 3:
		meUrl = "love_";
		break;
	case 2:
		meUrl = "like_";
		break;
	case 1:
		meUrl = "neutral_";
		break;
	case 0:
		meUrl = "neutral_";
		break;
	}
}
twinium.map.init = function(mapID) {
	// 已指定dom节点为map容器
	var myOptions = {
		zoom : 1,
		//center : new google.maps.LatLng(34.16031654673677, -11.953125),
		navigationControl : true,
		navigationControlOptions : {
			style : google.maps.NavigationControlStyle.DEFAULT
		},
		mapTypeControl : false,
		scaleControl : true,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		scrollwheel : true
	}
	twinium.map.gmap = new google.maps.Map(document.getElementById(mapID),
			myOptions);

	/***
	 * twinium 地图默认的中心，当显示世界地图时用到。
	 */
	twinium.map.defaultCenter=new google.maps.LatLng(34.16031654673677, -11.953125);
	/**
	 * map对应的div的Jquery对象 即$('#'+mapID)
	 */
	twinium.map.mapdiv = $('#' + mapID);

	/**
	 * map对应的div的ID 即$('#'+mapID)
	 */
	twinium.map.mapID = mapID;

	// setMapResolution(twinium.gmap,10,17);
	// 地图服务，根据位置信息返回地理信息
	twinium.map.geocoder = new google.maps.Geocoder();

	/***************************************************************************
	 *
	 *
	 * /***************************************************************************
	 *
	 * 当地图边界发生变化后
	 */
	twinium.map.currentBounds=null;
	
}
/*******************************************************************************
 * 按指定level设置某个地点为中心
 *
 * @param {Object|String}
 *            address
 * @param {Number}
 *            level
 */
twinium.map.setAddressLevel = function(address, level) {
	level = level || 10;

	if (twinium.map.setAddressLevel.cache[address]) {
		twinium.map.gmap.setCenter(twinium.map.setAddressLevel.cache[address],
				level);
		return;
	}
	twinium.map.geocoder.geocode({
		'address' : address,
		'language' : 'EN'
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var resultObj=results[0];
			twinium.map.setAddressLevel.cache[address] = resultObj;

			twinium.map.gmap.setOptions({
				center : results[0].geometry.location,
				zoom : level
			});
	       }


	});
}
twinium.map.setAddressLevel.cache = {};
twinium.map.setAddressLevel.cityinfo = {};

/**
 * {type:activity,activity:activityobj},
 * {type:twin,twin:twinobj},
 * {type:marker,marker:markerobj}
 * callback函数不带参数，可用this对象{'GeocoderResult':标准GeocoderResult 对象,'GeocoderResultInfo'：经过处理解析出的地址信息对象}，
 * 后者字段为	{cityname;countrycode，provincename，provincecode，address,lat,lng,continent，countryname}
 * @param {Object} params
 * @param {Object}
 */

twinium.map.geocode=function(param,callback){
    var location = null;
    switch (param.type) {
        case 'activity':
            location = new google.maps.LatLng(parseFloat(param.activity.geolat), parseFloat(param.activity.geolong));
            break;
        case 'twin':
            location = new google.maps.LatLng(parseFloat(param.twin.x), parseFloat(param.twin.y));
            break;
        case 'marker':
            location = new google.maps.LatLng(param.marker.getPostion());
            break;
        default:
            break;
    }

    if (location == null) {
        var georequest = param;//若无location信息则按照原始参数发出请求
    }
    else {
		//有location信息按照地点经纬度来发出请求
        var georequest = {
            'location': location,
            'language': 'EN'
        };
    }

    twinium.map.geocoder.geocode(georequest, function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
			if(callback){
				callback.apply({'GeocoderResult':results[0],'GeocoderResultInfo':twinium.map.geocodeInfo(results[0]) },[]);
			}
        }

    });
}

twinium.map.geocodeInfo = function(resultObj) {
	if(resultObj!=null) {
		  var placedetail=resultObj.formatted_address;
		  var addresses=resultObj.address_components;
		  var countrycode="";
		  var countryname="";
		  var provincecode="";
		  var provincename="";
		  var postal_code="";
		  var street_address="";
		  
		  var cityname="";
		  var level=0;
		  for(var i=0;i<addresses.length;i++)
		  {
		  	var oneadd=addresses[i];
			if($.trim(oneadd.types[0])=="country")
			{
				countrycode=$.trim(oneadd.short_name);
				countryname=$.trim(oneadd.long_name);
				if(level==0)
				 level=1;
			}
		    if($.trim(oneadd.types[0])=="administrative_area_level_1")
			{
				provincecode=$.trim(oneadd.short_name);
				provincename=$.trim(oneadd.long_name);
				if(level==0)
				level=2;
			}
		    if($.trim(oneadd.types[0])=="locality")
			{
				cityname=$.trim(oneadd.short_name);
				level=3;
			}
			
			if($.trim(oneadd.types[0])=="street_address"){
				street_address=$.trim(oneadd.long_name);
			}
			
			if($.trim(oneadd.types[0])=="postal_code"){
				postal_code=$.trim(oneadd.long_name);
			}			
		  }

		  var info={};
		  info.cityname=cityname;
		  info.countrycode=countrycode;
		  info.provincename=provincename;
		  info.provincecode=provincecode;
		  info.placedetail=placedetail;
		  info.postal_code=postal_code;
		  info.street_address=street_address;
		  info.lat=resultObj.geometry.location.lat();
		  info.lng=resultObj.geometry.location.lng();
		  info.continent=twinium.map.Continents.getContinent(countrycode);
		  info.level=level;
		  info.countryname=countryname;
		  return info;
	}
	return null;
}

/*******************************************************************************
 * 解析指定地址根据返回信息自动设定level,并居中显示
 *
 * @param {Object}
 *            address
 */
twinium.map.setAddressAuto = function(address, callback) {

	if (twinium.map.setAddressAuto.cache[address]) {// 缓存

		//记录setting时的地图范围
        twinium.map.settingLastBounds.bounds = twinium.map.setAddressAuto.cache[address].geometry.viewport;

        twinium.map.gmap.fitBounds(twinium.map.setAddressAuto.cache[address].geometry.viewport);
		var center =new google.maps.LatLng(twinium.map.setAddressAuto.cache[address].geometry.location.lat(),twinium.map.setAddressAuto.cache[address].geometry.location.lng());
		twinium.map.currentAddress = twinium.map.setAddressAuto.cache[address];
		twinium.map.gmap.setCenter(center);
		if (callback) {
			callback.apply(null, [twinium.map.setAddressAuto.cache[address]]);
		}
		return;
	}

	twinium.map.geocoder.geocode({
		'address' : address,
		'language' : 'EN'
	}, function(results, status){

		if (status == google.maps.GeocoderStatus.OK) {
			twinium.map.setAddressAuto.cache[address] = results[0];
			twinium.map.gmap.fitBounds(results[0].geometry.viewport);
			twinium.map.currentAddress = results[0];

			if (callback) {
				callback.apply(null, [results[0]]);
			}
            //记录setting时的地图范围
            twinium.map.settingLastBounds.bounds = twinium.map.setAddressAuto.cache[address].geometry.viewport;
		}
	});
}
twinium.map.setAddressAuto.twinfoAddress=null;
twinium.map.setAddressAuto.cache = {};
twinium.map.settingLastBounds={};

twinium.map.setWorldCenter = function() {
	twinium.map.gmap.setCenter(twinium.map.defaultCenter);
	twinium.map.gmap.setZoom(1);
}
function printInfo(o,level) {
	var s = "";
	if (level <= 0) {
		return s;
	}
	
	for (var i in o) {
		s += '[' + i + ']=' + o[i] + '\n';
		if (Object.prototype.toString.call(o[i]) === "[object Object]"||Object.prototype.toString.call(o[i]) === "[object Array]") {
			s += '\n  ' + printInfo(o[i], level - 1);
		}
	}
	return s;
}