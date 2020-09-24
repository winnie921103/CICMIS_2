// === trim() ============================================================
//使用String物件之prototype屬性延伸String物件之方法
String.prototype.rTrim=rTrim;  
String.prototype.lTrim=lTrim;
String.prototype.trim=trim;

//去除右邊之空白字元
function rTrim(){
	var orgStr= this.toString(); 			//取得物件之字串
	var str=orgStr;				//將字串放入一變數, 此變數內容將於程式中被修改 
	 while( str.length >0) {	
		if (str.charAt(str.length-1) != ' '){	//檢查最後字元(str.length-1), 遇到非' '即停止
			break;			//離開迴圈
		}
		str=str.substring(0, str.length-1) ;	//遇到' '即將最後一個字元減去
	} 
	return str ;					//回傳結果
}

//去除左邊之空白字元
function lTrim(){
	var orgStr= this.toString(); 		 //自行解析
	var str=orgStr;  
	while (str.length>0){
		if (str.charAt(0) != ' '){
			break;
		}  
		str=str.substring(1, str.length) ;
	}  
	return str;
}

//去除左右兩邊之空白字元
function trim(){
	var orgStr= this.toString(); 		 //自行解析
	var str=orgStr;
	return str=(str.lTrim()).rTrim(); 
}

// === html tag [select]=================================================
// 從最後一筆往下增加
function createOption(selectName,optionText,optionValue){
	indexOption = document.all(selectName).length;
	document.all(selectName).options[indexOption] = new Option(optionText);
	document.all(selectName).options[indexOption].value = optionValue;
}
function deleteOption(selectName,indexOption){
	document.all(selectName).options[indexOption] = null;
}
function deleteOptionByValue(selectName,optionValue){
	var select = document.all(selectName);
	for(indexOption=0; indexOption< document.all(selectName).options.length; indexOption++){
		if(document.all(selectName).options[indexOption].value == optionValue){
			document.all(selectName).options[indexOption] = null;
			break;
		}
	}
}
function modifyOption(selectName){
   var len=document.all(selectName).options.length;
   optionArray=new Array(len);
   for(i=0;i<len;i++){
      optionArray[i]=new Array(2);
      optionArray[i][0]=document.all(selectName).options[i].text; 
      optionArray[i][1]=document.all(selectName).options[i].value; 
   }  
   optionArray.sort(); 
   
   //先全部刪除舊資料
   for(i=len-1;i>=0;i--){
      deleteOption(selectName,i)
   }
   //更新資料 
   for(i=0;i<len;i++){
      createOption(selectName,optionArray[i][0],optionArray[i][1]);   
   }
}

function addAll(fromSelectName,toSelectName){
	for(i=0;i<document.all(fromSelectName).options.length;i++){
		optionText = document.all(fromSelectName).options[i].text;
		optionValue = document.all(fromSelectName).options[i].value;
		createOption(toSelectName,optionText,optionValue)
	}
	// 要反向順序刪除
	for(i=document.all(fromSelectName).options.length-1;i>=0;i--){
		deleteOption(fromSelectName,i)
	}
	modifyOption(toSelectName);
}

function addSelected(fromSelectName,toSelectName){
	for(i=0;i<document.all(fromSelectName).options.length;i++){
		if(document.all(fromSelectName).options[i].selected == true){
			optionText = document.all(fromSelectName).options[i].text;
			optionValue = document.all(fromSelectName).options[i].value;
			createOption(toSelectName,optionText,optionValue);
		}
	}
	// 要反向順序刪除
	for(i=document.all(fromSelectName).options.length-1;i>=0;i--){
		if(document.all(fromSelectName).options[i].selected == true){
			deleteOption(fromSelectName,i);
		}
	}
	modifyOption(toSelectName);
}

function setSelected(selectName){
	alert("aaa");
	for(i=0;i<document.all(selectName).options.length;i++){
		document.all(selectName).options[i].selected = true;
	}
	return true;
}
function getSelectOptionText(selectName){
	return document.all(selectName).options[document.all(selectName).selectedIndex].text;
}
// === html tag [table]================================================
function createRow(tableName,indexRow){
	document.all(tableName).insertRow(indexRow);
}

function deleteRow(tableName,indexRow){
	document.all(tableName).deleteRow(indexRow);
}

function createCell(tableName,indexRow,indexCell,cellValue){
	document.all(tableName).rows[indexRow].insertCell();
	document.all(tableName).rows[indexRow].cells[indexCell].innerHTML = cellValue;
}

// === xxx_left.jsp 之 checkbox ========================================
//使用於 CHECKBOX, 限 forms[0] 內僅有 checkbox   全部選擇:selAll(1)   全部取消:selAll(0)       
function selAll(val){
   var cb=document.forms[0];
   var len=cb.elements.length;
   var i;
   for(i=0;i<len;i++){ cb.elements[i].checked=val; }
}

//全選checkBox
//fieldName:checkbox之name
//checked:全選之checkbox本身是否被勾選
function checkAll(fieldName, checked){
	var checkboxs = document.getElementsByName(fieldName);
	for(var i = 0 ; i < checkboxs.length ; i++){
		if(!checkboxs[i].disabled){
			checkboxs[i].checked = checked;
		}
	}
}

//使用於 CHECKBOX, 限 forms[0] 內僅有 checkbox, checkbox1一選擇,其他同步選擇或取消 
//Usage : <input type=checkbox name=xxx onClick=synchSel()>
function synchSel(){   
	 var cb=document.all("formQuery");
   var len=cb.elements.length;
   for(var i=0;i<len;i++){
      if(cb.elements[i].name=="cbValue"){
      		cb.elements[i].checked=cb.anchor.checked;
      }
   }
}     

//檢查是否選擇刪除項目, 配合使用於基本表單之 checkbox
function delSel(){ 
	var cb=document.all("formQuery");
	var len=cb.elements.length;
	var num=0;
	var checkbox=0;
	str = "";
	for(var i=0;i<len;i++){
   if(cb.elements[i].name=="cbValue"){
     	checkbox++;
      if(cb.elements[i].checked==0){ // 0為未被勾選
	      num++; 
	   }   	
    }
	}
	
	if(num==checkbox){ 
		if(checkbox==0)
		  alert("無可刪除之項目!");
		else
		  alert('請選擇欲刪除之項目!'); 
		//cb.anchor.checked=false; 
		return false;    //未選擇
  	}else{ 
  		return true;
  	}
  
}
// === 日期 ===============================================================

// 回傳系統當天日期 return 2001-09-22
function getToday(){
	var monthDigital = new Array("01","02","03","04","05","06","07","08","09","10","11","12");
	var today = new Date();
	var thisYear = today.getFullYear();	// 年 YYYY
	var thisMonth = today.getMonth();	// 月 0-11
	var thisDate = today.getDate();		// 日 1-31
	var thisDay = today.getDay();		// 星期 0-6
	
	return thisYear+"-"+monthDigital[thisMonth]+"-"+thisDate;
}

//開啟月曆, 只有日期無時間 
function openCalNOTime(obj1,obj2,obj3){
    var selectedDate;
	var nowYear  = obj1.value;
	var nowMonth = obj2.value;
	var nowDay   = obj3.value;
	
	//document.all(obj).value = window.showModalDialog("../../utils/calendar.htm","","center:yes;dialogLeft:30;dialogTop:35;dialogWidth:20;dialogHeight:15");
	//document.all(obj).value = document.all(obj).value ;
	selectedDate = window.showModalDialog("../../utils/calendar.htm","","center:yes;dialogLeft:30;dialogTop:35;dialogWidth:20;dialogHeight:15");
	if(selectedDate != null) {
		obj1.value = selectedDate.substring(0,4);
		obj2.value = selectedDate.substring(5,7);
		obj3.value = selectedDate.substring(8,10);
	}	
	if(obj1 == "undefined"){
		obj1.value = nowYear;		
	}
	if(obj2 == "undefined"){
		obj2.value = nowMonth;		
	}
	if(obj3.value == "undefined"){		
		obj3 = nowDay;
	}
}

//自動轉換日期格式   Usage:onBlur="changeDate(this)"
//請於 <input type="text"> 內以 maxlength="10" 限制使用者能輸入之最大字數 ex.2001-10-10(10 char)
function changeDate(obj){
   var year,month,dat;
   var str=obj.value;
   //設定能夠接受下列格式  ex.60.04.27, 60.4.3, 1971.04.27, 1971.4.3
   if((str.indexOf('.')!=-1)||(str.indexOf('/')!=-1)){
      for(i=0;i<2;i++){
         str=str.replace('.','-'); 
         str=str.replace('/','-'); 
      }
   }
   if(str.length==0){  
   }else if(str.length<6){
   }else if((str.indexOf('-')==-1)&&(str.length==8)){        //19710427
      year=str.substring(0,4);
      month=str.substring(4,6); 
      dat=str.substring(6,8);
      
      if(isCorrect(year,month,dat)){ 
         obj.value=year+"-"+month+"-"+dat;
      }else{
         obj.value="";
         return;
      }      
   }else if((str.indexOf('-')==-1)&&(str.length==6)){        //600427
      year=str.substring(0,2);
      month=str.substring(2,4); 
      dat=str.substring(4,6);
      year=1911+parseInt(year,10);
      
      if(isCorrect(year,month,dat)){
         obj.value=year+"-"+month+"-"+dat;
      }else{
         obj.value="";
         return;
      }
            
   //}else if(str.indexOf('-')==-1){
   //以下為含 - 之民國年的情況  ex.60-04-27, 60-12-1, 60-4-27, 60-4-3 
   }else if(str.indexOf('-')==2){
      var i=str.lastIndexOf('-');
      year=str.substring(0,2);
      month=str.substring(3,i);
      dat=str.substring(i+1,str.length);
      year=1911+parseInt(year,10);
      if(month.length==1){ month='0'+month; }
      if(dat.length==1){ dat='0'+dat; }
      
      if(isCorrect(year,month,dat)){
         obj.value=year+"-"+month+"-"+dat;
      }else{
         obj.value="";
         return;
      }      
   //以下為含 - 之西元年的情況  ex.1971-04-27, 1971-12-1, 1971-4-27, 1971-4-3  
   }else if(str.indexOf('-')==4){
      var i=str.lastIndexOf('-');
      year=str.substring(0,4);
      month=str.substring(5,i);
      dat=str.substring(i+1,str.length);
      if(month.length==1){ month='0'+month; }
      if(dat.length==1){ dat='0'+dat; }
      if(isCorrect(year,month,dat)){
         obj.value=year+"-"+month+"-"+dat;
      }else{
         obj.value="";
         return;
      }
   } 
}

//檢查是否符合年月日之規訂 return true/false 
//Y:1900~2100, M:1~12, D:1~28|29|30|31 
function isCorrect(year,month,dat){
   var Y=year;            //var Y=parseInt(year);
   var M=month;           //var M=parseInt(month);
   var D=dat;             //var D=parseInt(dat);
   if((Y<1900)||(M<1)||(D<1)||(Y>2100)||(M>12)||(D>31)){return false;
   }else if((M==4)||(M==6)||(M==9)||(M==11)){return (D>30)?false:true;   //4, 6, 9, 11月有30天
   }else if((M==2)&&(((Y%4==0)&&(Y%100!=0))||(Y%400==0))){return (D>29)?false:true; //是否閏年                 //閏年2月29天, 其餘28天
   }else if(M==2){return (D>28)?false:true;
   }else{return true;}
}

/* 跳脫特殊字元 ======== begin ======== */
var mREs = new Array(/&/g, new RegExp("<","g"), new RegExp(">","g"), new RegExp("\"","g"));
var mRPs = new Array("&amp;", "&lt;", "&gt;", "&quot;");
var mREs_GET = new Array(/&/g, new RegExp("<","g"), new RegExp(">","g"), 
								new RegExp("\"","g"), new RegExp("\\?","g"), new RegExp("\\s","g"));
var mRPs_GET = new Array("%26", "%3C", "%3E", "%22", "%3F", "%20");

/**
 * 跳脫XML保留字
 * &: &amp;
 * <: &lt;
 * >: &gt;
 * ": &quot;
 */
function escapeXml(str){
	if(str==null) return "";
	str = str.replace(mREs[0], mRPs[0]);
	str = str.replace(mREs[1], mRPs[1]);
	str = str.replace(mREs[2], mRPs[2]);
	str = str.replace(mREs[3], mRPs[3]);
	return str;
}
/**
 * 跳脫Html保留字
 */
function escapeHtml(str){
	if(str==null) return "";
	str = str.replace(mREs[1], mRPs[1]);
	str = str.replace(mREs[2], mRPs[2]);
	str = str.replace(mREs[3], mRPs[3]);
	return str;
}

/**
 * 跳脫Http GET保留字
 * &: %26
 * <: %3C
 * >: %3E
 * ": %22
 * ?: %3F
 * space: %20
 */
function escapeHttpGet(str){
	if(str==null) return "";
	
	str = str.replace(mREs_GET[0], mRPs_GET[0]);
	str = str.replace(mREs_GET[1], mRPs_GET[1]);
	str = str.replace(mREs_GET[2], mRPs_GET[2]);
	str = str.replace(mREs_GET[3], mRPs_GET[3]);
	str = str.replace(mREs_GET[4], mRPs_GET[4]);
	str = str.replace(mREs_GET[5], mRPs_GET[5]);
	
	return str;
}
/* 跳脫特殊字元 ======== end ======== */

/*插入字串-- 開始*/
//記錄最後的焦點位置byEmily
function Tags_Focus(fObj)
{			
	window.LastFocusId =  fObj.id;	
}
//貼上字串功能byEmily
function Tags_String(fStr) 
{
	if(window.LastFocusId)
	{	
		var lObjTags = document.getElementById(window.LastFocusId);
		lObjTags.focus();
		try{
			document.selection.createRange().text = fStr;
		}catch(E){
			lObjTags.value += fStr;
		}
		
	}	
	
	
	
	if (document.selection) {
        var sel = document.selection.createRange();
        sel.text = str;
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
        cursorPos += str.length;
        obj.selectionStart = obj.selectionEnd = cursorPos;
    } else {
        obj.value += str;
    }

}
/*插入字串-- 結束*/
