/**
 *医嘱巡视-查询未巡视的时间-参数
 *encId=住院号
 *id=主健
 *beginDate=巡视查询开始时间
 *endDate=巡视查询结束时间
 */

function getNoMedinjVisitDateParam(encId,id,beginDate,endDate){
	this.encId=encId;
	this.id=id;
	this.beginDate=beginDate;
	this.endDate=endDate;
}
/**
 * 执行医嘱巡视时间-参数
	 * @param encId  住院号
	 * @param ordseq 医嘱号
	 * @param uncrcpId 签用序号
	 * @param patrolTime 应执行时间
	 * @param patrolRealTime 实际执行时间
	 * @param patrolContent 内容
	 * @param tube 管路
	 * @param rate 滴速
	 * @param patrolUserId 建立者ID
 */
function addMedinjVisitsParam(encId, ordseq, uncrcpId,patrolTime,  patrolRealTime,  patrolContent, tube,  rate,  patrolUserId){
	this.encId=encId;
	this.ordseq=ordseq;
	this.uncrcpId=uncrcpId;
	this.patrolTime=patrolTime;
	this.patrolRealTime=patrolRealTime;
	this.patrolContent=patrolContent;
	this.tube=tube;
	this.rate=rate;
	this.patrolUserId=patrolUserId;
}

/**
 * 暂停巡视记录-参数
 * 
 * @param encId  住院号
 * @param ordseq  医嘱号
 * @param station 护理站udorderinfo.station
 * @param drugCode 药码
 * @param uncrcpId    签用序号
 * @param pauseTime   暂停时间
 * @param pauseReason 原因代码
 * @param pauseOtherReason 基他原因
 * @param pauseUserId  暂停者帐号
 * @throws Exception 
 */
function pauseMedinjVisitsUncrcpParam(encId, ordseq,station, drugCode, uncrcpId, pauseTime,pauseReason, pauseOtherReason, pauseUserId){
	
	this.encId=encId;
	this.ordseq=ordseq;
	this.station=station;
	this.drugCode=drugCode; 
	this.uncrcpId=uncrcpId;
	this.pauseTime=pauseTime;
	this.pauseReason=pauseReason;
	this.pauseOtherReason=pauseOtherReason;
	this.pauseUserId=pauseUserId;
	
}
/**
 * 重启巡视-参数
 * @param encId  住院号
	 * @param ordseq  医嘱号
	 * @param station 护理站udorderinfo.station
	 * @param drugCode 药码
	 * @param uncrcpId    签 用序号
	 * @param restartTime   重启时间
	 * @param restartReason 原因代码
	 * @param restartOtherReason 基他原因
	 * @param pauseUserId  重启者帐号
 */
function restartMedinjVisitsUncrcpParam(encId, ordseq,station, drugCode, uncrcpId, restartTime,	restartReason, restartOtherReason,restartUserId)
{
	this.encId=encId; 
	this.ordseq=ordseq;
	this.station=station;
	this.drugCode=drugCode;
	this.uncrcpId=uncrcpId;
	this.restartTime=restartTime;
	this.restartReason=restartReason;
	this.restartOtherReason=restartOtherReason;
	this.restartUserId=restartUserId;
}

/**
 * 结束巡视-参数
 * @param encId  住院号
	 *@param ordseq  医嘱号
	 * @param station 护理站udorderinfo.station
	 * @param drugCode 药码
	 * @param uncrcpId    签 用序号
	 * @param stopTime    停止时间
	 * @param stopReason 原因代码
	 * @param stopOtherReason 基他原因
	 * @param stopUserId   停止者帐号
 */
function endMedinjVisitsUncrcpParam(encId, ordseq,station, drugCode, uncrcpId,  stopTime,stopReason, stopOtherReason, stopUserId)
{
	this.encId=encId;
	this.ordseq=ordseq;
	this.station=station;
	this.drugCode=drugCode;
	this.uncrcpId=uncrcpId;
	this.stopTime=stopTime,
	this.stopReason=stopReason;
	this.stopOtherReason=stopOtherReason;
	this.stopUserId=stopUserId;
}

/**
 * 
 */
function IOEMIntegration(){
}
/**
 * 医嘱巡视-查询未巡视的时间 发送消息
 * 调用 NISWebService 接口
 * public List<Date> getNoMedinjVisitDate(String encId,String id,Date beginDate, Date endDate) throws Exception
 */
IOEMIntegration.prototype.getNoMedinjVisitDate=function(WebSocket,param,getNoMedinjVisitDate){
	var arg=JSON.stringify(getNoMedinjVisitDate).replace(/\"/g,"\\\"");
	var json = "{ \"process\": \"drugSignUdOrder.getNoMedinjVisitDate\", \"param\": \"" +param +"\", \"argument\": \""+arg+"\",\"ext\": \"\" }";
	WebSocket.send(json);
}

/**
 * 执行医嘱巡视时间
 * 调用 NISWebService 接口
 * public void addMedinjVisits(String encId, String ordseq, String uncrcpId,
			Date patrolTime, Date patrolRealTime, String patrolContent,
			String tube, float rate, String patrolUserId) throws Exception {
		DrugSignService.getInstance(M2Servlet.getInstance()).addMedinjVisits(encId, ordseq, uncrcpId, patrolTime, patrolRealTime, patrolContent, tube, rate, patrolUserId);
	}
 */
IOEMIntegration.prototype.addMedinjVisits=function(WebSocket,param,addMedinjVisitsParam){
	var arg=JSON.stringify(addMedinjVisitsParam).replace(/\"/g,"\\\"");
	var json = "{ \"process\": \"drugSignUdOrder.addMedinjVisits\", \"param\": \"" +param +"\", \"argument\": \""+arg+"\",\"ext\": \"save\" }";
	WebSocket.send(json);
}
/**
 * 暂停巡视记录
 * 调用 NISWebService 接口
 * public void pauseMedinjVisitsUncrcp(String encId, String ordseq,
			String station, String drugCode, String uncrcpId, Date pauseTime,
			String pauseReason, String pauseOtherReason, String pauseUserId)
			throws Exception
 */
IOEMIntegration.prototype.pauseMedinjVisitsUncrcp=function(WebSocket,param,pauseMedinjVisitsUncrcpParam){
	var arg=JSON.stringify(pauseMedinjVisitsUncrcpParam).replace(/\"/g,"\\\"");
	var json = "{ \"process\": \"drugSignUdOrder.pauseMedinjVisitsUncrcp\", \"param\": \"" +param +"\", \"argument\": \""+arg+"\",\"ext\": \"save\" }";
	WebSocket.send(json);
}


/**
 * 重启巡视记录
 * 调用 NISWebService 接口
 * public void restartMedinjVisitsUncrcp(String encId, String ordseq,
			String station, String drugCode, String uncrcpId, Date restartTime,
			String restartReason, String restartOtherReason,
			String restartUserId) throws Exception 
 */
IOEMIntegration.prototype.restartMedinjVisitsUncrcp=function(WebSocket,param,pauseMedinjVisitsUncrcpParam){
	var arg=JSON.stringify(pauseMedinjVisitsUncrcpParam).replace(/\"/g,"\\\"");
	
	var json = "{ \"process\": \"drugSignUdOrder.restartMedinjVisitsUncrcp\", \"param\": \"" +param +"\", \"argument\": \""+arg+"\",\"ext\": \"save\" }";
	WebSocket.send(json);
} 


IOEMIntegration.prototype.endMedinjVisitsUncrcp=function(WebSocket,param,restartMedinjVisitsUncrcpParam){
	var arg=JSON.stringify(restartMedinjVisitsUncrcpParam).replace(/\"/g,"\\\"");
	var json = "{ \"process\": \"drugSignUdOrder.endMedinjVisitsUncrcp\", \"param\": \"" +param +"\", \"argument\": \""+arg+"\",\"ext\": \"save\" }";
	
	WebSocket.send(json);
} 


