function Intervent(id,name){
	this.interventId = id;
	this.interventName = name;
};
function Intervent(id,name,interventionType){
	this.interventId = id;
	this.interventName = name;
	this.interventionType = interventionType;
};
Intervent.prototype.toHTML = function (diagId,goalId,measureId){
	var html="";
	html+="<input type=\"hidden\" name=\""+diagId+goalId+measureId+"interventId\" value=\""+this.interventId+"\">\n";
	html+="<input type=\"hidden\" name=\""+diagId+goalId+measureId+"interventName\" value=\""+this.interventName+"\">\n"
	return html
};
function Measure(id,name){
	this.measureId = id;
	this.measureName = name;
	this.intervent = new Array();	
};
Measure.prototype.toHTML = function (diagId,goalId){
	var html="";
	html+="<input type=\"hidden\" name=\""+diagId+goalId+"measureId\" value=\""+this.measureId+"\">\n";
	html+="<input type=\"hidden\" name=\""+diagId+goalId+"measureName\" value=\""+this.measureName+"\">\n"
	
	for(var i=0;i<this.intervent.length;i++)
		html+=this.intervent[i].toHTML(diagId,goalId,this.measureId);
	
	return html
};
function GoalObj(id,name){
	this.goalId = id;
	this.goalName = name;
	this.date = "";	
	this.measure = new Array();
};
// 2-Tier Use
function GoalObjWith2Tier(id,name){
	this.goalId = id;
	this.goalName = name;
	this.date = "";	
	this.intervent = new Array();
};
GoalObj.prototype.toHTML = function (diagId){
	var html="";
	html+="<input type=\"hidden\" name=\""+diagId+"goalId\" value=\""+this.goalId+"\">\n"
	html+="<input type=\"hidden\" name=\""+diagId+"goalName\" value=\""+this.goalName+"\">\n"
	html+="<input type=\"hidden\" name=\""+diagId+this.goalId+"date\" value=\""+this.date+"\">\n"			
	
	for(var i=0;i<this.measure.length;i++)
		html+=this.measure[i].toHTML(diagId,this.goalId);
	return html;
};
// 2-Tier Use
GoalObjWith2Tier.prototype.toHTML = function (diagId){
	var html="";
	html+="<input type=\"hidden\" name=\""+diagId+"goalId\" value=\""+this.goalId+"\">\n"
	html+="<input type=\"hidden\" name=\""+diagId+"goalName\" value=\""+this.goalName+"\">\n"
	html+="<input type=\"hidden\" name=\""+diagId+this.goalId+"date\" value=\""+this.date+"\">\n"			
	
	for(var i=0;i<this.intervent.length;i++)
		html+=this.intervent[i].toHTML(diagId,this.goalId,"");
	return html;
};
GoalObj.prototype.setDate = function (date){
	this.date = date;
};
// 2-Tier Use
GoalObjWith2Tier.prototype.setDate = function (date){
	this.date = date;
};
GoalObj.prototype.setMeasure = function (measure){
	this.measure = measure;
};
// 2-Tier Use
GoalObjWith2Tier.prototype.setIntervent = function (intervent){
	this.intervent = intervent;
};
function Character(id,name){
	this.charId = id;
	this.charName = name;
};
Character.prototype.getCharId = function (){
	return this.charId;
};
Character.prototype.getCharName = function (){
	return this.charName;
};
Character.prototype.toHTML = function (diagId){
	var html="";
	html+="<input type=\"hidden\" name=\""+diagId+"charId\" value=\""+this.getCharId()+"\">\n"
	html+="<input type=\"hidden\" name=\""+diagId+"charName\" value=\""+this.getCharName()+"\">\n"	
	return html;
};
function Cause(id,name){
	this.causeId = id;
	this.causeName = name;
};
Cause.prototype.toHTML = function (diagId){
	var html="";
	html+="<input type=\"hidden\" name=\""+diagId+"causeId\" value=\""+this.causeId+"\">\n"
	html+="<input type=\"hidden\" name=\""+diagId+"causeName\" value=\""+this.causeName+"\">\n"		
	return html;
};
function Diagnosis(id,name){
	this.diagId = id;
	this.name = name;
	this.date = "";	
	this.time = "";		
	this.character = new Array();
	this.cause = new Array();
	this.goal = new Array();
	this.property = "";
	//焦點紀錄時使用 紀錄focusId
	this.focus = "";
	this.focusName = "";
};
Diagnosis.prototype.setDate = function (date){
	this.date = date;
};
Diagnosis.prototype.setTime = function (time){
	this.time = time;
};
Diagnosis.prototype.toHTML = function (){
	var html="<table width=\"100%\" class=\"etable\" ><tr>\n";
	html+="<th nowrap>健康問題</th>\n";
	html+="<td class=\"etd_execute\" ><SPAN ID=\"diagName\">"+this.name+"</SPAN></td>\n";

	html+="</tr>\n";
	html+="<input type=\"hidden\" name=\"diagId\" value=\""+this.diagId+"\">\n";;
	html+="<input type=\"hidden\" name=\"diagName\" value=\""+this.name+"\">\n";
	
	html+="<input type=\"hidden\" name=\"diagProperty\" value=\""+this.property+"\">\n";
	
	html+="<input type=\"hidden\" name=\""+this.diagId+"focusId\" value=\""+this.focus+"\">\n";
	
	html+="<input type=\"hidden\" name=\""+this.diagId+"focusName\" value=\""+this.focusName+"\">\n";

	if(this.date!="")	
	{
		html+="<tr>\n";
		html+="<th nowrap>日期時間</th>\n";
		html+="<td class=\"etd_execute\">\n";
		html+=this.date+" "+this.time;
		html+="</td>\n";
		html+="</tr>\n";	
		html+="<input type=\"hidden\" name=\"userdate\" value=\""+this.date+"\">";
		html+="<input type=\"hidden\" name=\"usertime\" value=\""+this.time+"\">";		
	
	}
	if(this.property != "R"){
		html+="<tr>\n";
		html+="<th nowrap>定義特徵</th>\n";
		html+="<td class=\"etd_execute\">\n";
		html+="<SPAN ID=\"diagObject\">";
		for(var i=0;i<this.character.length;i++)
		{
			html+=this.character[i].getCharName()+",";
			html+=this.character[i].toHTML(this.diagId);
		}	
		html+="</SPAN>\n";
		html+="</td>\n";
		html+="</tr>\n";	
	}
	
	if(this.property != "W"){
		html+="<tr>\n";
		if(this.property == "R"){
			html+="<th nowrap>危險因子</th>\n";
		}else{
			html+="<th nowrap>相關因素</th>\n";
		}
		html+="<td class=\"etd_execute\" >\n";
		for(var i=0;i<this.cause.length;i++)
		{
			html+=this.cause[i].causeName+",";
			html+=this.cause[i].toHTML(this.diagId);
		}
		html+="<SPAN ID=\"causeName\">\n";	
		html+="</SPAN>\n";	
		html+="</td>\n";
		html+="</tr>\n"	;
	}

	for(var i=0;i<this.goal.length;i++)
	{

		html+="<tr>\n";	
		html+="<th>護理目標</th>\n";	
		html+="<td class=\"plan_object\">\n";	
		html+="<SPAN ID=\"confimGoalName\">\n";		
		html+=this.goal[i].goalName+",";
		html+=this.goal[i].toHTML(this.diagId);
		html+="</SPAN>\n";		
		html+="</td>\n"	;
		html+="</tr>\n";				
	
		  
		html+="<tr>\n";
		html+="<th width=\"10%\" nowrap>預定完成日期</th>\n";	
		html+="<td class=\"etd_execute\" > \n";
		html+="<SPAN ID=\"donedate\">\n";
		html+=this.goal[i].date;
		html+="</SPAN>\n";		
		html+="</td>\n"	;
		html+="</tr>\n";

		html+="<tr>\n";
		html+="<th nowrap>護理措施</th>\n";	
		html+="<td class=\"etd_execute\" > \n";
		for(var j=0;j<this.goal[i].measure.length;j++)
		{
			html+=this.goal[i].measure[j].measureName+",";
		}
		html+="</td>\n"	;
		html+="</tr>\n"	;

		html+="<tr>\n";
		html+="<th nowrap>護理活動</th>\n";	
		html+="<td class=\"etd_execute\" > \n";
		html+="<SPAN ID=\"interventionName\">\n";				
		var count=1;
		for(var j=0;j<this.goal[i].measure.length;j++)
		{		
			for(var k=0;k<this.goal[i].measure[j].intervent.length;k++)
			{	

				html+=(count++)+"."+this.goal[i].measure[j].intervent[k].interventName+"<br/>";			
			}			
		}
		
		html+="</SPAN>\n";
		html+="</td>\n"	;
		html+="</tr>\n"	;
		
	}
	
	html+="</table>\n"	;	
	html+="<br/>\n"	;	
	html+="<br/>\n"	;		
	return html;
}
// 2-Tier Use
Diagnosis.prototype.toHTML2Tier = function (){
	var html="<table width=\"100%\" class=\"etable\" ><tr>\n";
	html+="<th nowrap>健康問題</th>\n";
	html+="<td class=\"etd_execute\" ><SPAN ID=\"diagName\">"+this.name+"</SPAN></td>\n";

	html+="</tr>\n";
	html+="<input type=\"hidden\" name=\"diagId\" value=\""+this.diagId+"\">\n";;
	html+="<input type=\"hidden\" name=\"diagName\" value=\""+this.name+"\">\n";
	
	html+="<input type=\"hidden\" name=\"diagProperty\" value=\""+this.property+"\">\n";
	html+="<input type=\"hidden\" name=\""+this.diagId+"focusId\" value=\""+this.focus+"\">\n";
	html+="<input type=\"hidden\" name=\""+this.diagId+"focusName\" value=\""+this.focusName+"\">\n";
	if(this.date!="")	
	{
		html+="<tr>\n";
		html+="<th nowrap>日期時間</th>\n";
		html+="<td class=\"etd_execute\">\n";
		html+=this.date+" "+this.time;
		html+="</td>\n";
		html+="</tr>\n";	
		html+="<input type=\"hidden\" name=\"userdate\" value=\""+this.date+"\">";
		html+="<input type=\"hidden\" name=\"usertime\" value=\""+this.time+"\">";		
	
	}
	if(this.property != "R"){
		html+="<tr>\n";
		html+="<th nowrap>定義特徵</th>\n";
		html+="<td class=\"etd_execute\">\n";
		html+="<SPAN ID=\"diagObject\">";
		for(var i=0;i<this.character.length;i++)
		{
			html+=this.character[i].getCharName()+",";
			html+=this.character[i].toHTML(this.diagId);
		}	
		html+="</SPAN>\n";
		html+="</td>\n";
		html+="</tr>\n";	
	}
	
	if(this.property != "W"){
		html+="<tr>\n";
		if(this.property == "R"){
			html+="<th nowrap>危險因子</th>\n";
		}else{
			html+="<th nowrap>相關因素</th>\n";
		}
		html+="<td class=\"etd_execute\" >\n";
		for(var i=0;i<this.cause.length;i++)
		{
			html+=this.cause[i].causeName+",";
			html+=this.cause[i].toHTML(this.diagId);
		}
		html+="<SPAN ID=\"causeName\">\n";	
		html+="</SPAN>\n";	
		html+="</td>\n";
		html+="</tr>\n"	;
	}

	for(var i=0;i<this.goal.length;i++)
	{

		html+="<tr>\n";	
		html+="<th>護理目標</th>\n";	
		html+="<td class=\"plan_object\">\n";	
		html+="<SPAN ID=\"confimGoalName\">\n";		
		html+=this.goal[i].goalName+",";
		html+=this.goal[i].toHTML(this.diagId);
		html+="</SPAN>\n";		
		html+="</td>\n"	;
		html+="</tr>\n";				
	
		  
		html+="<tr>\n";
		html+="<th width=\"10%\" nowrap>預定完成日期</th>\n";	
		html+="<td class=\"etd_execute\" > \n";
		html+="<SPAN ID=\"donedate\">\n";
		html+=this.goal[i].date;
		html+="</SPAN>\n";		
		html+="</td>\n"	;
		html+="</tr>\n";

		html+="<tr>\n";
		html+="<th nowrap>護理活動</th>\n";	
		html+="<td class=\"etd_execute\" > \n";
		html+="<SPAN ID=\"interventionName\">\n";				
		var count=1;
		for(var k=0;k<this.goal[i].intervent.length;k++)
		{	

			html+=(count++)+"."+this.goal[i].intervent[k].interventName+"<br/>";			
		}			
		
		html+="</SPAN>\n";
		html+="</td>\n"	;
		html+="</tr>\n"	;
		
	}
	
	html+="</table>\n"	;	
	html+="<br/>\n"	;	
	html+="<br/>\n"	;		
	return html;
}
Diagnosis.prototype.getDiagId = function (){
	return this.diagId;
}
Diagnosis.prototype.setCharacter = function (character){
	this.character = character;
};
Diagnosis.prototype.setCause = function (cause){
	this.cause = cause;
};
Diagnosis.prototype.setGoal = function (goal){
	this.goal = goal;
};
Diagnosis.prototype.setProperty = function (property){
	this.property = property;
};