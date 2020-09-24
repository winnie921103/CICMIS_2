/**
 * 
 */
function FormItem(itemKey,itemValue,otherValue,encId,patientId,stationId){
	this.itemKey = itemKey;
	this.itemValue = itemValue;
	this.otherValue = otherValue;
	this.encId = encId;
	this.patientId = patientId;
	this.stationId = stationId;
}
function Form(bedId,createUserId,createUserName,encId,evaluationTime,formModel,formType,items,patientId,states,stationId,totalScore,formId,eventIds){
	this.bedId = bedId;
	this.createUserId = createUserId;
	this.createUserName = createUserName;
	this.encId = encId;
	this.evaluationTime = evaluationTime;
	this.formModel = formModel;
	this.formType = formType;
	this.items = items;
	this.patientId = patientId;
	this.states = states;
	this.stationId = stationId;
	this.totalScore = totalScore;
	this.formId = formId;
	this.eventIds = eventIds;
}