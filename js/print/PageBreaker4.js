// #########################################################################################
// #####                                  Copy Right                                   #####
// #####  This file, PageBreaker.js, is belong to INQGEN Technology Co., Ltd.          #####
// #####  9F, No. 3, Yuan Qu St. Nan-Kang,                                             #####
// #####  Taipei, Taiwan, 115                                                          #####
// #####  TEL : +886-2-26557589                                                        #####
// #####  FAX : +886-2-26552262                                                        #####
// #####  http://www.inqgen.com.tw                                                     #####
// #########################################################################################

// #########################################################################################
/*
	System Requirement 	: IE5.5+
	Version 			: 1.0, by Mark

	update history :
	2007.07.30 : 	1. add log function
					2. debug getActualOffsetTop function, change parentNode to offsetParent
	2007.0810  :    3. fix resizeTable when table contain image
					4. break table when td rowSpan==1
	2007.0814  :    5. 在table換頁時,切table的時機是該tr中所有td最多的rowspan
					   Ex. tr中有4個td而td的rowspan依序為 4,2,2,1. 切時以rowspan=2為基準來切

	Reference:  Page Height
	A4 is a document format, as a screen image that's going to depend on the image resolution, for example an A4 document resized to:

	72 dpi (web) = 595 X 842 pixels
	96 dpi (screen) = 794 X 1122 pixels
	300 dpi (print) = 2480 X 3508 pixels (This is "A4" as I know it, i.e. "210mm X 297mm @ 300 dpi") (8.27 in. 11.69 in.)
	600 dpi (print) = 4960 X 7016 pixels

	ISO standard 	http://www.paper-paper.com/A4-1.html
*/
// #########################################################################################

/**
After page loaded, usage:
	var pBreaker = new PageBreaker(_PAGE_SIZE_A4);
	pBreaker.setUseHeader(false);
	pBreaker.setUseFooter(true);
	pBreaker.run();

*/

// environment variable
var bShowAlert = false;	// should show debug message or not ?
var bResizeTable = false; //resize table to fit page width
var bPrintoffsetTop = true; // print last element's offset on last page


// attribute variable


//允許打印的數據行數,不包括表頭部分(僅數據部分)
var linePerPage = 36;    
//紙張的寬
var iWindowWidth_A4 = 595;
//var iWindowWidth_A4 = 650;
//紙級的高度
var iPageHeight_A4 = 842;
//var iPageHeight_A4 = 771;
//表頭的高度
var iheaderHeight = 100;
//打印區的寬度
var iWindowWidth_default = iWindowWidth_A4 -20;


var iPageHeader = 0;
var iPageFooter = 0;
var iNonPrintableArea = 50;


var iPageHeight = iPageHeight_A4  ;	// what page height to be use ? default is A4
var _PAGE_SIZE_A4 = "A4";	// until now, only support A4
var iDesktopToolbarHeight = 100;
var iPaperFirstLineOffsetTop  = 0;
var pageCount=0;
var beginDate;

/**
 * Object PageBreaker Constructor
 * @param sPageSize String Apply the page size. Until now, it shoud be _PAGE_SIZE_A4 .
 */
function PageBreaker(sPageSize){
	// constance - page size A4
	this.PAGE_SIZE_A4 = "A4";
	// constance - Array of preview window width to fit page size
	this.aiWindowWidth = new Array();
	this.aiWindowWidth[this.PAGE_SIZE_A4] = iWindowWidth_A4;

	// arguments
	this.sPageSize = sPageSize?sPageSize:this.PAGE_SIZE_A4;	// default value
	this.sHeader = "";
	this.sContent = "";
	this.contentPageHeight=0;
	this.isOdd=true;
	this.hasOldData = false;
	//this.bTableContainerConsiderable = false;	// when a table used as layout manager, it often has no border, should it consider or not?
}
PageBreaker.prototype.setBeginDate = function (beginDate){
	this.beginDate = beginDate;
};
/**
 * set page size of printer
 * @param sNewPageSize String Apply the page size. Until now, it shoud be _PAGE_SIZE_A4 .
 */
PageBreaker.prototype.setHeader = function (strHeader){
	this.sHeader = strHeader;
};
/**
 * set page size of printer
 * @param sNewPageSize String Apply the page size. Until now, it shoud be _PAGE_SIZE_A4 .
 */
PageBreaker.prototype.setContent = function (strContent){
	this.sContent = strContent;
};
/**
 * set page size of printer
 * @param sNewPageSize String Apply the page size. Until now, it shoud be _PAGE_SIZE_A4 .
 */
PageBreaker.prototype.setPageSize = function (sNewPageSize){
	this.sPageSize = sNewPageSize;
};

/**
 * set page header
 * @param hasHeader
 */
PageBreaker.prototype.setUseHeader = function (hasHeader){
	var iheader = hasHeader?iPageHeader:0;
	this.contentPageHeight=iPageHeight;
};


/**
 * set page footer
 * @param hasFooter
 */
PageBreaker.prototype.setUseFooter = function (hasFooter){
	var ifooter = hasFooter?iPageFooter:0;
	iPageHeight = iPageHeight - ifooter;
};
/**
 * set offset height
 * @param iNewOffsetHeight Apply the page offset.
 */
PageBreaker.prototype.setOffsetHeight = function (iNewOffsetHeight){
	iPaperFirstLineOffsetTop  = iNewOffsetHeight;
};
/**
 * set page count
 * @param iNewOffsetHeight Apply the page offset.
 */
PageBreaker.prototype.isOddPage = function (isOdd){
	this.isOdd  = isOdd;
};
PageBreaker.prototype.sethasOldData = function (hasOldData){
	this.hasOldData  = hasOldData;
};
/**
 * Start to check and determine make html element(s) with page break.
 */
PageBreaker.prototype.run = function (){
	var iNewPageOffsetTop = 0;
	var spanIdx = 0;

	//記錄原本輸入行數
	var oldiPaperFirstLineOffsetTop = iPaperFirstLineOffsetTop;
	iPaperFirstLineOffsetTop = iPaperFirstLineOffsetTop%linePerPage;
	// 計算 document 中的 <input> 數量
	
	var countInputTag = 0;
	
	// auto re-size window
	this.resizeWindow();
	
//1. 找到 <span> 的索引位置。window 調整
	for(i = 0; i < document.all.length; i++)
	{
		//printable content start from span tag and end to span tag
		if(document.all(i).tagName.toLowerCase()=="span" && spanIdx ==0){
			spanIdx = i;
		}
		
		// 將 table 的寬度設為 iWindowWidth_default = 743px
		if(document.all(i).tagName.toLowerCase()=="table")
		{
			document.all(i).style.width = iWindowWidth_default;
		}
	}
	
//2. document 內容設定。 
	// iPaperFirstLineOffsetTop 初值為 0; isOdd 初值為 0。
	if(iPaperFirstLineOffsetTop  == 0 ){
		if(this.isOdd)
		{
			document.all(spanIdx).innerHTML = this.sHeader+this.sContent;
			
		}
		else
		{
			document.all(spanIdx).innerHTML = this.sHeader;
			// The pageBreakBefore property sets the page-break behavior before an element.
			// always: Insert a page break before the element 
			document.all(spanIdx).style.pageBreakBefore = "always";
			document.all(spanIdx).innerHTML+=this.sContent;
		
			countInputTag = 0;
		}
	}
	//iPaperFirstLineOffsetTop  != 0
	if(iPaperFirstLineOffsetTop  != 0 ){
		if(this.isOdd)
		{
			document.all(spanIdx).innerHTML = this.sContent;
			
			// insert div to first child of span
			var div = document.createElement("div");
			div.style.width = "100%";
			// div.style.height = (iPaperFirstLineOffsetTop*25+iheaderHeight)-2+"px";
			div.style.height = (iPaperFirstLineOffsetTop*25+iheaderHeight)+"px";//两个div接缝处的大小 
			div.innerHTML = "&nbsp;";
			document.body.insertBefore(div, document.body.firstChild);
			
			//insert div tag before span tag. so spanId++
			spanIdx++;
		}
		else
		{
			document.all(spanIdx).innerHTML = this.sContent;

			// insert div to first child of span
			var div = document.createElement("div");
			div.style.width = "100%";
			// div.style.height = (iPaperFirstLineOffsetTop*25+iheaderHeight)-2+"px";
			div.style.height = (iPaperFirstLineOffsetTop*25+iheaderHeight)+"px";//两个div接缝处的大小
			div.innerHTML = "&nbsp;";
			document.body.insertBefore(div, document.body.firstChild);

			var div = document.createElement("div");
			div.style.width = "100%";
			div.style.height ="0px";
			div.innerHTML = "&nbsp;";
			div.style.pageBreakBefore = "always";
			document.body.insertBefore(div, document.body.firstChild);

			//insert div tag before span tag. so spanId++
			spanIdx+=2;
			//[PJNAA-97] 換頁重新計算
			countInputTag = 0;
		}
	}

	var orgRecordDay = '';
	var insertTableStart = '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td align="center" class="date">';
	var insertTableEnd = '</td></tr></table>';
	var isFirstDate = true;
	// var count = 0;

	// 查詢整個 documnet 內的 input tag 資訊，若條件成立則設定到指定的欄位中
	for(i = 0; i < document.all.length; i++)
	{
		var recordDay = '';
		
		if(document.all(i).tagName.toLowerCase()=="input")
		{
			var obj = document.all(i);
			recordDay = obj.value;
			
			if(recordDay != 'undefined' && recordDay!=null && recordDay.length>0)
			{
				if(orgRecordDay!=recordDay){  
					if( iPaperFirstLineOffsetTop==0|| !(this.hasOldData&&isFirstDate) )
					{						
						var obj1 = obj.nextSibling.nextSibling;
						// get <td>
						obj1.firstChild.firstChild.firstChild.innerText=recordDay;
			    		//var recordMessage = insertTableStart + recordDay + insertTableEnd;
						//obj.insertAdjacentHTML("afterEnd", recordMessage);
					}else{
						isFirstDate = false;
					}
				}
				orgRecordDay = recordDay;
			}
		}
	}
	
	// 對整個 document 的內容作調整，判斷是否作分頁的設定，若有分頁則需調整 content的部分內容需作調整	
	for(i = 0; i < document.all.length; i++)
	{
		// 當列印的記錄已超過列印頁面設定的高度則作分頁
		// if object's actual distance from iNewPageOffsetTop is bigger than iPageHeight, that mean there is an auto-page-break by web brower (IE),
		// so iNewPageOffsetTop should be updated by plus an iPageHeight
//* 針對 tr tag 作的分頁處理
		
		//alert(iNewPageOffsetTop+"\t"+iPageHeight+"\t"+(this.getActualOffsetTop(document.all(i))-iNewPageOffsetTop));
		
//		if(false)
//		{
//			// 增加頁數
//			pageCount++;
//				
//			var obj = document.all(i);
//			alert(document.all(i).tagName.toLowerCase()+"\t"+i);
//			alert( ((this.getActualOffsetTop(document.all(i)))+"\t"+iNewPageOffsetTop+"\t"+iPageHeight));
//			// insertAdjacentHTML方法: 在指定的地方插入html 。
//			//alert(obj.innerHTML);  
//			//document.write(document.getElementById("realPrint").innerHTML);
//			obj.insertAdjacentHTML("beforeBegin", this.sHeader);
//			// pageBreakBefore: 列印分頁設定			
//			obj.previousSibling.previousSibling.previousSibling.style.pageBreakAfter = "always";
//				
//			// 更新 iNewPageOffsetTop 值
//			iNewPageOffsetTop = this.getActualOffsetTop(obj.previousSibling.previousSibling.previousSibling);
//
//			if(bShowAlert) this.log(i+":"+document.all(i).tagName+":reset iNewPageOffsetTop to "+iNewPageOffsetTop);
//			
//			countInputTag = 0;
//		}

		var lastInputTag;
		
		//* 針對 <table> 或 <img> 作分頁處理。
		if(document.all(i).tagName.toLowerCase()=="table" || document.all(i).tagName.toLowerCase()=="img")
		{
			if(bShowAlert) this.log("document.all("+i+").tagName = '"+document.all(i).tagName+"'");
			
			var obj = document.all(i);
						
			// 調整欄位寬度
			if(obj.tagName.toLowerCase()=="table")
			{
				if(obj.width != undefined && obj.width != "" && obj.width != 311 && obj.width != 125 ){
					obj.style.width="640px";
					if(obj.firstChild.firstChild.cells.length ==5){
						obj.firstChild.firstChild.cells[0].style.width="89px";					
						obj.firstChild.firstChild.cells[1].style.width="51px";
						obj.firstChild.firstChild.cells[2].style.width="85px";
						obj.firstChild.firstChild.cells[3].style.width="382px";
					}else if(obj.firstChild.firstChild.cells.length ==4){
						obj.firstChild.firstChild.cells[0].style.width="89px";
						obj.firstChild.firstChild.cells[1].style.width="51px";
						obj.firstChild.firstChild.cells[2].style.width="468px";
					} 
				}
			}		   
			//2                           0                         50                 100                  35*25
			//alert(this.getActualOffsetTop(obj)+"\t"+iNewPageOffsetTop+"\t"+obj.offsetHeight+"\t"+iheaderHeight+"\t"+linePerPage);break;
			// iheaderHeight: header 的高度
			if((this.getActualOffsetTop(obj)-iNewPageOffsetTop)+obj.offsetHeight>(iheaderHeight + linePerPage*25))
			{
				if(bShowAlert) {
					var objid = "";
					try{
						objid = obj.id;
					}catch(e){}
					objid = obj.tagName+":"+objid;
					this.log(objid+":(obj.offsetTop("+this.getActualOffsetTop(obj)+")-iNewPageOffsetTop("+iNewPageOffsetTop+"))+obj.offsetHeight("+obj.offsetHeight+")>this.contentPageHeight("+iPageHeight+")");
				}

				// get input tag
				var inputTagValue = this.findInputObj(obj);
				if(inputTagValue==undefined){
					continue;
				}
				var preInputTagValue = inputTagValue.previousSibling.previousSibling.previousSibling;	
				var nextInputTagValue = inputTagValue.nextSibling.nextSibling.nextSibling;
				
				// 加上記錄時間到指定的欄位
				if( inputTagValue.previousSibling ==null || (this.getActualOffsetTop(inputTagValue.previousSibling)+inputTagValue.previousSibling.offsetHeight-iNewPageOffsetTop) <= (iheaderHeight + linePerPage*25)){
					var obj1 = inputTagValue.nextSibling.nextSibling;
					obj1.firstChild.firstChild.firstChild.innerText=recordDay;
					//var recordMessage = insertTableStart + inputTagValue.value + insertTableEnd;
					//inputTagValue.insertAdjacentHTML("beforeBegin", recordMessage);
				}

				// 分頁前一頁最後一列資訊的 style 設定
				var styleClass="tableButton";				
				
				inputTagValue.previousSibling.firstChild.firstChild.cells[0].className=styleClass;
				inputTagValue.previousSibling.firstChild.firstChild.cells[1].className=styleClass;
				inputTagValue.previousSibling.firstChild.firstChild.cells[2].className=styleClass;
				inputTagValue.previousSibling.firstChild.firstChild.cells[3].className=styleClass;
				inputTagValue.previousSibling.firstChild.firstChild.cells[4].className=styleClass;
				
				// insert head
				//inputTagValue.insertAdjacentHTML("beforeBegin", this.sHeader);
//				inputTagValue.insertAdjacentHTML("beforeBegin", "<center>第__"+(pageCount+1)+"__页</center><br/>"+this.sHeader);
				inputTagValue.insertAdjacentHTML("beforeBegin", "<br/>"+this.sHeader);
				
				// page break
				inputTagValue.previousSibling.previousSibling.previousSibling.style.pageBreakAfter = "always";
				iNewPageOffsetTop = this.getActualOffsetTop(inputTagValue.previousSibling.previousSibling.previousSibling);

				countInputTag = 0;
				
				pageCount++;
				// if has no date
				recordDay = inputTagValue.value;
				
				if(inputTagValue.nextSibling.outerHTML == undefined )
				{
					var obj1 = inputTagValue.nextSibling.nextSibling;
					obj1.firstChild.firstChild.firstChild.innerText=recordDay;					
					obj1.firstChild.firstChild.firstChild.nextSibling.innerHTML = obj1.firstChild.firstChild.firstChild.nextSibling.timeValue;					
					
					if (inputTagValue.previousSibling.previousSibling.previousSibling.style.pageBreakAfter == "always")					
					{
						// 將目前處理的資訊和前一筆及下一筆資訊作比對，檢查相鄰的資訊是否為同一筆記錄。
						if(inputTagValue.id == preInputTagValue.id)
						{
							if (nextInputTagValue != null && nextInputTagValue != undefined)
							{	
								// 比較 input tag 的 ID 屬性 
								if (inputTagValue.id == nextInputTagValue.id)
								{
									var obj2 = nextInputTagValue.nextSibling.nextSibling;
									obj2.firstChild.firstChild.firstChild.nextSibling.innerText="(續)";
								}
								else
									obj1.firstChild.firstChild.firstChild.nextSibling.innerHTML += "<br/>(續)";
							}
						}
					}
					
					//var recordMessage = insertTableStart + recordDay + " 續" + insertTableEnd;
					//inputTagValue.insertAdjacentHTML("afterEnd", recordMessage);
				}
				else{
					inputTagValue.nextSibling.firstChild.firstChild.firstChild.innerHTML += " 續";
				}
			}
		}// if table or img tag	
		
		// 記錄列數計算
		if (document.all(i).tagName.toLowerCase() == 'input')
		{			
			countInputTag += 1;
				
			var current = document.all(i);
			var next = current.nextSibling.nextSibling.nextSibling;
			
			// 當 <input> tag 找不到下一個<input>時，表示下方不再有資訊。
			if (next == null || next == undefined)
			{
				var lastTable = current.nextSibling.nextSibling;
				var total = 0;
				if(pageCount == 0){
					total = countInputTag + oldiPaperFirstLineOffsetTop;
				} else {
					total = pageCount*linePerPage+countInputTag-iPaperFirstLineOffsetTop+oldiPaperFirstLineOffsetTop;
				}
				lastTable.firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerText=total;
				lastTable.firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.style.textAlign="right";
			}
		}
	}// for i
	
	
	
	
	
	
};

PageBreaker.prototype.findInputObj = function (obj){
	if(obj!="null"&&obj!=null){
		if(obj.tagName!="INPUT"){
			return this.findInputObj(obj.previousSibling);
		}else{
			return obj;
		}
	}
}
/**
 * Make page break at proper TR in a Table
 * @param oTable object of HTML Table
 * @param iPageOffsetTop integer
 * @return integer The new page offsetTop value.
 */
PageBreaker.prototype.breakTable = function (oTable, iPageOffsetTop){
	if(oTable.tagName.toLowerCase() != "table") return iPageOffsetTop;
	var iNewPageOffsetTop = iPageOffsetTop;
	// check every row TR
	for(var rowidx=0; rowidx<oTable.rows.length; rowidx++){
		var oTr = oTable.rows(rowidx);

		var hash = new Hashtable();
		// put key=oTd.rowSpan value=count into hashtable
		for(var colidx=0; colidx<oTr.cells.length; colidx++){
			var oTd = oTr.cells(colidx);
			if(hash.containsKey(oTd.rowSpan))
			{
				var value = hash.get(oTd.rowSpan);
				hash.put(oTd.rowSpan,(value+1));
			}else{
				hash.put(oTd.rowSpan,1);
			}
		}

		var keys = hash.keys();
		var breakRowSpan = keys[0];
		//get max count
		for(var i=0;i<keys.length;i++){
			if(hash.get(keys[i]) > hash.get(breakRowSpan))
			{
				breakRowSpan = keys[i];
			}
		}
		// check every column TD, if any TD will be break into 2 page, make page break at this TR
		for(var colidx=0; colidx<oTr.cells.length; colidx++){
			var oTd = oTr.cells(colidx);
			//break table base on max count's key (breakRowSpan)
			if((this.getActualOffsetTop(oTr)+oTd.offsetHeight-iNewPageOffsetTop)>iPageHeight && oTd.rowSpan==breakRowSpan){
				// do something to make page break at this TR
				pageCount++;
				oTr.insertAdjacentHTML("beforeBegin", this.sHeader);
				oTr.previousSibling.previousSibling.previousSibling.style.pageBreakAfter = "always";

				if(oTd.offsetHeight>this.contentPageHeight){
					iNewPageOffsetTop = this.getActualOffsetTop(oTr)+oTd.offsetHeight-(oTd.offsetHeight % iPageHeight);	// ????
				}else{
					iNewPageOffsetTop = this.getActualOffsetTop(oTr);
				}

				break;	// break and continue next TR
			}
		}
	}

	return iNewPageOffsetTop;
};

/**
 * In nested situation, calculate and return it's absolute distance from the begin of BODY.
 * @param obj Element of html object
 * @param total integer A sum of nested html element's offsetTop.
 * @param integer The offsetTop from child node.
 */
PageBreaker.prototype.getActualOffsetTop = function (obj, total){

	return obj.getBoundingClientRect().top;
/*
	this.log("getActualOffsetTop("+obj.tagName+","+total+")");
	if(total!=null){
		if(obj.tagName.toUpperCase()=="TD"){
			//alert("obj is a <TD>, skip it.");
		}else{
			total = total+obj.offsetTop;
			if(parseInt(obj.currentStyle.borderTopWidth)>0)
			{
				total+=parseInt(obj.currentStyle.borderTopWidth);
			}
			if(parseInt(obj.currentStyle.borderBottomWidth)>0)
			{
				total+=parseInt(obj.currentStyle.borderBottomWidth);
			}

		}
	}else{
		total = obj.offsetTop;
		if(parseInt(obj.currentStyle.borderTopWidth)>0)
		{
			total+=parseInt(obj.currentStyle.borderTopWidth);
		}
		if(parseInt(obj.currentStyle.borderBottomWidth)>0)
		{
			total+=parseInt(obj.currentStyle.borderBottomWidth);
		}
	}


	if(obj.offsetParent){
		if(obj.offsetParent.offsetTop){
			return parseInt(this.getActualOffsetTop(obj.offsetParent, total));
		}else{
			var tmpobj=obj;
			while(tmpobj.offsetParent){
				if(tmpobj.offsetParent.offsetTop){
					return parseInt(this.getActualOffsetTop(tmpobj.offsetParent, total));
				}else{
					tmpobj = tmpobj.offsetParent;
				}
			}
			return parseInt(total);
		}
	}else{
		return parseInt(total);
	}
*/
};


/**
 * Resize the preview table to fit PAGE WIDTH.
 * @param table Obj
 */
PageBreaker.prototype.resizeTable = function (obj){
	// if this is a table
	var isResize = true;
	if(obj.tagName.toLowerCase()=="table" ){
		if(obj.clientWidth > iWindowWidth_default)
		{
			var oColl = obj.cells;
			for(var i=0;i<oColl.length;i++)
			{
				for(var j=0;j<oColl[i].all.length && isResize ;j++)
				{
					if(oColl[i].all(j).tagName.toLowerCase() == "img")
						isResize = false;
				}
				if(isResize)
					oColl[i].style.wordWrap = "break-word";
			}
			if(isResize)
				obj.style.tableLayout = "fixed";
		}
	}

};

/**
 * If a TABLE without border, it should not be considered in PageBreaker object.
 * @param oTable Table object of html element.
 * @return boolean
 */
PageBreaker.prototype.isTableConsiderable = function(oTable){
	return oTable.border>0;		// if a table has border, it should be consider (should calculate page break or not?)
};

/**
 * Resize the preview window to fit PAGE SIZE.
 */
PageBreaker.prototype.resizeWindow = function(){
	var iToWidth = iWindowWidth_default;
	var iToHeight = iPageHeight;
	if(this.aiWindowWidth[this.sPageSize]!="undefined"){
		iToWidth = this.aiWindowWidth[this.sPageSize];
	}
	window.resizeTo(iToWidth, iToHeight);
};
 
PageBreaker.prototype.log = function(msg){
	if(typeof(PageBreaker_log)!="undefined"){
		try{
			PageBreaker_log(msg);
		}catch(e){
			window.status += e.toString();
		}
	}
};

PageBreaker.prototype.toString = function()
{
	// attribute variable
	alert("iPageHeader: " + iPageHeader + ", " +
	"iPageFooter : " + iPageFooter + ", " +
	"iNonPrintableArea : " + iNonPrintableArea + ", " +
	"iheaderHeight : " +  iheaderHeight + ", " +
	"iPageHeight_A4 : " +  iPageHeight_A4 + ", " +
	"iPageHeight : " +  iPageHeight + ", " +
	"_PAGE_SIZE_A4 : " +  _PAGE_SIZE_A4 + ", " +
	"iWindowWidth_A4 : " +  iWindowWidth_A4 + ", " + 
	"iWindowWidth_default : " +  iWindowWidth_default + ", " +
	"iDesktopToolbarHeight : " +  iDesktopToolbarHeight + ", " +
	"iPaperFirstLineOffsetTop : " +  iPaperFirstLineOffsetTop + ", " +
	"pageCount : " +  pageCount);
}
