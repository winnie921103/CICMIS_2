/**
 * 全局函数
 */

function processDate(date,year,month,day,hour,minute,second){
	date.setFullYear(date.getFullYear()+year);
	date.setMonth(date.getMonth()+month);
	date.setDate(date.getDate()+day);
	date.setHours(hour);
	date.setMinutes(minute);
	date.setSeconds(second);
}
function doURL(linkURL){
	eNursing.getDb(
			eNursing.dataType.patient,
			function(result){
				if(result==null){
					window.localStorage["previous"]=linkURL;
					location.href="pt-list.html";
				}else
					location.href=linkURL;
			},
			function(exception){
				alert(exception);
			}
	);
}
function setTitleBo(page){
	var occ;
	eNursing.getDb(
		eNursing.dataType.patientList,
		function(re){
			var occs = eval(re);
			if(page==undefined||page==0){
				page=0;
			}else{
				location.reload();
			}
			var occIndex=parseInt(window.localStorage["occIndex"])+page*1;
			window.localStorage["occIndex"]=occIndex;
			occ=occs[occIndex];
			eNursing.addOrUpdateDb(eNursing.dataType.patient,JSON.stringify(occ));
			$("#USER").html(occ.nurseName);  
			$("#p_station").html(occ.stationBed);
			$("#p_name").html(occ.chinName);
			$("#p_caseno").html(occ.caseno);
			$("#p_sex").html(occ.sexc);
			$("#p_age").html(occ.ageDesc);
			$("#p_patientID").html(occ.hisnum);
			$("#p_bedID").html(occ.bed);
			var ptstr1 = '';
			if(occIndex > 0)
				ptstr1 = ptstr1 + '<img alt="" src="img/left.png" onclick="setTitleBo(-1)"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			else
				ptstr1 = ptstr1 + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			
			ptstr1 = ptstr1 + '<img alt="" src="img/Home_32x32.png" onclick="location=\'home.html\'"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			ptstr1 = ptstr1 + '<img alt="" src="img/scan_32x32.png"  href="javascript: return false;" onclick="location=\'pt-list.html\'" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			if(occIndex < occs.length-1)
				ptstr1 = ptstr1 + '<img alt="" src="img/right.png"  href="javascript: return false;" onclick="setTitleBo(1)" />';
			else
				ptstr1 = ptstr1 + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			
			$("#bottomToolbar").html(ptstr1);
		}
	);
	return occ;
}
//-------------------------判斷項目值是否異常(item:項目 min:最小允許範圍 max:最大允許範圍 displayitem:異常顯示項目)---------------
function DataValueCheck(item,displayitem,dialogitem){
	var occ;
	eNursing.getDb(
	eNursing.dataType.patient,
		function(result){
			if(result!=null){
				occ=JSON.parse(result);
			}
		},
		function(exception){
			alert(exception);
		}
	);
	var age=new Date(occ.birthday);
	processDate(age,0,0,0,0,0,0);
	var defer=new $.Deferred();
	var promise=defer.promise();
	var type;
	if(item == "temperature"){
		type=$("#pt-temperature-select").val();
	}else if(item == "inputdbp"|| item == "inputsbp"){
		type='BP';
	}else if(item == "R"){
		type='RESPIRATORY';
	}else if(item == "P"){
		type='PULSE';
	}
	eNursing.getDb(eNursing.dataType.standardValue,
			function(re){
				var standardKeyValues=JSON.parse(re);
				var standardValues=standardKeyValues[type];
				if(standardValues==null){
					return;
				}
				for(var i=0;i<standardValues.length;i++){
					var date1=new Date();
					var date2=new Date();
					processDate(date1,-standardValues[i].maxyear*1,-standardValues[i].maxmonth*1,-standardValues[i].maxday*1,0,0,0);
					processDate(date2,-standardValues[i].minyear*1,-standardValues[i].minmonth*1,-standardValues[i].minday*1,0,0,0);
					if(age>date1&&age<date2){
						if(item=="inputdbp"){
							max=standardValues[i].maxvalue2
							min=standardValues[i].minvalue2
						}else{
							max=standardValues[i].maxvalue
							min=standardValues[i].minvalue
						}
						
					}
				}
				defer.resolve(item,min,max,displayitem,dialogitem,type.split(".")[0]);
			},
			function(){}
	)
	promise.then(DataValueCheckSon)
}
function DataValueCheckSon(item,min,max,displayitem,dialogitem,type){
	var x=$("#"+item);
	if(min == ""){
		return;
	}	
	if(Number(x.val()) > 200 || Number(x.val()) <0)
	{
		alert("输入的数据不合法");
		x.val("");
		return;
	}	
	var abnormalInfoMap;
	eNursing.getDb(eNursing.dataType.abnormalInfo,
			function(re){
				abnormalInfoMap=JSON.parse(re);
			}
			,function(){});	
	
	if(Number(x.val()) > Number(max)||Number(x.val()) < Number(min) ){
		var highlow;
		if(Number(x.val()) > Number(max)){
			highlow='_HIGH';
			var titleE=$(dialogitem).find('h3');
			var title=titleE.html().replace('低','高');
			titleE.html(title);
		}else if(Number(x.val()) < Number(min)){
			var titleE=$(dialogitem).find('h3');
			var title=titleE.html().replace('高','低');
			titleE.html(title);
			highlow='_LOW'
		}
		if(type=='BT'){
			var drugMap;
			eNursing.getDb(eNursing.dataType.drug,function(re){drugMap=JSON.parse(re)},function(){})
			var drugs=drugMap["1"]
			var options='<option value="0">药物</option>'
			for(var i=0;i<drugs.length;i++){
				options+='<option value="'+drugs[i].drugid+'">'+drugs[i].drugname+'</option>'
			}
			options+='<option value="99">其它</option>'
			$("#pt-lc-select1").html(options);
		}
		else if(type=='PULSE'){
			highlow=''
			var drugMap;
			eNursing.getDb(eNursing.dataType.drug,function(re){drugMap=JSON.parse(re)},function(){})
			var drugs=drugMap["4"]
			var options='<option value="0">药物</option>'
			for(var i=0;i<drugs.length;i++){
				options+='<option value="'+drugs[i].drugid+'">'+drugs[i].drugname+'</option>'
			}
			options+='<option value="99">其它</option>'
			$("#pp-lc-select1").html(options);
		}
		else if(type=='RESPIRATORY'){
			highlow=''
			$('#checkR').val('1');
		}
		else if(type=='BP'){
			var drugMap;
			eNursing.getDb(eNursing.dataType.drug,function(re){drugMap=JSON.parse(re)},function(){})
			var drugs=drugMap["5"]
			var options='<option value="0">药物</option>'
			for(var i=0;i<drugs.length;i++){
				options+='<option value="'+drugs[i].drugid+'">'+drugs[i].drugname+'</option>'
			}
			options+='<option value="99">其它</option>'
				$("#pb-lc-select1").html(options);
		}	
		else if(type=='SPO2'){
			highlow=''
		}
		var infos=abnormalInfoMap['ABNORMAL_'+type+highlow];
		var html='';
		for(var i=0;i<infos.length;i++){
			var value=infos[i].intervention.interventionName;
			html+='<p><input id="check'+(i+1)+'_t" type="checkbox" value="'+value+'">'+value+'</p>'
		}
		$(dialogitem).find("div.modal-body").html(html);
		x.css('color','red');
		$(dialogitem).modal('show');
		$("#"+displayitem).show();
	}else{
		x.css('color','black');
		$('#checkR').val('');
		if ($('#checkR').is(':checked') && item == "R") {
			$("#"+displayitem).show();
			return;
		}
		$("#"+displayitem).hide();
	}
}
function getOptions(attributesMap,type,atype){
	var attributes=attributesMap[type];
   	var cons;
   	if(atype=="reason")
   		cons="<option value='0'>无法测量原因</option>";
   	else if(atype=="waterNature")
   		cons="<option value='0'>请选择性质</option>";
   	else if(atype=="waterColor")
   		cons="<option value='0'>请选择颜色</option>";
   	else if(atype=="waterFlavor")
   		cons="<option value='0'>请选择味道</option>";
    for(var i=0;i<attributes.length;i++){
    	cons+="<option value='"+attributes[i].attributeid+"'>"+attributes[i].attributename+"</option>"
    }
	return cons;
}
function getTypeOptions(types,name){
   	var context='';
   	for(var i in types){
   		context+='<option value="'+types[i].name+'" '+(types[i].name==name?'selected':'')+'>'+types[i].comment+'</option>'
   	}
   	return context;
}