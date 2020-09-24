/*
所有 Nurse Event 在網頁中使用的 function
function getDate_old(value,selType,nowDate,nowTime)	呼叫萬年曆
function getDate(value,selType,nowDate,nowTime)     呼叫萬年曆(for萬芳用)
function addSelectData(dataType,title,val)    	將輸入的項目加入 Select 物件中
function updateSelectData(dataType,title,val)	將輸入的項目更新至 Select 物件指定的項目中
function getSelectDataValue(dataType)         	將編輯資料組成 Select 使用的字串項目(整批輸入時使用)
function onDateChange(DateValue,nowDate,nowTime)        檢查輸入日期(如果系統時間<10:00則可以輸入前一日資料)(for萬芳用)
function checkTime_old(fieldName,DateValue,nowDate,nowTime)	檢查輸入時間是否異常
function checkTime(fieldName,DateValue,nowDate,nowTime)     檢查輸入時間是否異常(for萬芳用)
function showReasonItem(selType,selTab,fm)        是否顯示無法測量原因項目(類型,欄位名,FormName)
function showData(selType)	呼叫顯示確認頁面(Vital Sign , Coma Scale 輸入完成的確認畫面處理)
function checkLen(fieldName,msg)	      檢查 輸入的身高體重腹圍資料是否錯誤
function chkDataOnly(dataType,type,datetime,funType)	      檢查 日期時間記錄是否已存在	
*/

// 是否需要檢查日期 0:要檢查 1:不檢查 2:僅可<系統日一天,但不限系統時間是否<9點
var nurseTools_isCheckDate=0

// 開啟引流管種類,部位視窗
function openDrainage(url, filename, vType)
{
    var wh="center:yes;dialogLeft:30;dialogTop:450;dialogWidth:25;dialogHeight:18"
    var getNumV = window.showModalDialog(url + '?type='+vType,'',wh)
    if (getNumV  && getNumV != null)	{
        var s="document.all('"+filename+"').value='"+getNumV+"'"
        eval(s)
    } else {
        var s="document.all('"+filename+"').value=''"
        eval(s)
    }
}

//== usage outside: I/O, OTHERS =======start==========
// 檢視字串長度
function countLen(title){
    var realLen=0;
    for (var i = 0; i < title.length; i++) {
        var no = title.charCodeAt(i);
        //if((no>127)||(no<33)){	// 非鍵盤上的字元就當成是雙位元字
        if (no > 126) {
            realLen += 2;
        } else {
            realLen++;
        }
    }
    return realLen;
}

// 將輸入的項目加入 Select 物件中
function addSelectData(dataType, title, val) {
    var selectObj = document.all(dataType);
    for (var i = selectObj.length; i > 0; i--)
    {  //將所有資料往後移一個位置
        var oldvalue = selectObj.options[i - 1].value;
        var oldtext = selectObj.options[i - 1].text;
        selectObj.options[i] = new Option(oldtext);
        selectObj.options[i].value = oldvalue;
    }
    if(countLen(title)>50 ){
        title= title.substring(0,50)+"‧‧‧";
    }
    // 將新增資料加入第一個位置
    selectObj.options[0] = new Option(title);
    selectObj.options[0].value = val;
}

// 將輸入的項目更新至 Select 物件指定的項目中
function updateSelectData(dataType, title, val) {
    var isUpdated = false;
    var selectObj = document.all(dataType);
    var selectedIdx = selectObj.selectedIndex;
    if (selectedIdx == -1) {
        alert("未指定更新的項目，不得更新 !!");
    } else {
        if (selectObj.options[selectedIdx].value.substring(0, 5) != "=====") {
            // 更新內容
            selectObj.options[selectedIdx] = new Option(title);
            selectObj.options[selectedIdx].value = val;
            isUpdated = true;
        }
    }
    return isUpdated;
}

// 移出選擇項目
function deleteSelectData(dataType) {
    var selectObj = document.all(dataType);
    var selectedIdx = selectObj.selectedIndex;
    if (selectedIdx >= 0) {
        var selectedValue = selectObj.options[selectedIdx].value;
        if (selectedValue.substring(0, 5) != "=====") selectObj.options.remove(selectedIdx);
    }
}
//== usage outside: I/O, OTHERS======end==========
/** 呼叫萬年曆 by Emily
/* value:目前日期欄位的值
/* dateField:日期欄位的名稱
/* timeField:時間欄位的名稱
/* nowDate:目前日期
/* nowTime:目前時間
**/
function getPlanDate(value, dateField, timeField, nowDate, nowTime) {
    var chkok = true;
    var getdate;    
    if(timeField=='null')
    {
    	timeField = "time";
    }
    //while (chkok) {
        //getdate = window.showModalDialog("../../utils/calendar1.htm", "", "center:yes;dialogLeft:30;dialogTop:35;dialogWidth:20;dialogHeight:16");
        //if (getdate == "undefined" || getdate == null) {
            getdate = (value == null) ? '' : value;
        //}
        document.all(dateField).value = getdate;
        if (dateField.indexOf("goalDesireDate") > -1 ) {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                alert("預定完成日期不得小於健康問題開始日期時間!!");
                chkok = true;                
            } else {
                chkok = false;
	            // 如果有更換日期,則將時間設為0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
            
            if(document.all("goalSetupDate")!=null && !chkok){
	            var ds = compareDays(getdate, document.all("goalSetupDate").value);
	            if (ds < 0) {
	                alert("預定完成日期不得小於目標開始日期!!");
	                chkok = true;                	                
	            } else {
	                chkok = false;
		            // 如果有更換日期,則將時間設為0000
		            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
		                document.all(timeField).value = '0000';
		            }	                
	            }
            }
        } else if (dateField.indexOf("goalSetupDate") > -1) {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                alert("目標開始日期時間不得小於健康問題開始日期時間!!");
                chkok = true;                
            } else {
                chkok = false;
	            // 如果有更換日期,則將時間設為0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
            
            if(document.all("goalSetupDate")!=null && !chkok){
	            var ds = compareDays(getdate, document.all("goalSetupDate").value);
	            if (ds < 0) {
	                alert("目標開始日期時間不得小於目標開始日期!!");
	                chkok = true;                	                
	            } else {
	                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
		            // 如果有更換日期,則將時間設為0000
		            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
		                document.all(timeField).value = '0000';
		            }	                
	            }
            }
        } else if (dateField == "setupDate" ) {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                alert("措施設立日期不得小於健康問題開始日期!!");
                chkok = true;                
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
	            // 如果有更換日期,則將時間設為0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
            
            if(document.all("goalDate")!=null && !chkok){
	            var ds = compareDays(getdate, document.all("goalDate").value);
	            if (ds < 0) {
	                alert("預定完成日期不得小於目標開始日期!!");
	                chkok = true;                	                
	            } else {
	                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
		            // 如果有更換日期,則將時間設為0000
		            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
		                document.all(timeField).value = '0000';
		            }	                
	            }
            }
        } else if (dateField.indexOf("intdate") ==0 ) {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("setupDate"+dateField.substring(7)).value);
            if (ds < 0) {
                alert("措施及衛教開始日期不得小於健康問題開始日期 !!");
                chkok = true;                
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
	            // 如果有更換日期,則將時間設為0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
        }else if (dateField.indexOf("Alldate") ==0  ) {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("AllsetupDate"+dateField.substring(7)).value);
            if (ds < 0) {
                alert("措施及衛教開始日期不得小於健康問題開始日期 !!");
                chkok = true;                
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
	            // 如果有更換日期,則將時間設為0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
        }else if (dateField == "achieveUserDate" || dateField == "userSolveDate") {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                if (dateField == "achieveUserDate") {
                    alert("達成日期不得小於健康問題開始日期!!");
                } else if (dateField == "userSolveDate") {
                    alert("健康問題解決日期時間不得小於健康問題開日期時間");
                }
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
                // 如果有更換日期,則將時間設為0000
                if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
                    document.all(timeField).value = '0000';
                }
            }
        } else {    	
            chkok = onDateChange(dateField, timeField, nowDate, nowTime);
            // 如果有更換日期,則將時間設為0000
            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
                document.all(timeField).value = '0000';
            }
        }
        
        //假如檢查結果為false，須一併重新設定日期
        if(!chkok){
          	getdate = document.all(dateField).value
        }
    //}
    return getdate;
}

/** 呼叫萬年曆 by Emily
/* value:目前日期欄位的值
/* dateField:日期欄位的名稱
/* timeField:時間欄位的名稱
/* nowDate:目前日期
/* nowTime:目前時間
**/
function getPlanDate2(value, dateField, timeField, nowDate, nowTime) {
    var chkok = true;
    var getdate;    
    if(timeField=='null')
    {
    	timeField = "time";
    }
    while (chkok) {
        getdate = window.showModalDialog("../../utils/calendar1.htm", "", "center:yes;dialogLeft:30;dialogTop:35;dialogWidth:20;dialogHeight:16");
        if (getdate == "undefined" || getdate == null) {
            getdate = (value == null) ? '' : value;
        }
        document.all(dateField).value = getdate;
        if (dateField.indexOf("goalDesireDate") > -1 ) {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                alert("預定完成日期不得小於健康問題開始日期時間!!");
                chkok = true;                
            } else {
                chkok = false;
	            // 如果有更換日期,則將時間設為0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
            
            if(document.all("goalSetupDate")!=null && !chkok){
	            var ds = compareDays(getdate, document.all("goalSetupDate").value);
	            if (ds < 0) {
	                alert("預定完成日期不得小於目標開始日期!!");
	                chkok = true;                	                
	            } else {
	                chkok = false;
		            // 如果有更換日期,則將時間設為0000
		            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
		                document.all(timeField).value = '0000';
		            }	                
	            }
            }
        } else if (dateField.indexOf("goalSetupDate") > -1) {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                alert("目標開始日期時間不得小於健康問題開始日期時間!!");
                chkok = true;                
            } else {
                chkok = false;
	            // 如果有更換日期,則將時間設為0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
            
            if(document.all("goalSetupDate")!=null && !chkok){
	            var ds = compareDays(getdate, document.all("goalSetupDate").value);
	            if (ds < 0) {
	                alert("目標開始日期時間不得小於目標開始日期!!");
	                chkok = true;                	                
	            } else {
	                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
		            // 如果有更換日期,則將時間設為0000
		            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
		                document.all(timeField).value = '0000';
		            }	                
	            }
            }
        } else if (dateField == "setupDate" ) {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                alert("措施設立日期不得小於健康問題開始日期!!");
                chkok = true;                
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
	            // 如果有更換日期,則將時間設為0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
            
            if(document.all("goalDate")!=null && !chkok){
	            var ds = compareDays(getdate, document.all("goalDate").value);
	            if (ds < 0) {
	                alert("預定完成日期不得小於目標開始日期!!");
	                chkok = true;                	                
	            } else {
	                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
		            // 如果有更換日期,則將時間設為0000
		            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
		                document.all(timeField).value = '0000';
		            }	                
	            }
            }
        } else if (dateField.indexOf("intdate") ==0 ) {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("setupDate"+dateField.substring(7)).value);
            if (ds < 0) {
                alert("措施及衛教開始日期不得小於健康問題開始日期 !!");
                chkok = true;                
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
	            // 如果有更換日期,則將時間設為0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
        }else if (dateField.indexOf("Alldate") ==0  ) {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("AllsetupDate"+dateField.substring(7)).value);
            if (ds < 0) {
                alert("措施及衛教開始日期不得小於健康問題開始日期 !!");
                chkok = true;                
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
	            // 如果有更換日期,則將時間設為0000
	            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
	                document.all(timeField).value = '0000';
	            }	                
            }
        }else if (dateField == "achieveUserDate" || dateField == "userSolveDate") {
            //計算日期相差天數
            var ds = compareDays(getdate, document.all("date").value);
            if (ds < 0) {
                if (dateField == "achieveUserDate") {
                    alert("達成日期不得小於健康問題開始日期!!");
                } else if (dateField == "userSolveDate") {
                    alert("健康問題解決日期時間不得小於健康問題開日期時間");
                }
            } else {
                chkok = onDateChange(dateField,timeField, nowDate, nowTime);
                // 如果有更換日期,則將時間設為0000
                if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
                    document.all(timeField).value = '0000';
                }
            }
        } else {    	
            chkok = onDateChange(dateField, timeField, nowDate, nowTime);
            // 如果有更換日期,則將時間設為0000
            if (timeField != null && timeField.length > 0 && !chkok && value != getdate && document.all(timeField) != null) {
                document.all(timeField).value = '0000';
            }
        }
        
        //假如檢查結果為false，須一併重新設定日期
        if(!chkok){
          	getdate = document.all(dateField).value
        }
    }
    return getdate;
}

// 呼叫萬年曆(for萬芳用)
function getDate(value,selType,nowDate,nowTime, inDate, endDate){
    var chkok = true;
    var getdate;
    while (chkok) {
    	getdate = window.showModalDialog("../../utils/calendar1.htm", "", "center:yes;dialogLeft:30;dialogTop:35;dialogWidth:20;dialogHeight:16");
        
    	//getdate = window.open(globalDataPath, "calWindow", "height=240, width=380, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
        if (getdate == "undefined" || getdate == null) {
            getdate = (value == null) ? '' : value;
        }
        document.all(selType + '.DATE').value = getdate;
        // 若為查詢則不檢查
        if (selType=="SEARCHB" || selType=="SEARCHE" || selType=="SEARCH") {
            // 若為查詢起始日,不得<住院日期
            if (selType == "SEARCHB" && compareDays(inDate, getdate) > 0) getdate = inDate;
            chkok = false;
        }else if(selType=="occurdate"){
			 // 傷口記錄目前檢核的狀態
            var old_nurseTools_isCheckDate = nurseTools_isCheckDate;
            //傷口的發生時間的檢查，只需檢查不可大於系統日期時間
            nurseTools_isCheckDate = 1;
            chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            // 排便時間處理完還是要還原其它時間的檢核狀態
            nurseTools_isCheckDate = old_nurseTools_isCheckDate;
        }else if(selType=="STOOL"){
            // 記錄目前檢核的狀態
            var old_nurseTools_isCheckDate = nurseTools_isCheckDate;
            //排便的測量時間的檢查，只需檢查不可大於系統日期時間
            nurseTools_isCheckDate = 1;
            chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            if (!chkok && compareDays(inDate, getdate) > 0) {
                alert('不可早於住院時間('+inDate+')!');
                chkok = true;
            }
            // 排便時間處理完還是要還原其它時間的檢核狀態
            nurseTools_isCheckDate = old_nurseTools_isCheckDate;
        }else if(selType.indexOf("Sign")==0){
            //排便的測量時間的檢查，只需檢查不可大於系統日期時間
            chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            if (!chkok && compareDays(inDate, getdate) > 0) {
                alert('不可早於醫囑生效時間('+inDate+')!');
                chkok = false;
            }
            if (!chkok && compareDays(endDate, getdate) < 0) {
                alert('不可晚於醫囑結束時間('+inDate+')!');
                getdate=value;
                chkok = false;
            }
        }else{ 
            if(nurseTools_isCheckDate!=1)
            	nurseTools_isCheckDate = 0;
            //護理記錄10點前不用判斷權限
            if(selType.indexOf("RECORD")==0||selType.indexOf("VS")>-1 || selType.indexOf("SPEVENT")>-1 || selType.indexOf("ENCOUNTER_SPECIAL")>-1
            		|| selType.indexOf("INPUT")>-1 || selType.indexOf("OUTPUT")>-1 || selType.indexOf("TRAUMA")>-1 || selType.indexOf("woundRecord")>-1
            		|| selType.indexOf("CHECK")>-1){
            	chkok=onDateChange2(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            }else{
            	chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            }
            //假如檢查結果為false，須一併重新設定日期
            if(!chkok){
            	getdate = document.all(selType + '.DATE').value
            }
        }
        if(selType=='VS'){
        	try{setAllDate(getdate);}catch(E){}
        }
        
    }	
    return getdate;
}



//伤口记录呼叫萬年曆 
function getDatePat(value,selType,nowDate,nowTime, inDate, endDate){
    var chkok = true;
  
    var getdate;
   
    while (chkok) {
    	getdate = window.showModalDialog("../../utils/calendar1.htm", "", "center:yes;dialogLeft:30;dialogTop:35;dialogWidth:20;dialogHeight:16");
        
    	//getdate = window.open(globalDataPath, "calWindow", "height=240, width=380, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
        if (getdate == "undefined" || getdate == null) {
            getdate = (value == null) ? '' : value;
        }
        document.all(selType + '.DATE').value = getdate;
        // 若為查詢則不檢查
        if (selType=="SEARCHB" || selType=="SEARCHE" || selType=="SEARCH") {
            
        	// 若為查詢起始日,不得<住院日期
            if (selType == "SEARCHB" && compareDays(inDate, getdate) > 0) getdate = inDate;
            chkok = false;
        }else if(selType=="occurdate"){
        	 // 傷口記錄目前檢核的狀態
            var old_nurseTools_isCheckDate = nurseTools_isCheckDate;
            //傷口的發生時間的檢查，只需檢查不可大於系統日期時間
            nurseTools_isCheckDate = 1;
            chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            // 排便時間處理完還是要還原其它時間的檢核狀態
            nurseTools_isCheckDate = old_nurseTools_isCheckDate;
        }else if(selType=="STOOL"){
        	
        	// 記錄目前檢核的狀態
            var old_nurseTools_isCheckDate = nurseTools_isCheckDate;
            //排便的測量時間的檢查，只需檢查不可大於系統日期時間
            nurseTools_isCheckDate = 1;
            chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            if (!chkok && compareDays(inDate, getdate) > 0) {
                alert('不可早於住院時間('+inDate+')!');
                chkok = true;
            }
            // 排便時間處理完還是要還原其它時間的檢核狀態
            nurseTools_isCheckDate = old_nurseTools_isCheckDate;
        }else if(selType.indexOf("Sign")==0){
          
        	//排便的測量時間的檢查，只需檢查不可大於系統日期時間
            chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            if (!chkok && compareDays(inDate, getdate) > 0) {
                alert('不可早於醫囑生效時間('+inDate+')!');
                chkok = false;
            }
            if (!chkok && compareDays(endDate, getdate) < 0) {
                alert('不可晚於醫囑結束時間('+inDate+')!');
                getdate=value;
                chkok = false;
            }
        }else{ 
        	if(nurseTools_isCheckDate!=1)
            	nurseTools_isCheckDate = 0;
            //護理記錄10點前不用判斷權限
            if(selType.indexOf("RECORD")==0||selType.indexOf("VS")>-1 || selType.indexOf("SPEVENT")>-1 || selType.indexOf("ENCOUNTER_SPECIAL")>-1
            		|| selType.indexOf("INPUT")>-1 || selType.indexOf("OUTPUT")>-1 || selType.indexOf("TRAUMA")>-1 || selType.indexOf("woundRecord")>-1
            		|| selType.indexOf("CHECK")>-1){
            	chkok=onDateChange2(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            }else{
            	chkok=onDateChange(selType + '.DATE',selType + '.TIME',nowDate,nowTime);
            }
            //假如檢查結果為false，須一併重新設定日期
            if(!chkok){
            	getdate = document.all(selType + '.DATE').value
            }
        }
        if(selType=='VS'){
        	try{setAllDate(getdate);}catch(E){}
        }
        
    }	
   
  
    if (inDate != "undefined" && inDate != null) {
    	var chOccurDate =inDate.replace("/", "");
    	chOccurDate=chOccurDate.replace("/", "");
    	chOccurDate=parseInt(chOccurDate)+parseInt("19110000");
    	var OccurDate=getdate.replace("/", "");
    	OccurDate=OccurDate.replace("/", "");
    	if(OccurDate<chOccurDate){
    		alert("不得早於傷口建立時間");
    		getdate = nowDate;
    		
    	}
    }
    return getdate;
}


//呼叫萬年曆(for清泉用)
function getDateQingQuan(value, selType, nowDate, nowTime, flag){
	var chkok = true;
	var getdate;
	while (chkok) {
		getdate = window.showModalDialog("../../utils/calendar1.htm", "", "center:yes;dialogLeft:30;dialogTop:35;dialogWidth:20;dialogHeight:16");
		if (getdate == "undefined" || getdate == null) {
			getdate = (value == null) ? '' : value;
		}
		document.all(selType + '.DATE').value = getdate;
		chkok = false;

//    	var old_nurseTools_isCheckDate = nurseTools_isCheckDate;
//        //傷口的發生時間的檢查，只需檢查不可大於系統日期時間
//        nurseTools_isCheckDate = 1;
//        var currDate = new Date().format("yyyy/MM/dd");
//        chkok = onDateChange(currDate,selType + '.TIME', currDate,nowTime);
//        // 排便時間處理完還是要還原其它時間的檢核狀態
//        nurseTools_isCheckDate = old_nurseTools_isCheckDate;
	}
	return getdate;
}

//呼叫萬年曆 中山手術前檢查表使用
function getDateOperation(value, selType, nowDate, nowTime, flag, overDt){
	var chkok = true;
	var getdate;
	while (chkok) {
		getdate = window.showModalDialog("../../utils/calendar1.htm", "", "center:yes;dialogLeft:30;dialogTop:35;dialogWidth:20;dialogHeight:16");
		if (getdate == "undefined" || getdate == null) {
			getdate = (value == null) ? '' : value;
		}
		document.all(selType + '.DATE').value = getdate;
		document.all(selType + 'overDateTime').value = getdate + " " + nowTime;//設置隱藏值
		chkok = false;
	}
	return getdate;
}

Date.prototype.Format = function(fmt) { //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  

// 呼叫顯示確認頁面
function showData(selType) {
    var ifShow = true;
    if (selType == "VITALSIGN") {
        // 取得各填寫資料內容
        ifShow = onVitalSignSubmit();
        if (ifShow)setVitalSignConfirmValue();
    } else if (selType == "COMASCALE") {
        ifShow = onComaScaleSubmit();
        if (ifShow)setComaScaleConfirmValue();
    } else if (selType == "SPEVENT") {
        // 特殊事件
        ifShow = onSpecialSubmit();
        if (ifShow)setSpecialConfirmValue();
    } else if (selType == "IOutput") {
        document.all("V_INPUT").value = composeVData('INPUT');
        document.all("V_OUTPUT").value = composeVData('OUTPUT');
    } else if (selType == "INPUT" || selType == "OUTPUT") {
        document.all('V_' + selType).value = document.all(selType).value;
        document.all('V_' + selType + '.ID').value = document.all(selType + '.ID').value;
    } else {
        setOthersConfirmValue(selType);
    }
    // 檢查都通過後才disabledButton並執行submit
    if (ifShow) {
        disabledButton(ifShow);
        var rwin = window.open('', 'showDataForm', 'width=700,height=300,resizable=0,scrollbars=1,left=200,top=250');
        document.showDataForm.submit();
    }
}

/**
 * @param selType 表單類型
 * @param signEdit 是否為單個事件更新
 * @return
 */
function showSingleData(selType,signEdit){
	 var ifShow = true;
	    if (selType == "VITALSIGN") {
	        // 取得各填寫資料內容
	        ifShow = onVitalSignSubmit();
	        if (ifShow)setVitalSignConfirmSignleValue(signEdit);
	    } else if (selType == "COMASCALE") {
	        ifShow = onComaScaleSubmit();
	        if (ifShow)setComaScaleConfirmValue();
	    } else if (selType == "SPEVENT") {
	        // 特殊事件
	        ifShow = onSpecialSubmit();
	        if (ifShow)setSpecialConfirmValue();
	    } else if (selType == "IOutput") {
	        document.all("V_INPUT").value = composeVData('INPUT');
	        document.all("V_OUTPUT").value = composeVData('OUTPUT');
	    } else if (selType == "INPUT" || selType == "OUTPUT") {
	        document.all('V_' + selType).value = document.all(selType).value;
	        document.all('V_' + selType + '.ID').value = document.all(selType + '.ID').value;
	    } else {
	        setOthersConfirmValue(selType);
	    }
	    // 檢查都通過後才disabledButton並執行submit
	    if (ifShow) {
	        disabledButton(ifShow);
	        var rwin = window.open('', 'showDataForm', 'width=700,height=300,resizable=0,scrollbars=1,left=200,top=250');
	        document.showDataForm.submit();
	    }
}

//密切測量用到
function showSpeciallVitalSignData(types) {
    var ifShow = onVitalSignSubmit2();
    if (ifShow)setVitalSignConfirmValue2(types);
    return ifShow;
}

// 變更無法測量原因時處理
function changeReason(selType, selVal, secFlag) {
    // 將畫面定為不可直接離開
    document.all('chkClose').value = '1';
    var tmp = '';
    // 如果為體溫或脈搏,類型不輸入
    if (selVal > 0 && (selType == "BT" || selType == "PULSE")) {
        document.all(selType + '.TYPE').value = '';
        deSelectRadios(document.all(selType + '.VTYPE'));
    }
    if (selType != "NECK" && selType != "WAIST" && selType.indexOf('ARM') < 0 && selType.indexOf('LEG') < 0
            && selType.indexOf('THIGH') < 0 && selType != "ANKLE"
            && selType != "BUTTOCK" && selType != "CHEST" && selType != "GIRTH" && selType != "WEIGHT"
            && selType != "HEIGHT" && selType != "HEAD"){
        document.all(selType + '_TREATMENT_DIV').style.display = 'block';
        document.all(selType + '.TREATMENT').value = '';
        if (secFlag)document.all(selType + '_TREATMENT_DIV2').style.display = 'block';
        // 如果為測不到項目,擇需要顯示處置
        if (selVal == 1) {
            var textval = document.all(selType + '.TREATMENT').value
      //      textval += '心跳及呼吸測不到，血壓::___/___mmHg，意識狀態:E___V___M___，瞳孔大小:___/___(+-±/+-±)，急通知:_______醫師並於__:__開始施行心肺復甦術，置入氣管內管__Fr.，固定___cm，予氧氣(呼吸器:VC/SIMV+PS/PS/PC Mode，TV:____，rate:__次/分，FiO2:__%， PEEP:__，PC:__)，抽痰並保持呼吸道通暢，痰量多/少，___(性質)，___(顏色)，___，密切監測心電圖及血壓。Bosmin 1支IV st. at____，予N.S. 500cc+Dopamine 2 Amp IVF___gtt/min，心電圖：VT，電擊___焦耳，續行心肺復甦術。';
            textval += '心跳及呼吸測不到，血壓:__/mmHg，意識狀態:E_V_M，瞳孔大小:/(±　　/±)，急通知:____醫師並於:開始施行心肺復甦術，置入氣管內管Fr.，固定_cm，予氧氣(呼吸器:VC/SIMV+PS/PS/PC Mode，TV:ml，rate:次/分，FiO2:%， PEEP:cm-H2O，PC: cm-H2O，PS:__ cm-H2O)，抽痰並保持呼吸道通暢，痰量多/少，_(性質)，(顏色)，，密切監測心電圖及血壓。Bosmin 1支IV st. at，予N.S. 500cc+Dopamine 2 Amp Gipamine600mg/200ml Levophed Amp IVF_gtt/min，心電圖：VT，電擊_焦耳，續行心肺復甦術。';
            //disabled護理處置欄位
            document.all(selType + '.NURS_TREAT1').disabled = true;
            document.all(selType + '.TREATMENT').value = textval;
        }else if(selVal > 0){
            document.all(selType + '_TREATMENT_DIV').style.display = 'none';
        }
    }
}

// 檢查 輸入的身高體重腹圍資料是否錯誤
function checkLen(selType, msg, fm) {
    var fieldName = selType + ".VALUE1";
    var retVal = chkNum(fieldName, msg);
    // 是否顯示無法測量原因項目
    if (retVal) showReasonItem(selType, 'VALUE1', fm, false);
    return retVal;
}

//選擇指定的 Option 值
function selectOptionByValue(fieldName, value){
    var selectObj = document.all(fieldName);
     for (var i = 0; i < selectObj.length; i ++) {
         if (value == selectObj.options[i].value) {
             selectObj.options[i].selected = true;
             break;
         }
     }
     //排便 其它显示text
     if(fieldName == 'STOOL.VALUE2'){
    	 var isOther = value == '198';
    	 document.all('STOOL.NATURE.NOTE').style.display = isOther ? 'block' : 'none';
	        // 清除其它欄位值
	     document.all('STOOL.NATURE.NOTE').value = '';
     }
     if(fieldName == 'STOOL.VALUE2'){
    	 var isOther = value == '228';
    	 document.all('STOOL.COLOR.NOTE').style.display = isOther ? 'block' : 'none';
	        // 清除其它欄位值
	     document.all('STOOL.COLOR.NOTE').value = '';
     }
}

//選擇指定的 Radio 值
function selectRadioByValue(fieldName, value){
    var radioObj = document.all(fieldName);
     for (var i = 0; i < radioObj.length; i ++) {
         if (value == radioObj[i].value) {
             radioObj[i].checked = true;
             break;
         }
     }
}

//選擇指定的 Option 欄位值
function selectOptionByInnerText(fieldName, innerText){
    var selectObj = document.all(fieldName);
     for (var i = 0; i < selectObj.length; i ++) {
         if (innerText == selectObj.options[i].innerText) {
             selectObj.options[i].selected = true;
             break;
         }
     }
}

// 取得選取欄位的文字內容
function getSelectedInnerText(fieldName) {
    var selectedInnerText = '';
    var selectObj = document.all(fieldName);
    if(selectObj!=null){
    	if (null != selectObj.selectedIndex) {
            selectedInnerText = selectObj[selectObj.selectedIndex].innerText;
        }
    }
    
    return selectedInnerText;
}

// radio groups 全不選
function deSelectRadios(radioGroup){
    for(var i=0; i<radioGroup.length; i++){
        radioGroup[i].checked = false;
    }
}

//組合VData 字串, selectField: Select 型態欄位
function composeVData(selectField){
    var selectObj = document.all(selectField);
    var vData = '';
    for (var i = 0; i < selectObj.length - 1; i++) {
        vData += "`" + selectObj.options[i].value;
    }
    return vData;
}

/*
*此 function for萬芳用
*判斷基準為系統時間當日10:00
*若超過此時間，只能輸入當日資料
*若為此時間之前，可輸入前一日資料
*/
function checkTime(fieldName, DateValue, nowDate, nowTime) {
    var isValid = true;
    var fieldObj = document.all(fieldName);
    // 有輸入值才檢查
    if (fieldObj.value != '') {
        // 如果沒有輸入日期資料則不檢查
        if (checkTime.arguments.length == 2 && DateValue.length == 0) {
            fieldObj.value = '';
        } else {
            // 檢查長度 & 是否為數值資料
            isValid = chkMinMaxLen(fieldName, 4, 4, "時間資料") && chkNum(fieldName, "時間資料");
            if (isValid) {
                // 檢查是否為時間範圍資料
                var fieldValue = fieldObj.value;
                var t1 = parseInt(fieldValue.substring(0, 2));
                var t2 = parseInt(fieldValue.substring(2, 4));
                // 取得日期轉換為時間值
                var t3 = parseInt(nowTime.substring(0, 2));
                var t4 = parseInt(nowTime.substring(2, 4));
                if ((t1 >= 0 && t1 < 24) && (t2 >= 0 && t2 < 60)) {
                    var d1 = getDateToTime(DateValue);
                    var d2 = getDateToTime(nowDate);
                    //判斷護理計劃解決日期不得大於診斷開始時間
                    if (fieldName == "userSolveTime") {
                        // 取得診斷開始日期轉換為時間值
                        //診斷開始日期
                        var s2 = getDateToTime(document.all("date").value);
                        //診斷開始時間
                        var sh = (document.all("time").value).substring(0, 2);
                        var sm = (document.all("time").value).substring(2, 4);
                        if (sh.substring(0, 1) == "0") sh = sh.substring(1, 2);
                        if (sm.substring(0, 1) == "0") sm = sm.substring(1, 2);
                        var st3 = parseInt(sh);
                        var st4 = parseInt(sm);

                        if ((d1 + (t1 * 60) + t2) <= (s2 + (st3 * 60) + st4)) {
                            alert("【時間資料" + DateValue + " " + fieldValue + "】不得 < 健康問題開始時間!(" + document.all("date").value + " " + document.all("time").value + ")");
                            fieldObj.value = "0000";
                            return false;
                        }
                    }
                    if (fieldName.indexOf("SEARCH") > -1 || nurseTools_isCheckDate == 1 ) {
                        if(fieldName.indexOf("SEARCH") > -1){
                            return true;
                        }else if(compareDays(nowDate,DateValue)==0){
                            if(parseInt(fieldObj.value.substring(0,2),10)>parseInt(nowTime.substring(0, 2),10)){
                                   alert("【日期時間】不得大於系統日期時間(" + nowDate +" " + nowTime +")!");
                                   fieldObj.value=nowTime;
                                   return false;
                            } else if(parseInt(fieldObj.value.substring(0,2),10)==parseInt(nowTime.substring(0, 2),10)
                                       && parseInt(fieldObj.value.substring(2),10)>parseInt(nowTime.substring(2),10)){
                                   alert("【日期時間】不得大於系統日期時間(" + nowDate +" " + nowTime +")!");
                                   fieldObj.value=nowTime;
                                   return false;
                            }
                        }
                       return true;
                    } else {
                        var ds = compareDays(nowDate,DateValue);                                        
                        if(ds == 0 ){
                        	//
                        	if(parseInt(fieldObj.value,10)>parseInt(nowTime,10)){
                        		alert("【日期時間】不得大於系統日期時間(" + nowDate +" " + nowTime +")!");
                        		fieldObj.value=nowTime;
                                return false;
                        	}
                        }else if(ds == 1){
                        	//檢查系統時間是否為10:00之前
                        	if(parseInt(nowTime,10)<1000){
                        		return true;
                        	}else{
                        		if(fieldName.indexOf("STOOL")>-1){
                        			
                        		}else{
                        			fieldObj.value=nowTime;
                        		}
                                return false;
                        	}                        	
                        }else if(ds > 1){
                            //alert("【日期時間】不得小於系統日期時間(" + nowDate +" " + nowTime +")前12小時!");
                            //fieldObj.value=(parseInt(nowTime.substring(0, 2),10))+nowTime.substring(2);
                            //return false;
                        }else{
                            alert("【日期時間】不得大於系統日期時間(" + nowDate +" " + nowTime +")!");
                            fieldObj.value = nowTime;
                            fieldObj.focus();
                            return false;
                        }
                    }
                } else {
                    alert("【時間資料】輸入錯誤!");
                    fieldObj.value = nowTime;
                    fieldObj.focus();
                    isValid = false;
                }
            } else {
                fieldObj.value = nowTime;
                fieldObj.focus();
            }
        }
    } else {
    	fieldObj.value = nowTime;
    }
    return isValid;
}

//新加提示不能大於結束日期時間，傳的是結束日期時間
function checkTimeOver(fieldName, DateValue, nowDate, nowTime) {
    var isValid = true;
    var fieldObj = document.all(fieldName);
    // 有輸入值才檢查
    if (fieldObj.value != '') {
        // 如果沒有輸入日期資料則不檢查
        if (checkTimeOver.arguments.length == 2 && DateValue.length == 0) {
            fieldObj.value = '';
        } else {
            // 檢查長度 & 是否為數值資料
            isValid = chkMinMaxLen(fieldName, 4, 4, "時間資料") && chkNum(fieldName, "時間資料");
            if (isValid) {
                // 檢查是否為時間範圍資料
                var fieldValue = fieldObj.value;
                var t1 = parseInt(fieldValue.substring(0, 2));
                var t2 = parseInt(fieldValue.substring(2, 4));
                // 取得日期轉換為時間值
                var t3 = parseInt(nowTime.substring(0, 2));
                var t4 = parseInt(nowTime.substring(2, 4));
                if ((t1 >= 0 && t1 < 24) && (t2 >= 0 && t2 < 60)) {
                    var d1 = getDateToTime(DateValue);
                    var d2 = getDateToTime(nowDate);
                    //判斷護理計劃解決日期不得大於診斷開始時間
                    if (fieldName == "userSolveTime") {
                        // 取得診斷開始日期轉換為時間值
                        //診斷開始日期
                        var s2 = getDateToTime(document.all("date").value);
                        //診斷開始時間
                        var sh = (document.all("time").value).substring(0, 2);
                        var sm = (document.all("time").value).substring(2, 4);
                        if (sh.substring(0, 1) == "0") sh = sh.substring(1, 2);
                        if (sm.substring(0, 1) == "0") sm = sm.substring(1, 2);
                        var st3 = parseInt(sh);
                        var st4 = parseInt(sm);

                        if ((d1 + (t1 * 60) + t2) <= (s2 + (st3 * 60) + st4)) {
                            alert("【時間資料" + DateValue + " " + fieldValue + "】不得 < 健康問題開始時間!(" + document.all("date").value + " " + document.all("time").value + ")");
                            fieldObj.value = "0000";
                            return false;
                        }
                    }
                    if (fieldName.indexOf("SEARCH") > -1 || nurseTools_isCheckDate == 1 ) {
                        if(fieldName.indexOf("SEARCH") > -1){
                            return true;
                        }else if(compareDays(nowDate,DateValue)==0){
                            if(parseInt(fieldObj.value.substring(0,2),10)>parseInt(nowTime.substring(0, 2),10)){
                                   alert("【日期時間】不得大於結束日期時間(" + nowDate +" " + nowTime +")!");
                                   fieldObj.value=nowTime;
                                   return false;
                            } else if(parseInt(fieldObj.value.substring(0,2),10)==parseInt(nowTime.substring(0, 2),10)
                                       && parseInt(fieldObj.value.substring(2),10)>parseInt(nowTime.substring(2),10)){
                                   alert("【日期時間】不得大於結束日期時間(" + nowDate +" " + nowTime +")!");
                                   fieldObj.value=nowTime;
                                   return false;
                            }
                        }
                       return true;
                    } else {
                        var ds = compareDays(nowDate,DateValue);                                        
                        if(ds == 0 ){
                        	//
                        	if(parseInt(fieldObj.value,10)>parseInt(nowTime,10)){
                        		alert("【日期時間】不得大於結束日期時間(" + nowDate +" " + nowTime +")!");
                        		fieldObj.value=nowTime;
                                return false;
                        	}
                        }else if(ds == 1){
                        	//檢查系統時間是否為10:00之前
                        	if(parseInt(nowTime,10)<1000){
                        		return true;
                        	}else{
                        		if(fieldName.indexOf("STOOL")>-1){
                        			
                        		}else{
                        			fieldObj.value=nowTime;
                        		}
                                return false;
                        	}                        	
                        }else if(ds > 1){
                            //alert("【日期時間】不得小於系統日期時間(" + nowDate +" " + nowTime +")前12小時!");
                            //fieldObj.value=(parseInt(nowTime.substring(0, 2),10))+nowTime.substring(2);
                            //return false;
                        }else{
                            alert("【日期時間】不得大於結束日期時間(" + nowDate +" " + nowTime +")!");
                            fieldObj.value = nowTime;
                            fieldObj.focus();
                            return false;
                        }
                    }
                } else {
                    alert("【時間資料】輸入錯誤!");
                    fieldObj.value = nowTime;
                    fieldObj.focus();
                    isValid = false;
                }
            } else {
                fieldObj.value = nowTime;
                fieldObj.focus();
            }
        }
    } else {
    	fieldObj.value = nowTime;
    }
    return isValid;
}

/**
 設定是否為補輸入資料
 是否需要檢查日期 0:要檢查 1:不檢查 2:僅可<系統日一天,但不限系統時間是否<9點
 若為補輸入資料,則不做檢查
*/
function onChangMend(nowDate,nowTime) {
    nurseTools_isCheckDate = document.all("EVENT.MEND").checked ? 1 : 0;
    if(!document.all("EVENT.MEND").checked){
        alert("你已取消當機補輸，所有日期時間將回到現在日期時間!");        
        resetDateTime(nowDate,nowTime);
    }
}

function resetDateTime(nowDate,nowTime){
    for (var i = 0; i < document.all.length; i++) {
        if (document.all(i).type == "text") {
            if((document.all(i).name.toUpperCase()).indexOf("DATE") > -1){
                document.all(i).value=nowDate;    
            }else if((document.all(i).name.toUpperCase()).indexOf("TIME") > -1){
                document.all(i).value=nowTime;    
            }
        }
    }   
}

function spTreatmentChange(dataType,selVal){
    if(selVal==99){
        document.all(dataType+'_SPECIAL_Other_DIV').style.display='block'
    }else {
        document.all(dataType+'_SPECIAL_Other_DIV').style.display='none';
        if(document.all(dataType+'_SPECIAL_TREATMENT.Other')){
            document.all(dataType+'_SPECIAL_TREATMENT.Other').value="";        
        }
    }
}

// 是否顯示無法測量原因項目(類型,欄位名,FormName, 是否顯示 Treatment)
function showReasonItem(type, tab, formName, showTreat) {
    var show = document.all(type + '.' + tab).value.trim() != '';
    switch (type) {
        case 'CVP':
            return;
            break;
        case 'BP':    // 如果為 BP ,則只要有一個數值輸入,便不顯示無法測量原因
            show = document.all('BP.VALUE1').value.trim() != '' || document.all('BP.VALUE2').value.trim() != '';
            break;
        case 'ABP':
            show = document.all('ABP.VALUE1').value.trim() != '' || document.all('ABP.VALUE2').value.trim() != '';
            break;
        case 'IABP':
            show = document.all('IABP.VALUE1').value.trim() != '' || document.all('IABP.VALUE2').value.trim() != '';
            break;
        case 'PAP':
            show = document.all('PAP.VALUE1').value.trim() != '' || document.all('PAP.VALUE2').value.trim() != '';
            break;
    }
    if (show) {
        if (type != "STOOL" && type != "URINATION" && type != "ScVO2" && type != "CPP") {
            //將已填的處置資料清除, 如果為呼吸要判斷是否有勾呼吸器
            var emptyTreatment = true;
            if (type == "RESPIRATORY") emptyTreatment = document.all("RESPIRATORY.VALUE2").value == '0';
            if (emptyTreatment && showTreat)document.all(type + '.TREATMENT').value = '';
            if (type != "SPO2")document.all(type + '.NOTATION').value = '';
        }
        if (type != "SPO2") {
            document.all(type + '_REASON_DIV').style.display = 'none';
            document.all(type + '.REASON').value = '0';
        }
    } else {
        document.all(type + '_REASON_DIV').style.display = 'block';
    }
    // 如果是BP 有可能是從 Others 輸入,則有第二個項目
    if (type == "BP" && formName == "Others") {
        document.all('BP_REASON_DIV2').style.display = show ? 'none' : 'block';
    }
}

/*
**此 function for萬芳用
*檢查輸入日期
*如果系統時間< 10:00 則可以輸入前一日資料
*/
function onDateChange(DateFilde,TimeFilde, nowDate, nowTime) {
    // 是否需要檢查日期 0:要檢查 1:不檢查(不得>系統日) 2:僅可<系統日一天,但不限系統時間是否<10點
    var hh = nowTime.substring(0, 2)
    if (hh.substring(0, 1) == "0") hh = hh.substring(1, 2)
    var intHH = parseInt(hh,10);
    var compareHours= intHH-12;
    //計算日期相差天數
    var DateValue=document.all(DateFilde).value;
    var TimeValue=document.all(TimeFilde).value;
    var ds = compareDays(nowDate, DateValue);
    var ifMend = document.all("EVENT.MEND");
    if(ifMend==null){
    	/*alert("沒有勾當機補輸或沒有權限，請核實后再操作！");
		document.all(DateFilde).value=nowDate;
    	return;*/
    	nurseTools_isCheckDate = 0;
    }else{
    	 //增加一次取值
        nurseTools_isCheckDate = document.all("EVENT.MEND").checked ? 1 : 0;
    }
    
    if (ds < 0) {
        alert("【日期】不得大於系統日期(" + nowDate + ")!");
        return true;
    }
    if (nurseTools_isCheckDate != 1){    	
        //當日
        if(ds == 0 ){
            if(parseInt(TimeValue.substring(0,2),10)>parseInt(hh,10)){
                document.all(TimeFilde).value=nowTime;
                return false;
            }       
        }
        //前一日
        else if(ds == 1){
        	var myDate = new Date();
        	var nowHour = myDate.getHours();;
        	//系統時間小於10:00
        	//parseInt(nowTime,10)<1000
        	if(nowHour < 10){// 现在时间小于10點時，設置日期并返回true modify by leo 2015.7.6
        		return false;
        	}else{//大于10點時，不允許設置日期并返回false
        		document.all(DateFilde).value=nowDate;
        		alert("系統日期時間已超過本日 AM 10:00，不得點選前一日【日期時間】!");
        		return true;
        	}
        }
        //二日前
        else if(ds > 1){
            alert("【日期時間】不得小於系統日期時間( " + nowDate +" " + nowTime +" )二日前!");            
            return true;
        }
    }    
    
}

/*
**此 function for萬芳用
*檢查輸入日期
*如果系統時間< 10:00 則可以輸入前一日資料
*/
function onDateChange2(DateFilde,TimeFilde, nowDate, nowTime) {
    // 是否需要檢查日期 0:要檢查 1:不檢查(不得>系統日) 2:僅可<系統日一天,但不限系統時間是否<10點
    var hh = nowTime.substring(0, 2)
    if (hh.substring(0, 1) == "0") hh = hh.substring(1, 2)
    var intHH = parseInt(hh,10);
    var compareHours= intHH-12;
    //計算日期相差天數
    var DateValue=document.all(DateFilde).value;
    var TimeValue=document.all(TimeFilde).value;
    var ds = compareDays(nowDate, DateValue);
    var ifMend = document.all("EVENT.MEND");
    if(ifMend==null){
    	/*alert("沒有勾當機補輸或沒有權限，請核實后再操作！");
		document.all(DateFilde).value=nowDate;
    	return;*/
    	nurseTools_isCheckDate = 0;
    }else{
    	 //增加一次取值
        nurseTools_isCheckDate = document.all("EVENT.MEND").checked ? 1 : 0;
    }
   
    if (ds < 0) {
        alert("【日期】不得大於系統日期(" + nowDate + ")!");
        return true;
    }
    if (nurseTools_isCheckDate != 1){    	
        //當日
        if(ds == 0 ){
            if(parseInt(TimeValue.substring(0,2),10)>parseInt(hh,10)){
                document.all(TimeFilde).value=nowTime;
                return false;
            }       
        }
        //前一日
        else if(ds == 1){
        	var myDate = new Date();
        	var nowHour = myDate.getHours();;
        	//系統時間小於10:00
        	//parseInt(nowTime,10)<1000
        	if(nowHour < 10){// 现在时间小于10點時，設置日期并返回true modify by leo 2015.7.6
        		return false;
        	}else{//大于10點時，不允許設置日期并返回false
        		document.all(DateFilde).value=nowDate;
        		alert("系統日期時間已超過本日 AM 10:00，不得點選前一日【日期時間】!");
        		return true;
        	}
        }
        //二日前
        else if(ds > 1){
            alert("【日期時間】不得小於系統日期時間( " + nowDate +" " + nowTime +" )二日前!");            
            return true;
        }
    }    
    
}

// 比較相差天數(後 - 前)
function compareDays(latter, before){
    return getDateToDays(latter) - getDateToDays(before);
}

//Issue:5402 檢查 日期時間記錄是否已存在(主要在多筆輸入時才會使用)
//檢查 日期時間記錄是否已存在(主要在多筆輸入時才會使用)
//僅有一般排便/異常排便/CVP/BP/SPO2/PAIN要檢查
function chkDataOnly(dataType,type,datetime,funType){
	var ok=false
	if ("CVP,BP,SPO2,PAIN".indexOf(dataType)>-1 || (type.length>0 && "REGULAR,STOOL".indexOf(type)>-1)) {
		var chkData=datetime+"|@|"+type
		var sel=eval("document.all('"+dataType+"')")
		var l=sel.length
		var cont=0
		for (var n=0;n<sel.length;n++) {
			var value=sel.options[n].value
			if(value.indexOf(chkData)>-1) {
				cont++
				if (("ADD"==funType && cont==1) || ("UPDATE"==funType && cont==2)){
					alert("!!該日期時間記錄已存在!!")
					ok=true
					break
				}
			} else {
				//如果是一般排便或異常排便要戶相檢查,才不會造成轉排便次數資料問題
				if ("REGULAR"==type || "STOOL"==type) {
					if ("REGULAR"==type) { chkData=datetime+"|@|"+"STOOL" ; }
					else { chkData=datetime+"|@|"+"REGULAR" ; }
					if(value.indexOf(chkData)>-1) {
						alert("!!該日期時間 [一般排便量] 與 [異常排便量] 記錄不得同時存在!!")
						ok=true
						break
					}
				}
			}
		} //for (var n=0;n<sel.length;n++)
	}
	return ok
}

/*取得 Radio 物件的選擇值*/
function getRadioValue(oRadio) {
    if (oRadio) {
        if (oRadio.length) {
            for (var i = 0; i < oRadio.length; i++) {
                if (oRadio[i].checked) return oRadio[i].value;
            }
        } else if (oRadio.checked) return oRadio.value;
    }
    return '';
}
/**標準值物件*/
function StandardValue(key, highValue1, lowValue1, highValue2, lowValue2) {
	this.key = key ;
	this.highValue1 = highValue1 ;
	this.lowValue1 = lowValue1 ;
	this.highValue2 = highValue2 ;
	this.lowValue2 = lowValue2 ;
}

/**屬性值物件*/
function AttributeValue(key, name) {
	this.key = key ;
	this.name = name ;
}
/** radio点击选中、取消  */
function uncheck(obj)
{
    var radio=obj;
    if (radio.tag==1)
    {
        radio.checked=false;
        radio.tag=0;
    }
    else
    {
        radio.checked=true;
        radio.tag=1
    }
}