var markerType = ""; //標記類型：個案(Hcase)、醫院(hospital)
var objKey = ""; //獨立的key，要當地圖標記索引用的 Ex.醫院代碼、病歷號
var bAdd = false; //是否增加標記：增加(true)，刪除(false)
var objData =""; //餵給地圖的物件

//建個測試醫院資料(經緯度)
var checkhospLatLng = [
	{hospName:'國立台灣大學醫學院附設醫院北護分院', lat:25.041899, lng:121.503027},
	{hospName:'臺北市立聯合醫院陽明院區', lat:25.1052828, lng:121.53218079999999},
	{hospName:'臺北市立聯合醫院和平院區', lat:25.035561, lng:121.50658780000003},
	{hospName:'臺北市立聯合醫院忠孝院區', lat:25.0465963, lng:121.58612970000001},
	{hospName:'同仁院醫療財團法人萬華醫院', lat:25.02402, lng:121.50980800000002},
	{hospName:'臺北市立聯合醫院中興院區', lat:25.0511327, lng:121.50941940000007},
	{hospName:'臺北市立聯合醫院仁愛院區', lat:25.0372057, lng:121.5452242},
	{hospName:'中國醫藥大學附設醫院台北分院', lat:25.0821265, lng:121.59070539999993},
];
	
var map;
var bounds;
var geocoder;
var markers = {}; //google maps的markers資訊
var markersItem = {}; //顯示中的markers key及經緯度

$(function() {
	initMap();
});		

/**
 * google call back
 */
function callbackFunctions() {
	getJsonFile();
	initMap();
	initHospital();
}
	
/**
 * 地圖初始化
 */
function initMap() {
	
	var address = window.localStorage["patient_hpatadr"];
	
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 17,
		center: {
			lat: 25.11,
			lng: 121.520
		}
  	});
	
	if (address !== undefined && address !== 'undefined' && address !== '' && address !== null) {
		geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address': address}, function(results, status) {
			if (status == 'OK') {
				map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});
			} else {
				console.log(status);
			}
		});
	}

	bounds = new google.maps.LatLngBounds();
}

function getJsonFile() {
    var flickerAPI = "../../../META-JS/hospitalSetting.json";
    $.ajax({
        url: flickerAPI,
        type : 'POST',
        dataType : 'text',
        async: false,
        success: function(result) {
            var json = JSON.parse(result);
            checkhospLatLng = json.hospitals;
        }
    });
}

function initHospital() {
	$("input[name='hospitalName']").click(function() {
		markerType = "hospital";
		objKey = this.value;
		bAdd = $(this).prop('checked');
		$.each(checkhospLatLng, function(i, result){
			if ((result.hospName !== undefined && result.hospName == objKey)) {	
				objData = {markerType: markerType,
							objKey: result.hospName, 
							lat: result.lat, 
							lng: result.lng,
							isAdd: bAdd,
							info: result.hospName
						};	
				addMarker(objData);
			}
			if ((result.hospitalName !== undefined && result.hospitalName == objKey)) {	
				objData = {markerType: markerType,
							objKey: result.hospitalName, 
							lat: result.lat, 
							lng: result.lng,
							isAdd: bAdd,
							info: result.hospitalName
						};	
				addMarker(objData);
			}
		});
	});
}

/**
 * 增加或清除地圖標記
 * @param obj 地址資訊物件
 */
 function markersBound(obj){
	//縮放地圖讓所有點都能顯示在畫面中
	var count = 0;
	$.each(markersItem, function(i, result){
		bounds.extend(new google.maps.LatLng(result.lat, result.lng));
		count++;
		if (count == 1)
			map.setCenter(new google.maps.LatLng(result.lat, result.lng));
	});
		
	if (count > 1)
		map.fitBounds(bounds);
}

/**
 * 增加或清除地圖標記
 * @param objData 地址資訊物件
 */
function addMarker(objData) {
	console.log(objData, markers);
	var iIndex = 1;
	var color = "black";
	var colors = ["red","orange","deeppink","green","blue","dodgerblue","darkorchid"];
	var path = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
	if (objData.markerType =="Hcase"){
		//是個案的話找一下目前標記中有幾個個案再分配顏色
		var colorIndex =0;
		$.each(markersItem, function(i, result){
			if (result.markerType == "Hcase")
				colorIndex++
		});
		colorIndex = colorIndex %  colors.length;
		iIndex = 2;
		color = colors[colorIndex];
		//path = "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" //房子圖案
	}

	//用isAdd判斷要新增還是刪除標記
	if (objData.isAdd){
		markers[objData.objKey] = new google.maps.Marker({
			position: {
				lat: objData.lat,
				lng: objData.lng
			},
			map: map,
			zIndex: iIndex,
			icon: {
				path: path,
				scale: 1.5,
				strokeWeight: 0.2,
				strokeColor: 'black',
				strokeOpacity: 1,
				fillColor: color,
				fillOpacity: 1,
			},
		});

		//另存顯示中標記的經緯度資訊，地圖縮放or配色時可以用
		markersItem[objData.objKey] = {
			objKey:objData.objKey,
			lat: objData.lat,
			lng: objData.lng,
			markerType: objData.markerType
		}

		//加上資訊視窗
		var infowindow = new google.maps.InfoWindow({
			content: objData.info,
		});
		markers[objData.objKey].addListener('click', function() {
			infowindow.open(map, markers[objData.objKey]);
		});
	} else { //清除標記
		markers[objData.objKey].setMap(null);
		delete markers[objData.objKey];
		delete markersItem[objData.objKey];
	}
	markersBound(markersItem);
}