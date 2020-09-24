/**
 * 登陆
 * @param userName	帐号
 * @param pwd	密码
 */
var eNursing={
	//socket:"ws://localhost:8080/MBNIS/websocket",
	socketUrl:"ws://192.168.0.106:8080/MBNIS/websocket",
	//socket:"ws://127.0.0.1:8080",	
	//socket:"ws://172.16.100.17:8080/MBNIS/websocket",
	
	dataType:{
		login:"loginServices.login",//登陆
		patientList:"patientServices.getPatientList",//病患清单
		patient:"patientServices.getPatient",//获取单个病串
	},
	LoginUserParam:{userName:"",pwd:""},
	OccupiersParam:{stationId:"",userId:"",patientId:"", encId:""},
	/**
	 * LoginUserParam=参数
	 * succeCall=回调函数-成功
	 * errorCall=回调函数-失败
	 */
	login:function(LoginUserParam,succeCall,errorCall){
		var canNext=true;
		if(LoginUserParam.userName==null || LoginUserParam.userName.length==0){
			alert("eNursing.LoginUserParam.userName 未填入值！");
			canNext=false ;
			return canNext;
		}
		if(LoginUserParam.pwd==null || LoginUserParam.pwd.length==0){
			alert("eNursing.LoginUserParam.pwd 未填入值！");
			canNext=false;
			return canNext;
		}
		this.sendMsg(
				this.dataType.login,
				"",
				JSON.stringify(LoginUserParam).replace(/\"/g,"\\\""),
				"",
				succeCall,
				errorCall
		);
		return canNext;
	},
	/**
	 * 查詢病患清單列表
	 */
	patientList:function(OccupiersParam,succeCall,errorCall){
		if(OccupiersParam.stationId==null || OccupiersParam.stationId.length==0){
			errorCall("stationId 不能为null");
			return false;
		}
		if(OccupiersParam.userId==null || OccupiersParam.userId.length==0){
			errorCall("userId 不能为null");
			return false;
		}
		this.sendMsg(
				this.dataType.patientList,
				"",
				JSON.stringify(OccupiersParam).replace(/\"/g,"\\\""),
				"",
				succeCall,
				errorCall
		);
		
	},
	/**
	 * 查詢病患清單
	 */
	patient:function(OccupiersParam,succeCall,errorCall){
		/*if(OccupiersParam.patientId==null || OccupiersParam.patientId.length==0){
			errorCall("patientId 不能为null");
			return false;
		}*/
		if(OccupiersParam.encId==null || OccupiersParam.encId.length==0){
			errorCall("encId 不能为null");
			return false;
		}
		this.sendMsg(
				this.dataType.patient,
				"",
				JSON.stringify(OccupiersParam).replace(/\"/g,"\\\""),
				"",
				succeCall,
				errorCall
		);
	},
	
	/**
	 * type=类型
	 * loginServices.login={"fullName":"趙泰宏1","loginId":"0001","station":[{"key":"10201301","value":"心血管一病区"}],"stationIds":"10201301"}
	 *  
	 *  
	 * succeCall=调用成功
	 * errorCall=调用失败
	 */
	getDb:function(type,succeCall,errorCall){
		var val=window.localStorage[type];
		succeCall(val);
		
	},
	addOrUpdateDb:function(type,content){
		window.localStorage[type]=content;
	},
	sendMsg:function(process,param,argument,ext,succeCall,errorCall){
		
		var ws=null;
		var isNowWinScoket=false;
		if ("WebSocket" in window) {
	         ws= new WebSocket(this.socket);
	    }else{
	        ws = new WebSocketImpl(this.socket, "");
	        isNowWinScoket=true;
	    }
		ws.onopen = function(evt)
	    {
			var json = "{ \"process\": \""+process+"\", \"param\": \"" + param + "\", \"argument\": \""+argument+"\",\"ext\": \""+ext+"\" }";
			ws.send(json);
		};
		ws.onerror = function (exception) 
        { 
			alert(exception);
			errorCall(exception);
        };
		ws.onmessage = function (evt) 
        {
			if(evt.data==null || evt.data.length==0){
				errorCall("无结果返回!");
			}else{
				eNursing.addOrUpdateDb(process,evt.data);
				succeCall(evt.data);
			}
        };
        if(isNowWinScoket)
		{
        	ws.connect();
		}
	}
	
}


