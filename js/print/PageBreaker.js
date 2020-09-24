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
	2007.0814  :    5. ¦btable´«­¶®É,¤Átableªº®É¾÷¬O¸Ótr¤¤©Ò¦³td³Ì¦hªºrowspan
					   Ex. tr¤¤¦³4­Ótd¦Ótdªºrowspan¨Ì§Ç¬° 4,2,2,1. ¤Á®É¥Hrowspan=2¬°°ò·Ç¨Ó¤Á

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
var iPageHeader = 0;
var iPageFooter = 0;
var iNonPrintableArea = 50;
var iheaderHeight = 112;
var iPageHeight_A4 = 1037;	// the real page height of A4 // ­ì¨Ó¬O 1018
var iPageHeight = iPageHeight_A4  ;	// what page height to be use ? default is A4
var _PAGE_SIZE_A4 = "A4";	// until now, only support A4
var iWindowWidth_A4 = 793;	// The proper size of preview window to fit page size A4.
var iWindowWidth_default = iWindowWidth_A4 -50;
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

	// auto re-size window
	this.resizeWindow();

	for(i = 0; i < document.all.length; i++){
		//printable content start from span tag and end to span tag
		if(document.all(i).tagName.toLowerCase()=="span" && spanIdx ==0){
			spanIdx = i;
		}

		if(document.all(i).tagName.toLowerCase()=="table")
		{
			document.all(i).style.width = iWindowWidth_default;
		}

	}
	if(iPaperFirstLineOffsetTop  == 0 ){
		if(this.isOdd)
		{
			document.all(spanIdx).innerHTML = this.sHeader+this.sContent;
		}else{
			document.all(spanIdx).innerHTML = this.sHeader;
			document.all(spanIdx).style.pageBreakBefore = "always";
			document.all(spanIdx).innerHTML+=this.sContent;
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
			div.style.height = (iPaperFirstLineOffsetTop*25+iheaderHeight)-2+"px";
			div.innerHTML = "&nbsp;"
			document.body.insertBefore(div, document.body.firstChild);
			//insert div tag before span tag. so spanId++
			spanIdx++;
		}else{
			document.all(spanIdx).innerHTML = this.sContent;

			// insert div to first child of span
			var div = document.createElement("div");
			div.style.width = "100%";
			div.style.height = (iPaperFirstLineOffsetTop*25+iheaderHeight)-2+"px";
			div.innerHTML = "&nbsp;"
			document.body.insertBefore(div, document.body.firstChild);

			var div = document.createElement("div");
			div.style.width = "100%";
			div.style.height ="0px";
			div.innerHTML = "&nbsp;"
			div.style.pageBreakBefore = "always";
			document.body.insertBefore(div, document.body.firstChild);

			//insert div tag before span tag. so spanId++
			spanIdx+=2;
		}
	}

	var orgRecordDay = '';
	var insertTableStart = '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td align="center" class="date">';
	var insertTableEnd = '</td></tr></table>';
	var count = 0;
	var isFirstDate = true;
	for(i = 0; i < document.all.length; i++){
		var recordDay = '';
		if(document.all(i).tagName.toLowerCase()=="input"){
			var obj = document.all(i);
			recordDay = obj.value;
			if(recordDay!='undefined' && recordDay!=null && recordDay.length>0){
				if(orgRecordDay!=recordDay){
					if( iPaperFirstLineOffsetTop==0|| !(this.hasOldData&&isFirstDate) ){
						var recordMessage = insertTableStart + recordDay + insertTableEnd;
						obj.insertAdjacentHTML("afterEnd", recordMessage);
					}else{
						isFirstDate = false;
					}
				}
				orgRecordDay = recordDay;
			}
		}
	}
	for(i = 0; i < document.all.length; i++){

		// if object's actual distance from iNewPageOffsetTop is bigger than iPageHeight, that mean there is an auto-page-break by web brower (IE),
		// so iNewPageOffsetTop should be updated by plus an iPageHeight
		if(!(document.all(i).tagName.toLowerCase()=="table" || document.all(i).tagName.toLowerCase()=="img" || document.all(i).tagName.toLowerCase()=="td" ||document.all(i).tagName.toLowerCase()=="form" ||document.all(i).tagName.toLowerCase()=="span" )
				&& ((this.getActualOffsetTop(document.all(i))-iNewPageOffsetTop)>iPageHeight)){
				pageCount++;
				var obj = document.all(i);
				obj.insertAdjacentHTML("beforeBegin", this.sHeader);
				obj.previousSibling.previousSibling.previousSibling.style.pageBreakBefore = "always";
				iNewPageOffsetTop = this.getActualOffsetTop(obj.previousSibling.previousSibling.previousSibling);

			if(bShowAlert) this.log(i+":"+document.all(i).tagName+":reset iNewPageOffsetTop to "+iNewPageOffsetTop);
		}

		if(document.all(i).tagName.toLowerCase()=="table" || document.all(i).tagName.toLowerCase()=="img"){
			if(bShowAlert) this.log("document.all("+i+").tagName = '"+document.all(i).tagName+"'");
			var obj = document.all(i);

			if((this.getActualOffsetTop(obj)-iNewPageOffsetTop)+obj.offsetHeight>(iheaderHeight + 37*25)){
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
				if( inputTagValue.previousSibling ==null || (this.getActualOffsetTop(inputTagValue.previousSibling)+inputTagValue.previousSibling.offsetHeight-iNewPageOffsetTop) <= (iheaderHeight + 36*25)){
					var recordMessage = insertTableStart + inputTagValue.value + insertTableEnd;
					inputTagValue.insertAdjacentHTML("beforeBegin", recordMessage);
				}

				// insert head
				inputTagValue.insertAdjacentHTML("beforeBegin", this.sHeader);
				// page break
				inputTagValue.previousSibling.previousSibling.previousSibling.style.pageBreakBefore = "always";
				iNewPageOffsetTop = this.getActualOffsetTop(inputTagValue.previousSibling.previousSibling.previousSibling);

				pageCount++;
				// if has no date
				recordDay = inputTagValue.value;
				if(inputTagValue.nextSibling.outerHTML == undefined ){
					var recordMessage = insertTableStart + recordDay + " Äò" + insertTableEnd;
					inputTagValue.insertAdjacentHTML("afterEnd", recordMessage);
				}else{
					inputTagValue.nextSibling.firstChild.firstChild.firstChild.innerHTML += " Äò"
				}
			}
		}// if table or img tag
	}// for i

};
PageBreaker.prototype.findInputObj = function (obj){
	if(obj.tagName!="INPUT"){
		return this.findInputObj(obj.previousSibling);
	}else{
		return obj;
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
				oTr.previousSibling.previousSibling.previousSibling.style.pageBreakBefore = "always";

				if(oTd.offsetHeight>this.contentPageHeight){
					iNewPageOffsetTop = this.getActualOffsetTop(oTr)+oTd.offsetHeight-(oTd.offsetHeight % iPageHeight);	// ?–é???
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

