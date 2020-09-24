//此檔案為"護理計劃"中所有使到的JavaScript method
// 長方形視窗
var oblongWin	=	getWinSize(0.55, 0.6);
// 正方形視窗
var squareWin	=	getWinWH();	
//片語視窗
var phraseWin = getWinSize(0.73, 0.79);

//--計算視窗大小
function getWinSize(a, b)
{
  var w=screen.width*a
  var h=screen.height*b
  var l=(screen.width-w)/2
  var t=(screen.height*0.16)/2
  var wh='width='+w+',height='+h+',left='+l+',top='+t;

  return   getWinWH();
}

// 設定取得的片語內容
// 僅供選取資客觀資料使用,只取 O 的部份
function slectItem(val_n,val_s,val_o,val_i,val_e)
{
	var arrayNum = null
	if(document.all("arrayNum") !=null)
	{
		arrayNum = document.all("arrayNum").value		
	}
	
	if (val_o.length>0)
	{
		if(arrayNum!=null && document.all("planDiagObject")!=null && document.all("planDiagObject").length)
		{
			var old=document.all("planDiagObject")[arrayNum].value
			if (old.length>0) { val_o=old+","+val_o }
			document.all("planDiagObject")[arrayNum].value=val_o			
		}else
		{
			var old=document.all("planDiagObject").value
			if (old.length>0) { val_o=old+","+val_o }
			document.all("planDiagObject").value=val_o		
		}	
	}
}

/**開啟片語的新視窗
/*url 要導向的網址
/*formName 新開啟的視窗名稱
**/
function openPhraseWin(url, formName) 
{
	var rwin=window.open(url+'/m2/recordPhrase/selectTreePhrase' , formName,phraseWin+',resizable=1,scrollbars=1');
	rwin.focus()
}

function openPhraseWin(url, formName , type) 
{
	var rwin=window.open(url+'/m2/recordPhrase/selectTreePhrase?type='+type , formName,phraseWin+',resizable=1,scrollbars=1');
	rwin.focus()
}

/**開啟長方形的新視窗
/*url 要導向的網址
/*formName 新開啟的視窗名稱
**/
function openOblongWin(url, formName) 
{
	var rwin=window.open(url ,formName ,oblongWin+',resizable=1,scrollbars=1');
	rwin.focus()
}

/**開啟正方形的新視窗
/*url 要導向的網址
/*formName 新開啟的視窗名稱
**/
function openSquareWin(url, formName) 
{
	var rwin=window.open(url, formName ,squareWin+',resizable=1,scrollbars=1');
	rwin.focus()
}

/**將字串ex: 'abc|#|test'拆解成key, value顯示並存入隱藏欄位中 
/* seleItem:存放字串'abc|#|test'的Array
/* divName:<span>的名稱
/* hiddenName:隱藏欄位的名稱
/* bintervention:是否為intervention
**/
function apartKeyValue(seleItem, divName, hiddenName,bintervention)
{ 
	if(bintervention==null || bintervention=="undefined"|| bintervention=="")
		bintervention=false
	if (seleItem.length > 1)
	{
		var aValues = document.all(divName);
		if(!bintervention)
			aValues.innerHTML =""
		var newLine = ''
		
		for(var i=0; i<seleItem.length; i++)
		{
			num = seleItem[i].indexOf("|#|")
			key=seleItem[i].substring(0,num)
			val=seleItem[i].substring(num+3)	
			newLine = "<input type=\"hidden\" name="+hiddenName+" value=\""+key+"\">"+(i+1)+".<input type=\"hidden\" name=\""+key+(bintervention?"Name":"")+"\" value=\""+val.replace(/"/i, "&#034")+"\">"+val+"<br>"
			if(aValues.innerHTML != '')
			{
				aValues.innerHTML = aValues.innerHTML + newLine
				
			}else
			{
				aValues.innerHTML = newLine
			}	
		}
	}else if(seleItem.length == 1)
	{
		var aValues = document.all(divName);
		if(!bintervention)
			aValues.innerHTML =""
		num = seleItem[0].indexOf("|#|")
		key=seleItem[0].substring(0,num)
		val=seleItem[0].substring(num+3)
		var newLine = "<input type=\"hidden\" name="+hiddenName+" value=\""+key+"\">"+(bintervention?"1.":"")+"<input type=\"hidden\" name=\""+key+(bintervention?"Name":"")+"\" value=\""+val.replace(/"/i, "&#034")+"\">"+val+"<br>"
		
		if(aValues.innerHTML != '')
		{
			aValues.innerHTML = aValues.innerHTML + newLine
			
		}else
		{
			aValues.innerHTML = newLine
		}	

	}
}	  

/**是否有勾選CheckBox由使用者自行輸入項
/* otherName:使用者自行輸入項的名稱
/* otherValuename:使用者自行輸入項值的名稱
/* addbuttonName:新增自行輸入項的按鈕名稱
/* spanName:<spanName>的名稱
**/
function otherCheckBoxIfChecked(otherName, otherValueName, addButtonName, spanName)
{
	var otherCauseItem=document.all(otherName)
	
	if (otherCauseItem.checked)
	{
		document.all(otherValueName).disabled = false
		document.all(addButtonName).disabled = false
	} else 
	{
		document.all(otherValueName).value = ""
		document.all(otherValueName).disabled = true
		document.all(otherName).disabled = true
		var aValues = document.all(spanName)
		aValues.innerHTML =""					
	}
}

/**是否有勾選CheckBox系統顯示出來的選項，如果勾選則該項目的輸入框disabled=false
/* itemName:所勾選的CheckBox Name
/* itemInputName:所勾選的CheckBox的輸入框名稱
**/
function checkBoxIfChecked(itemName, itemInputName)
{
	var selectItem = document.all(itemName).checked
	if(itemInputName!=null && selectItem)
	{			
		if(itemInputName.length)
		{
			for(var i=0; i<itemInputName.length; i++)
			{	
				itemInputName[i].disabled = false
			}				
		}else
		{
			itemInputName.disabled = false
		}
	}else if(itemInputName!=null)
	{
		if(itemInputName.length)
		{
			for(var i=0; i<itemInputName.length; i++)
			{	
				itemInputName[i].value = ""
				itemInputName[i].disabled = true
			}				
		}else
		{
			itemInputName.value = ""
			itemInputName.disabled = true
		}			
	}
}

/**傳資料到所需網頁，並進行檢查是否有資料
/* s:導頁所需的參數
/* forwardTarget:導頁路徑
/* failReason:傳資料失敗顯示警告視窗
**/
function checkForwardClose(s, target, failReason)
{
	if(s.length>0)
	{
		target(s)
		window.close()			
	}else
	{
		if(confirm(failReason))
		{
			window.close()		
		}
	}	
}

/**新增一行input type="text"的輸入欄位
/* spanName:<span>的名稱
/* inputName:<input>的名稱
/* rowSize:<textarea>的行數
/* colSize:<textarea>的寬度
**/
function addInputTextarea(spanName, inputName, rowSize, colSize)
{
	var aValues = document.all(spanName)
	//aValues.innerHTML =""	
	var newLine = "<textarea name="+inputName+" rows="+rowSize+" cols="+colSize+"></textarea><br>"
	if(aValues.innerHTML != '')
	{
		aValues.innerHTML = aValues.innerHTML + newLine
	}else
	{
		aValues.innerHTML = newLine
	}
}
/**新增一行input type="text"的輸入欄位
/* spanName:<span>的名稱
/* inputName:<input>的名稱
/* rowSize:<textarea>的行數
/* colSize:<textarea>的寬度
**/
function addInputText(spanName, inputName,size,count)
{
	if(arguments.length<3)
		size = 50;
	var aValues = document.getElementById(spanName);
	//aValues.innerHTML =""	

	var newLine = "<div id=\""+inputName+count+"DIV\"><input name="+inputName+"Check type=\"checkbox\" value=\""+inputName+count+"\" onclick=\"delInputText('"+inputName+count+"DIV')\" checked><input name="+inputName+" type=\"text\" size=\""+size+"\"><br></div>";

	if(aValues.innerHTML != '')
	{
		aValues.innerHTML = aValues.innerHTML + newLine;
	}else
	{
		aValues.innerHTML = newLine;
	}
}
function delInputText(inputName)
{
	if(document.all(inputName))
	{
		document.all(inputName).outerHTML="";
	}
}

/**將radio所選擇的項目保持，並且在更動時將前次所選擇項目清空及disabled
/* newName:所選擇的名稱
/* otherName:由使用者自行輸入的項目名稱
/* keepItemName:前一次所選擇的項目名稱
**/
function selectRadio(newName, otherName, keepItemName)
{
	var oldName = document.all(keepItemName).value
	document.all(keepItemName).value=newName
	var newNameInputName = document.all(newName+"InputName")
	var oldNameInputName = document.all(oldName+"InputName")
	if(oldName != "" && oldName != newName)
	{
		if(oldName == otherName)
		{
			document.all(otherName).value = ""
			document.all(otherName).disabled = true 
		}
		
		if(newName == otherName)
		{
			document.all(otherName).disabled = false
		}		
		
		if(oldNameInputName!=null && oldNameInputName.length)
		{
			for(var i=0; i<oldNameInputName.length; i++)
			{
				oldNameInputName[i].value=""
				oldNameInputName[i].disabled = true
			}				
		}else if(oldNameInputName != null)
		{	
			oldNameInputName.value=""
			oldNameInputName.disabled = true
		}
		
		if(newNameInputName!=null && newNameInputName.length)
		{
			for(var i=0; i<newNameInputName.length; i++)
			{
				newNameInputName[i].disabled = false
			}			
		}else if(newNameInputName!=null)
		{
			newNameInputName.disabled = false
		}
			
	}else if(oldName == "") 
	{
		if(newName != otherName && newNameInputName!=null)
		{
			if(newNameInputName.length)
			{
				for(var i=0; i<newNameInputName.length; i++)
				{
					newNameInputName[i].disabled = false
				}			
			}else
			{
				newNameInputName.disabled = false
			}	
		}else
		{
			if(newName!=otherName)
			{
				document.all(otherName).disabled = true
			}else
			{
				document.all(otherName).disabled = false
			}					
		}
	}		
}

// 去掉空白
function trim(val)
{
	// 去掉前面空白
	val=""+val
	var idx=val.indexOf(" ")
	while (idx==0)
	{
		val=val.substring(idx+1)
		idx=val.indexOf(" ")
	}
	// 去掉後面空白
	idx=val.length
	if (idx>0)
	{
		var ck=val.substring(idx-1)
		while (ck==" ")
		{
			val=val.substring(0,idx-1)
			idx=val.length
			ck=val.substring(idx-1)
		}
	}
	return val
}

/**將勾選的radio值，串成"key|#|value"
/* keepValueName:上次所選取的值的欄位名稱
/* otherItemName: 由使用者自行輸入的欄位名稱
**/
function getRadioKeyValue(keepValueName, otherItemName) 
{
	var s=document.all(keepValueName).value	;
	if(s!=null && s.length>0)
	{	
		var oldString = document.all(s).value;
		var oldStringObject = document.all(s+"InputName");
		var newString = "";
		var isInput = true;
		
		if (s == otherItemName)
		{
			newString = document.all(otherItemName).value;
			if(trim(newString).length<1)
			{
				isInput = false;
			}
		}else if(oldStringObject != null)
		{	
			var appendValue = appendTextValue(oldStringObject, oldString);
			isInput = appendValue[0];
			newString = appendValue[1];
		}else
		{
			newString = document.all(s).value;
		}
		if(isInput)
		{
			//key|#|value
			s = s+"|#|"+ newString;
		}else
		{
			s = "-1";
		}
	}
	return s	;
}	

/**將字串及輸入框文字串成字串
/* textObject:輸入框物件
/* sourceString:原始字串 ex:"abc_aa"
*/
function appendTextValue(textObject, sourceString)
{
	var newString = ""
	var isInput = true
		
	if(textObject != null && textObject.length)
	{
		for(var i=0; i<textObject.length; i++)
		{
			if(trim(textObject[i].value).length<1)
			{
				isInput = false
				break;
			}
		}	
		if(isInput)
		{
			for(var i=0,j=0; i<=textObject.length; i++,j++)
			{		
				if(sourceString.indexOf("_",j) == 0)		
				{
					newString = newString + sourceString.substring(j, sourceString.indexOf("_",j))
					newString = newString + textObject[i].value	
				}else if(sourceString.indexOf("_",j) - j > 0)
				{
					newString = newString + sourceString.substring(j, sourceString.indexOf("_",j))
					j = sourceString.indexOf("_",j)
					newString = newString + textObject[i].value				
				}else if(sourceString.indexOf("_",j) - j == 0)
				{
					i--
				}else
				{
					newString = newString + sourceString.substring(j,sourceString.length)
				}				
			}	
		}
	}else if(textObject != null)
	{				
		if(trim(textObject.value).length<1)
		{
			isInput = false
		}
		if(isInput)
		{
			for(var i=0; i<sourceString.length; i++)
			{				
				if(sourceString.indexOf("_",i) == 0)
				{
					newString = newString + sourceString.substring(i, sourceString.indexOf("_",i))
					newString = newString + textObject.value
				}else if(sourceString.indexOf("_",i) - i > 0)
				{
					newString = newString + sourceString.substring(i, sourceString.indexOf("_",i))
					i = sourceString.indexOf("_",i)
					newString = newString + textObject.value	
				}else if(sourceString.indexOf("_",i) - i < 0)
				{	
					newString = newString + sourceString.substring(i,sourceString.length)
					i = sourceString.length
				}
			}	
		}	
	}	
	return [isInput,newString];
}

/**將使用者自行輸入選項的checkBox所選擇的項目字串，串成"key|#|value"
/* selecItem: 選擇的項目名稱
/* otherItem: 由使用者自行輸入項目名稱
/* otherItemValue: 由使用者自行輸入值名稱
/* s:存串好的"key|#|value"陣列
/* itemNum:目前s陣列已存到第幾項
**/
function getOtherCheckBoxKeyValue(otherItem, otherItemValue, addOtherItemValue, s, itemNum)
{
	var isInput = true
	if(otherItem.checked)
	{
		var otherValues = document.all(otherItemValue)
		if(otherValues != null && otherValues.length)
		{
			for(var i=0; i<otherValues.length; i++)
			{
				if(trim(otherValues[i].value).length<1)
				{
					isInput = false
				}
				//key+|#|+value
				s[itemNum] = otherItem.value+"|#|"+otherValues[i].value
				itemNum = itemNum + 1	
			}			
		}else if(otherValues!=null)
		{
			if(trim(otherValues.value).length < 1)
			{
				isInput = false
			}
			//key+|#|+value
			s[itemNum] = otherItem.value+"|#|"+otherValues.value
		}
	}
	if(!isInput)
	{
		s = "-1"
	}
	return s
}

//關閉視窗
function leaveForm()
{
	if(confirm("離開目前編輯中資料?"))
	{
		window.close()
	}	
}
// 放棄編輯
function doCancel()	
{
	if (confirm("是否確定放棄目前編輯中的資料?"))
	{
		// window.parent.changeFunction('start','NursingPlan','','N');
        var path="/" + location.pathname.split("/")[1]+"/m2/NursingPlan/start?MBNIS=true"+parms;
        window.parent.document.getElementById("myIframe").src = path;
	}
}

// 加入選擇的診斷
function addDiagnosisItem(seleItem,main_Goal)
{
	if(document.all("diagId") != null && (document.all("diagId").value != seleItem.substring(0, seleItem.indexOf("|#|"))))
	{
		document.all("showCauseName").innerHTML = ""
		document.all("showGoalName").innerHTML = ""
		document.all("showIntervention").innerHTML = ""
		document.all("showMainGoal").innerHTML = ""		
	}
	s = new Array()
	s[0] = seleItem
	apartKeyValue(s, 'showDiagName', 'diagId',false)

	if(main_Goal!=null)
	{		
		m = new Array()
		m[0] = main_Goal
		apartKeyValue(m, 'showMain_Goal', 'main_Goal',false)
	}
}
//加入選擇的導因
function addCause(seleItem)
{
	if(document.all("arrayNum")!=null)
	{
		var arrayNum = document.all("arrayNum").value
		apartKeyValue(seleItem, 'showCauseName'+arrayNum, 'causeId'+arrayNum,false)
	}else
	{
		apartKeyValue(seleItem, 'showCauseName', 'causeId',false)
		apartKeyValue(seleItem, 'causeName', 'causeId',false)
	}	
}
// 加入選擇的目標
function addGoalItem(seleItem)
{
	if(document.all("goalId") != null && (document.all("goalId").value != seleItem.substring(0, seleItem.indexOf("|#|"))))
	{
		document.all("showIntervention").innerHTML = ""
	}	
	s = new Array()
	s[0] = seleItem
	apartKeyValue(s, 'showGoalName', 'goalId',false)
	
	addGoalDesireDate()
}
// 加入選擇的措施
function addIntervention(seleItem,hiddenName)
{
	apartKeyValue(seleItem, 'showIntervention', hiddenName,true)
	apartKeyValue(seleItem, 'interventionName', hiddenName,true)	
}

//確定資料是否皆輸入並導入controller
function commitData(type)
{		
	var message = ""
	var messageNum = 0;
	if(document.all("diagId") == null || document.all("diagId").value == "")
	{
		messageNum++
		message = messageNum+".尚未選擇護理計劃健康問題資料\n"				
	}
//	if((document.all("planDiagSubject") == null || document.all("planDiagSubject").value == "") && type!='addPlanGoal' && type!='addPlanInterven' && type!='updateAchieveDate')
//	{
//		messageNum++
//		message = message + messageNum+".尚未輸入護理計劃主觀資料\n"
//	}

	if(messageNum>0)
	{
		alert(message)
	}else
	{
		if(type == "addPlanDiag")
		{
			if (confirm("請確認時間是否已修改?")) 
			{
				 if(confirm("是否確定新增目前資料?")) 
				 {
				    document.all("commitButton1").value	= '處理中';
				    document.all("commitButton2").value	= '處理中';
				    disabledButton(true)
					if(type == "addPlanDiag")
					{
						document.all.addDiagnosisForm.submit()	
					}				 	
				 }
			}
		}else if(type=="addDiagReEvaluate")
		{
			 if(confirm("是否確定新增目前資料?")) 
			 {
			    document.all("commitButton1").value	= '處理中';
			    document.all("commitButton2").value	= '處理中';
			    disabledButton(true)
				if(type == "addDiagReEvaluate")
				{
					document.all.addDiagReEvaluateForm.submit()	
				}					 	
			 }
		}else if(confirm("是否確定新增目前資料?")) 
		{
		    document.all("commitButton1").value	= '處理中';
		    document.all("commitButton2").value	= '處理中';
		    disabledButton(true)
			if(type =="addPlanGoal")
			{
				document.all.addPlanDiagGoalForm.submit()	
			}else if(type == "addPlanInterven")
			{
				document.all.addPlanDiagIntervenForm.submit()	
			}else if(type == "updateAchieveDate")
			{
				document.all.updateAchieveDateForm.submit()	
				//如果勾選"未達成重新評估(D)"，執行目標未達成重新評估功能
//				reEvaluate()
			}			
		}
	}	
}

/**判斷日期格式是否正確，如果正確會回傳true，如果不正確會回傳false及錯誤訊息
/* dateName: 日期欄位名稱
**/
function isDateFormat(dateName)
{
	var ymd1 = document.all(dateName).value.split("/")
	var month1 = ymd1[1]-1
	var date1 = new Date(ymd1[0], month1, ymd1[2])
	var errorMsg = ""
	if(date1.getMonth()+1!=ymd1[1] || date1.getDate()!=ymd1[2] || date1.getFullYear()!=ymd1[0] || ymd1[0].length!=4)
	{
		errorMsg =  "日期格式【"+document.all(dateName).value+"】錯誤，請依【yyyy/mm/dd】格試輸入"
	}
	if(errorMsg!=null && errorMsg.length>0)
	{
		return [false, errorMsg];
	}else
	{
		return [true, errorMsg];
	}
}	

/**將目前顯示的資料整個<tr>字整的顏色顯示色藍色
/* trId : 目前被選取<tr>的id
/* clickId : 暫存前一個被選取<tr>的id
**/
function changeColor(trId)
{
	var clickId = document.all("clickId")
	
	if(clickId!=null && clickId.value.length>0)
	{
		document.all(clickId.value).style.color = '#000000'
		document.all(clickId.value).style.background='#FFFFFF'
	}
	if(document.all(trId)!=null)
	{
		document.all(trId).style.color='#0000FF'
		document.all(trId).style.background='#FFFF99'		
		document.all("clickId").value = trId
	}	
}

/**切換一個jsp檔有兩個div資料
/* div1:第一個<div>的id
/* div2:第二個<div>的id
/* type:要切換的型態
**/
function changeMenu(div1, div2, type)
{
	isShowAll = !isShowAll
	if(document.all("isClickId"))
		document.all("isClickId").value="null"
	if ("ALL"==type) 
	{
		if(document.all(div1))
			document.all(div1).style.display="none"
		if(document.all(div2))
			document.all(div2).style.display="block"
	} else 
	{
		if(document.all(div1))
			document.all(div1).style.display="block"
		if(document.all(div2))
			document.all(div2).style.display="none"
	}
}

//加入定義特徵項目
function addDefCharacteristic(s)
{
	var arrayNum = null
	if(document.all("arrayNum") !=null)
	{
		arrayNum = document.all("arrayNum").value		
	}
	
	if(arrayNum!=null && document.all("planDiagObject")!=null && document.all("planDiagObject").length)
	{
		var objectValue = document.all("planDiagObject")[arrayNum].value
		if(objectValue=='')
		{
			document.all("planDiagObject")[arrayNum].value = s
		}else
		{
			document.all("planDiagObject")[arrayNum].value = objectValue + "," + s
		}			
	}else
	{
		var objectValue = document.all("planDiagObject").value
		if(objectValue=='')
		{
			document.all("planDiagObject").value = s
		}else
		{
			document.all("planDiagObject").value = objectValue + "," + s
		}		
	}
	
}
