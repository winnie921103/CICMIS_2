/**
 * Physiological monitoring
 */
eNursing.dataType.addEvent="vitalSignServices.addEvent"
eNursing.dataType.addComascaleComaEvent="vitalSignServices.addComascaleComaEvent"
eNursing.dataType.addPupilEvent="vitalSignServices.addPupilEvent"
eNursing.dataType.addMuscleEvent="vitalSignServices.addMuscleEvent"
eNursing.dataType.standardValue="vitalSignServices.getStandardValue"
eNursing.dataType.abnormalInfo="vitalSignServices.getAbnormalInfo"
eNursing.dataType.reason="vitalSignServices.getReason"
eNursing.dataType.waterColor="vitalSignServices.getWaterColor"
eNursing.dataType.waterFlavor="vitalSignServices.getWaterFlavor"
eNursing.dataType.waterNature="vitalSignServices.getWaterNature"
eNursing.dataType.xmlCfg="vitalSignServices.getXmlCfg"
eNursing.dataType.drug="vitalSignServices.getDrug"
eNursing.dataType.drugAttr="vitalSignServices.getDrugAttr"
eNursing.dataType.drugRoute="vitalSignServices.getDrugRoute"
eNursing.dataType.drugUnit="vitalSignServices.getDrugUnit"
eNursing.dataType.o2Item="vitalSignServices.getO2Item"
eNursing.dataType.o2Ref="vitalSignServices.getO2Ref"
eNursing.dataType.o2Unit="vitalSignServices.getO2Unit"
eNursing.dataType.respType="vitalSignServices.getRespType"
eNursing.dataType.respMode="vitalSignServices.getRespMode"
eNursing.dataType.respTypeRef="vitalSignServices.getRespTypeRef"
eNursing.dataType.respModeRef="vitalSignServices.getRespModeRef"
eNursing.dataType.respModeUIConfig="vitalSignServices.getRespModeUIConfig"
eNursing.dataType.lavageProper="vitalSignServices.getLavageProper"
eNursing.dataType.tubeUsage="vitalSignServices.getTubeUsages"
eNursing.Events=[]
eNursing.Event={
	 encounterId:'', //就诊号	
	 encounterType:'I', //就诊号	
	 patientId:'', //病历号
	 bedId:'',//床号
	 stationId:'',//护理站id
	 modifier:'', //当前用户
	 modifierName:'', // 当前用户姓名
	 occurDate:'', // 记录日期
	 type:'', // 事件类型
	 typeName:'', // 事件类型
	 recordType:'', // 护理记录类型
	 numberValue1:'', // 事件的值
	 numberValue2:'', //
	 unit1:'', // 单位
	 unit2:'', //
	 reason:'', // 无法测量原因
	 medicine:'', // 药物
	 medicineOther:'', // 药物其他
	 route:'', // 给药途径
	 specialTreatment:'', // 特殊处置
	 treatment:'', // 护理处置
	 afterTreatment:'', // 对比观察
	 tpr:'', // 加入体温单
	 marked:'',// 加入护理记录	
		 } 
eNursing.StandardParam={type:''}
eNursing.AbnormalInfoParam={type:''}
eNursing.AttributeParam={type:''}
eNursing.addBtEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(events[i].afterTreatment==null || events[i].afterTreatment.length==0){
			error.push("afterTreatment 不能为null");
		}
		if(events[i].tpr==null || events[i].tpr.length==0){
			error.push("tpr 不能为null");
		}
		
		if(error.length>0){
			alert('addBtEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addPulseEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(events[i].tpr==null || events[i].tpr.length==0){
			error.push("tpr 不能为null");
		}
		if(error.length>0){
			alert('addPulseEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addRespiratoryEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(events[i].tpr==null || events[i].tpr.length==0){
			error.push("tpr 不能为null");
		}
		if(error.length>0){
			alert('addRespiratoryEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addWeightEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(error.length>0){
			alert('addWeightEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addHeightEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(error.length>0){
			alert('addHeightEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addBpEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		
		if(events[i].numberValue2==null || events[i].numberValue2.length==0){
			error.push("numberValue2 不能为null");
		}else if(isNaN(events[i].numberValue2)){
			error.push("numberValue2 不能为非数字");
		}
		if(events[i].tpr==null || events[i].tpr.length==0){
			error.push("tpr 不能为null");
		}
		if(events[i].pose==null || events[i].pose.length==0){
			error.push("pose 不能为null");
		}
		if(events[i].region==null || events[i].region.length==0){
			error.push("region 不能为null");
		}
		if(error.length>0){
			alert('addBpEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addStoolEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(error.length>0){
			alert('addStoolEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}

eNursing.addUrinationEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(error.length>0){
			alert('addUrinationEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addPainEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(error.length>0){
			alert('addPainEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addInputEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(error.length>0){
			alert('addInputEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addOutputEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(error.length>0){
			alert('addOutputEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addSpo2Event=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(error.length>0){
			alert('addSpo2Event-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addCvpEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(error.length>0){
			alert('addCvpEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addBodyRoundMeasureEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(error.length>0){
			alert('addBodyRoundMeasureEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addComascaleEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(event.abnormalType==null || event.abnormalType.length==0){
			error.push("abnormalType 不能为null");
		}
		if(error.length>0){
			alert('addComascaleEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addComascaleComaEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(events[i].numberValue1==null || events[i].numberValue1.length==0){
			error.push("numberValue1 不能为null");
		}
		if(events[i].unit1==null || events[i].unit1.length==0){
			error.push("unit1 不能为null");
		}
		if(error.length>0){
			alert('addComascaleComaEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addComascaleComaEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addPupilEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(events[i].numberValue1==null || events[i].numberValue1.length==0){
			error.push("numberValue1 不能为null");
		}
		if(events[i].numberValue2==null || events[i].numberValue2.length==0){
			error.push("numberValue2 不能为null");
		}
		if(events[i].unit1==null || events[i].unit1.length==0){
			error.push("unit1 不能为null");
		}
		if(error.length>0){
			alert('addPupilEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addPupilEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.addMuscleEvent=function(events,succeCall,errorCall){
	for(var i in events){
		var error=[];
		checkEvent(events[i],error)
		if(events[i].numberValue1==null || events[i].numberValue1.length==0){
			error.push("numberValue1 不能为null");
		}
		if(events[i].numberValue2==null || events[i].numberValue2.length==0){
			error.push("numberValue2 不能为null");
		}
		if(events[i].unit1==null || events[i].unit1.length==0){
			error.push("unit1 不能为null");
		}
		if(error.length>0){
			alert('addMuscleEvent-\r'+error.join('\r'))
			return false;
		}
	}
	this.sendMsg(
			this.dataType.addMuscleEvent,
			"",
			JSON.stringify(events).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}


eNursing.updateBTEvent=function(){
	
}
eNursing.standardValues=function(succeCall,errorCall){
	//this.StandardParam={type:''}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.abnormalInfos=function(succeCall,errorCall){
	//this.AbnormalInfoParam={type:''}
	this.sendMsg(
			this.dataType.abnormalInfo,
			"",
			JSON.stringify(this.AbnormalInfoParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.reasons=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.reason,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.waterColors=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.waterColor,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.waterFlavors=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.waterFlavor,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.waterNatures=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.waterNature,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.xmlCfgs=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.xmlCfg,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.drugs=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.drug,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.drugAttrs=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.drugAttr,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.drugRoutes=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.drugRoute,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.drugUnits=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.drugUnit,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.o2Items=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.o2Item,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.o2Refs=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.o2Ref,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.o2Units=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.o2Unit,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.respTypes=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.respType,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.respModes=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.respMode,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.respTypeRefs=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.respTypeRef,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.respModeRefs=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.respModeRef,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.respModeUIConfigs=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.respModeUIConfig,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.lavagePropers=function(succeCall,errorCall){
	//this.AttributeParam={type:''}
	this.sendMsg(
			this.dataType.lavageProper,
			"",
			JSON.stringify(this.AttributeParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.tubeUsages=function(OccupiersParam,succeCall,errorCall){
	/*if(OccupiersParam.patientId==null || OccupiersParam.patientId.length==0){
		errorCall("patientId 不能为null");
		return false;
	}*/
	if(OccupiersParam.encId==null || OccupiersParam.encId.length==0){
		errorCall("encId 不能为null");
		return false;
	}
	this.sendMsg(
			this.dataType.tubeUsage,
			"",
			JSON.stringify(OccupiersParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
/*eNursing.btEarStandardValue=function(succeCall,errorCall){
	//this.StandardParam={type:'BT.EAR'}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.btForeheadStandardValue=function(succeCall,errorCall){
	//this.StandardParam={type:'BT.FOREHEAD'}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.btOralStandardValue=function(succeCall,errorCall){
	//this.StandardParam={type:'BT.ORAL'}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.btAxillaryStandardValue=function(succeCall,errorCall){
	//this.StandardParam={type:'BT.AXILLARY'}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.btRectalStandardValue=function(succeCall,errorCall){
	//this.StandardParam={type:'BT.RECTAL'}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.pulseStandardValue=function(succeCall,errorCall){
	//this.StandardParam={type:''}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.respiratoryStandardValue=function(succeCall,errorCall){
	///this.StandardParam={type:'RESPIRATORY'}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.bpStandardValue=function(succeCall,errorCall){
	//this.StandardParam={type:'BP'}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.cvpcmH2OStandardValue=function(succeCall,errorCall){
	//this.StandardParam={type:'CVP1'}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.cvpmmHgStandardValue=function(succeCall,errorCall){
	//this.StandardParam={type:'CVP2'}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}
eNursing.spO2StandardValue=function(succeCall,errorCall){
	//this.StandardParam={type:'SPO2'}
	this.sendMsg(
			this.dataType.standardValue,
			"",
			JSON.stringify(this.StandardParam).replace(/\"/g,"\\\""),
			"",
			succeCall,
			errorCall
	);
}*/
function checkEvent(event,error){
	if(event.encounterId==null || event.encounterId.length==0){
		error.push("encounterId 不能为null");
	}
	if(event.encounterType==null || event.encounterType.length==0){
		error.push("encounterType 不能为null");
	}
	if(event.patientId==null || event.patientId.length==0){
		error.push("patientId 不能为null");
	}
	if(event.bedId==null || event.bedId.length==0){
		error.push("bedId 不能为null");
	}
	if(event.stationId==null || event.stationId.length==0){
		error.push("stationId 不能为null");
	}
	if(event.modifier==null || event.modifier.length==0){
		error.push("modifier 不能为null");
	}
	if(event.modifierName==null || event.modifierName.length==0){
		error.push("modifierName 不能为null");
	}
	if(event.occurDate==null || event.occurDate.length==0){
		error.push("occurDate 不能为null");
	}
	if(event.type==null || event.type.length==0){
		error.push("type 不能为null");
	}
	if(event.typeName==null || event.typeName.length==0){
		error.push("typeName 不能为null");
	}
	if(event.recordType==null || event.recordType.length==0){
		error.push("recordType 不能为null");
	}
	if(event.numberValue1==null || event.numberValue1.length==0){
		if(!event.type.indexOf('COMASCALE')==0&&(event.reason==82||event.reason==0))
			error.push("numberValue1 不能为null");
	}else if(isNaN(event.numberValue1)){
		error.push("numberValue1 不能为非数字");
	}
	if(event.unit1==null || event.unit1.length==0){
		if(!event.type.indexOf('COMASCALE')==0&&(event.reason==82||event.reason==0))
			error.push("unit1 不能为null");
	}
	if(event.marked==null || event.marked.length==0){
		error.push("marked 不能为null");
	}
}
