$(document).ready(function() {
	
	/**
	 * 頁籤事件
	 */
    $('.tabs.tabs-style-topline nav ul li').click(function() {
        $(this).parent().find('li').each(function() {
            $(this).removeClass('tab-current');
        });
        $(this).addClass('tab-current');
    });
    // $('a:first').click();
});

var normalCaseType = [
                      	"dischargeplanning",
                      	"dischargeplanningst",
                      	"crossTramAssessment",
                      	"crossTeamResourceInt",
                      	"nursinghome",
                      	"nursingHomeHospice",
                      	"pacbrainwound",
                      	"paccerebralapoplexy",
                      	"pacfracture",
                      	"pacheartfailure",
                      	"pacweak"
                     ];

/**
 * 展開或收起區塊										<br/>
 * 使用方式 => 參照 nursingHome/caseList.jsp Lines:184 	<br/>
 * 影響的區塊加入class target名稱 & active				<br/>
 * 並與該控鍵同層使用
 * @param that		HTML元素
 * @param target	指定元素
 */
function triggerTable(that, target) {
    var ele 		= $(that).parent();
    var selector 	= ele.find('.' + target);
    if (selector.hasClass('active')) {
        selector.removeClass('active').hide();
    } else {
        selector.addClass('active').show();
    }
}

/**
 * jsp 導頁用
 * @param stakeOutURL 	目標網址
 */
function setStakeOutURL(stakeOutURL) {
	var parent 	= window.parent.document.body;
	var frame 	= $(parent).find('#myIframe')[0];
	$(frame).attr("src", stakeOutURL);
}

/**
 * 設定病人Session				<br/>
 * 病重整病人資訊頁 (top.html)	<br/>
 * @param that		HTML元素
 */
function setPatient(that) {
    var target 	= $(that);
    var parent 	= window.parent.document.body;
    // 將所有資料 trim 掉空格
    $('input[type="hidden"]').each(function() {
        var tptxt = $(this).val().trim();
        $(this).val(tptxt);
    });
    window.localStorage["caseId"]				  = target.find('input[name="ID"]').val();				    // 個案編號
    window.localStorage["patient_phistnum"] 	  = target.find('input[name="PHISTNUM"]').val();     		// 病歷號
    window.localStorage["patient_bedNo"]		  = target.find('input[name="BEDNO"]').val();				// 床號
    window.localStorage["patient_pcaseno"] 		  = target.find('input[name="PCASENO"]').val();     		// 住院号
    window.localStorage["patient_stationId"] 	  = target.find('input[name="STATIONID"]').val();   		// 護理站
    window.localStorage["patient_name"] 		  = target.find('input[name="PNAMEC"]').val();           	// 病人姓名(中文)
    window.localStorage["patient_sex"]			  = target.find('input[name="HSEX"]').val();				// 病人性別
    window.localStorage["patient_hidNo"] 		  = target.find('input[name="HIDNO"]').val();           	// 身分證號
    window.localStorage["patient_birthday"] 	  = target.find('input[name="PBIRTHDT"]').val();     		// 出生年月日
    window.localStorage["patient_hpatadr"]		  = target.find('input[name="HPATADR"').val();			    // 地址
    window.localStorage["patient_age"]			  = target.find('input[name="AGE"]').val();				    // 年齡
    window.localStorage["patient_hvmdNo"] 		  = target.find('input[name="HVMDNO"]').val();         	    // 醫生Id
    window.localStorage["patient_hrDocNm"] 		  = target.find('input[name="HVDOCNM"]').val();       	    // 醫生姓名
	window.localStorage["patient_chief"] 		  = target.find('input[name="CHIEFENGINEERNAME"]').val();   // 個管師/護理師 8/31新增
    window.localStorage["patient_hinCursvcl"] 	  = target.find('input[name="HINCURSVCL"]').val(); 		    // 入院科代碼
    window.localStorage["patient_pdiagtxt"] 	  = target.find('input[name="PDIAGTXT"]').val(); 			// 診斷內容
    window.localStorage["patient_pdiagCod"] 	  = target.find('input[name="PDIAGCOD"]').val();     		// 入院診斷代碼
    window.localStorage["patient_hadMdt"] 		  = target.find('input[name="HADMDT"]').val();         	    // 住院日期
    window.localStorage["patient_hadmdy"]		  = target.find('input[name="HADMDY"]').val();			    // 住院天數
    window.localStorage["patient_apdt"] 		  = target.find('input[name="TRANHOSPTIME"]').val();     	// 轉入日期
    window.localStorage["patient_sourceId"] 	  = target.find('input[name="SOURCEID"]').val();			// sourceId
    window.localStorage["patient_caseType"]       = target.find('input[name="CASETYPE"]').val();            // 個案類型
    window.localStorage["patient_transhosp"]      = target.find('input[name="TRANSHOSP"]').val();           // 下轉醫院
    window.localStorage["patient_transhospMode"]  = target.find('input[name="TRANSHOSPMODE"]').val();       // 下轉模式
    window.localStorage["patient_collectime"]     = target.find('input[name="COLLECTTIME"]').val();         // 收案日期
    window.localStorage["isWardManagement"]       = target.find('input[name="isWardManagement"]').val();    // 是否病房端賬號
    $(parent).find('#topFrame')[0].contentWindow.location.reload();
    if (window.localStorage["tempElement"] !== undefined && window.localStorage["tempElement"] !== null && window.localStorage["tempElement"] !== "") {
    	eval(window.localStorage["tempElement"]);
    }
}

function clearPatient(){
    window.localStorage.removeItem("caseId");
    window.localStorage.removeItem("patient_phistnum");
    window.localStorage.removeItem("patient_bedNo");
    window.localStorage.removeItem("patient_pcaseno");
    window.localStorage.removeItem("patient_stationId");
    window.localStorage.removeItem("patient_name");
    window.localStorage.removeItem("patient_sex");
    window.localStorage.removeItem("patient_hidNo");
    window.localStorage.removeItem("patient_birthday");
    window.localStorage.removeItem("patient_hpatadr");
    window.localStorage.removeItem("patient_age");
    window.localStorage.removeItem("patient_hvmdNo");
    window.localStorage.removeItem("patient_hrDocNm");
    window.localStorage.removeItem("patient_hinCursvcl");
    window.localStorage.removeItem("patient_pdiagtxt");
    window.localStorage.removeItem("patient_pdiagCod");
    window.localStorage.removeItem("patient_hadMdt");
    window.localStorage.removeItem("patient_hadmdy");
    window.localStorage.removeItem("patient_apdt");
    window.localStorage.removeItem("patient_sourceId");
    window.localStorage.removeItem("patient_caseType");
	window.localStorage.removeItem("patient_chief");
    $('#topFrame')[0].contentWindow.location.reload();
}

/**
 * 動態表單導頁
 * @param tar			HTML元素
 * @param html			指定頁面
 * @param formType		formType名稱
 * @param frameModel	gformweb
 * @param sourceId		病歷號
 * @returns nothing
 */
function changeFunction(tar, html, formType, frameModel, sourceId) {
	if (formType == '') {
		return;
	}
	if (typeof sourceId === 'string') {
		sourceId = sourceId.trim();
	}
    if ( window.localStorage["caseId"] === undefined ||
         window.localStorage["caseId"] === null || 
         window.localStorage["caseId"] == "" || 
         (
          sourceId != window.localStorage["patient_phistnum"] && 
          sourceId.trim() != window.localStorage["caseId"] && 
          normalCaseType.indexOf(sourceId) == -1
         ) &&
         html != "gFormWebPRINT.html" &&
         html != "gFormWebUPD.html" &&
         html != "gFormWebLIST.html"
        ) {
		window.localStorage["tempElement"] = $(tar).attr('onclick');
		setPatient($(tar).parent().parent());
		return;
	}
	if (formType.indexOf('.do') > -1) {
		setStakeOutURL(formType);
		window.localStorage["tempElement"] = null;
		return;
	}
	if (formType === 'modal') {
		$('#alert').modal('show');
		window.localStorage["tempElement"] = null;
		return;
	}
	var parsed = parseInt(formType);
	if (!isNaN(parsed)) {
		updating(window.localStorage["caseId"], formType);
		return;
    }
    var formId = '';
    if (html == 'gFormWebUPD.html' && formType == 'CICMSMeeting' ) {
        formId = sourceId;
    } else if (html == 'gFormWebPRINT.html') {
        formId = sourceId;
    }
	if (formType !== 'CICMSMeeting') {
		// sourceId = window.localStorage["caseId"];
		sourceId = window.localStorage["patient_sourceId"] || formType;
	} else if (formType === 'CICMSMeeting') {
		sourceId = window.localStorage["patient_sourceId"] || 'CICMSMeeting';
    }
    if ((sourceId == formType || sourceId == 'CICMSMeeting')) {
        alert('此筆個案新增綁定時有出現錯誤，請重新新增一筆')
        return;
    }
	sourceId = checkingString(sourceId);
    var sourceIds	= $.makeArray(sourceId);
    var parent 		= window.parent.document.body;
    function getUrlSessionToJson(href) {
        var params	= href.split("?")[1];
        if (params) {
            params	= params.split(/[&=]/g);
            var json = {};
            for (var i = 0, len = params.length; i < len; i += 2) {
                json[params[i]] = params[i + 1];
            }
            json.multiLevel = json.multiLevel ? json.multiLevel : "";
            return json;
        } else {
            return { multiLevel : "" };
        }
    }
    var multiLevel = getUrlSessionToJson(html).multiLevel;
    var page = "ADD";
    //設定此form的formType
    window.localStorage["gFormWeb"+page+"_formType"+multiLevel]			= formType;
    //設定此page的對應功能頁面
    window.localStorage["gFormWeb"+page+"_frameModel"+multiLevel]		= frameModel + page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"+multiLevel]	= frameModel + page + "_INIT";
    window.localStorage["gFormWeb"+page+"_sourceId"+multiLevel]			= sourceId;
    page = "LIST";
    //設定此form的formType
    window.localStorage["gFormWeb"+page+"_formType"+multiLevel]			= formType;
    //設定此page的對應功能頁面
    window.localStorage["gFormWeb"+page+"_frameModel"+multiLevel]		= frameModel + page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"+multiLevel]	= frameModel + page + "_INIT";
    window.localStorage["gFormWeb"+page+"_sourceId"+multiLevel]			= sourceId;
    window.localStorage["gFormWeb"+page+"_sourceIds"+multiLevel]		= sourceIds;
    page = "UPD";
    //設定此form的formType
    window.localStorage["gFormWeb"+page+"_formType"+multiLevel]			= formType;
    //設定此page的對應功能頁面
    window.localStorage["gFormWeb"+page+"_frameModel"+multiLevel]		= frameModel + page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"+multiLevel]	= frameModel + page + "_INIT";
    window.localStorage["gFormWeb"+page+"_sourceId"+multiLevel]			= sourceId;
    page = "PRINT";
    //設定此form的formType
    window.localStorage["gFormWeb"+page+"_formType"+multiLevel] 		= formType;
    //設定此page的對應功能頁面
    window.localStorage["gFormWeb"+page+"_frameModel"+multiLevel] 		= frameModel+page;
    window.localStorage["gFormWeb"+page+"_frameModel_INIT"+multiLevel] 	= frameModel+page+"_INIT";
    window.localStorage["gFormWeb"+page+"_sourceId"+multiLevel] 		= sourceId;

    if (formId !== '') {
        window.localStorage["gFormWebUPD_formId"+multiLevel] = formId;
        window.localStorage["gFormWebPRINT_formId"+multiLevel] = formId;
        window.localStorage["gFormWebUPD_mode"+multiLevel] = "reply";
    }
            
    // window.localStorage["patient_phistnum"] = sourceId;
    window.localStorage["tempElement"] = null;
            
    var frame = $(parent).find('#myIframe')[0];
    if (html.indexOf("?") == -1) {
        $(frame).attr("src", "../iq-nurs/nursing/customFormV4/" + html + "?MBNIS=true");
    } else {
        $(frame).attr("src", "../iq-nurs/nursing/customFormV4/" + html + "&MBNIS=true");
    }
    
    return false;
}

function checkingString(str) {
    return str;
    /*if (str.indexOf('-') > -1) {
		str = str.replace(/\-/g, '');
		return str;
	} else {
		return str;
	}*/
}

function updating(Id, casestatus) {
    var json = {"ID": Id, "CASESTATUS": casestatus};
    $.ajax({
        url: '../wardManagement/updateCaseList.do',
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(json),
        type: 'post',
        dataType: "json",
        success: function (resultSet) {
            console.log(resultSet);
            var json = resultSet;
            if (json.resultMsg.success) {
            	if (window.localStorage['allTEam'] === '脆弱性骨折個管師' && casestatus == '400') {
            		window.localStorage['tabPage'] = '4';
            	}
                location.reload();
            }
        }
    });
}