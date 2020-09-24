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
	A4纸的尺寸是210mm*297mm，也就是21.0cm*29.7cm，而1英寸=2.54cm，如果屏幕DPI分辨率为72像素/英寸，换算一下：相当于1cm可呈现 (72px/2.54cm) = 28.34px
	下面是一些常用分辨率下A4纸在屏幕上的像素尺寸：
	分辨率是72像素/英寸时，A4纸的尺寸的图像的像素是595×842；
	分辨率是96像素/英寸时，A4纸的尺寸的图像的像素是794×1123；(默认)
	分辨率是120像素/英寸时，A4纸的尺寸的图像的像素是1487×2105；
	分辨率是150像素/英寸时，A4纸的尺寸的图像的像素是1240×1754；
	分辨率是300像素/英寸时，A4纸的尺寸的图像的像素是2480×3508；			
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
var bResizeTable = true; //resize table to fit page width
var bPrintoffsetTop = false; // print last element's offset on last page
var iPaperFirstLineOffsetTop  = 0;
var count = 0; //計算第幾頁

// attribute variable
var iPageHeader = 0;
var iPageFooter = 20;
var iNonPrintableArea = 0;
var iPageHeight_A4 = 963;	//771 the real page height of A4
var iPageHeight = iPageHeight_A4 - iNonPrintableArea;	// what page height to be use ? default is A4
var _PAGE_SIZE_A4 = "A4";	// until now, only support A4
var iWindowWidth_A4 = 794;	// The proper size of preview window to fit page size A4.
var iWindowWidth_default = iWindowWidth_A4 - iNonPrintableArea;
var iDesktopToolbarHeight = 0;

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
	
	//this.bTableContainerConsiderable = false;	// when a table used as layout manager, it often has no border, should it consider or not?
}

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
	iPageHeight = iPageHeight - iheader;

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
	this.iPaperFirstLineOffsetTop  = iNewOffsetHeight;
};
PageBreaker.prototype.getContentHeight = function (){
	var contentHeight = iPageHeight;
	if(count!=0)
		contentHeight = iPageHeight-147;
	return 	contentHeight;

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
	}

	//iPaperFirstLineOffsetTop  != 0
	if(iPaperFirstLineOffsetTop  != 0 ){
		var obj = document.all(spanIdx);
		// insert div to first child of span		
		var div = document.createElement("div");
		div.style.width = "100%";
		div.style.height = (iPaperFirstLineOffsetTop/screen.deviceYDPI)+"in";
		div.innerHTML = "&nbsp;"
		obj.insertBefore(div, obj.firstChild);		
	}		
	
	for(i = 0; i < document.all.length; i++){	
			
		if(document.all(i).tagName.toLowerCase()=="table")
		{
			if(bResizeTable)
				this.resizeTable(document.all(i));	
		}

		// if object's actual distance from iNewPageOffsetTop is bigger than iPageHeight, that mean there is an auto-page-break by web brower (IE),
		// so iNewPageOffsetTop should be updated by plus an iPageHeight
		if(!(document.all(i).tagName.toLowerCase()=="table" || document.all(i).tagName.toLowerCase()=="img" || document.all(i).tagName.toLowerCase()=="td" ||document.all(i).tagName.toLowerCase()=="form" ) 
				&& ((this.getActualOffsetTop(document.all(i))-iNewPageOffsetTop)>this.getContentHeight())){
			iNewPageOffsetTop+=this.getContentHeight();
			count++;
			if(bShowAlert) this.log(i+":"+document.all(i).tagName+":reset iNewPageOffsetTop to "+iNewPageOffsetTop);
		}		
		
		if(document.all(i).tagName.toLowerCase()=="table" || document.all(i).tagName.toLowerCase()=="img"){
			if(bShowAlert) this.log("document.all("+i+").tagName = '"+document.all(i).tagName+"'");
			var obj = document.all(i);

			if((this.getActualOffsetTop(obj)-iNewPageOffsetTop)+obj.offsetHeight>this.getContentHeight()){
				if(bShowAlert) {
					var objid = "";
					try{
						objid = obj.id;
					}catch(e){}
					objid = obj.tagName+":"+objid;
					this.log(objid+":(obj.offsetTop("+this.getActualOffsetTop(obj)+")-iNewPageOffsetTop("+iNewPageOffsetTop+"))+obj.offsetHeight("+obj.offsetHeight+")>contentHeight("+this.getContentHeight()+")");
				}
				obj.style.pageBreakBefore = "always";
				
				count++;				
				// test if this object's height is bigger than page height ?
				if((this.getActualOffsetTop(obj)-iNewPageOffsetTop)+obj.offsetHeight>this.getContentHeight()){
					// if this object is a table, then make page break at propery TR
					if(document.all(i).tagName.toLowerCase()=="table"){
						// clear page break CSS
						obj.style.pageBreakBefore = "";
						count--;
						// re-break page in table's TR
						iNewPageOffsetTop = this.breakTable(obj, iNewPageOffsetTop);
					}else{
						// this should be an IMG
						iNewPageOffsetTop = this.getActualOffsetTop(obj)+obj.offsetHeight-(obj.offsetHeight % this.getContentHeight());	// get the remainder
					}
				}else{
					//iNewPageOffsetTop = obj.offsetTop;
					iNewPageOffsetTop = this.getActualOffsetTop(obj);
				}
			}
		}// if table or img tag
	}// for i
	
	if(bPrintoffsetTop)
	{
		var offsetHtml = "<div id='offsetDiv' style='position:relative;left:0;top:0px'></div>";	
		document.all(spanIdx).insertAdjacentHTML("beforeEnd", offsetHtml);		
	
		var div = document.getElementById("offsetDiv");	
		div.innerText = " ";
		//div.innerText = parseInt(this.getActualOffsetTop(div)-iNewPageOffsetTop);
	}

	
};

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
			if((this.getActualOffsetTop(oTr)+oTd.offsetHeight-iNewPageOffsetTop)>this.getContentHeight() && oTd.rowSpan==breakRowSpan){		
				// do something to make page break at this TR
				oTr.style.pageBreakBefore = "always";
				count++;
				if(oTd.offsetHeight>this.getContentHeight()){
					iNewPageOffsetTop = this.getActualOffsetTop(oTr)+oTd.offsetHeight-(oTd.offsetHeight % this.getContentHeight());	// 取餘數
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

//	return obj.getBoundingClientRect().top;
	

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
		}
	}else{
		total = obj.offsetTop;
		if(parseInt(obj.currentStyle.borderTopWidth)>0)
		{
			total+=parseInt(obj.currentStyle.borderTopWidth);
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
	var iToHeight = screen.height-iDesktopToolbarHeight;
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

function doPrint71()
{
    document.all("print1").value	= '處理中';
    document.all("print2").value	= '處理中';
    disabledButton(true)	
    try{
    	var title="${teEnt.formName}";
		factory.printing.header = " ";
		factory.printing.footer = " ";
		factory.printing.leftMargin = 10;
		factory.printing.topMargin = 5;
		factory.printing.rightMargin = 10;
		factory.printing.bottomMargin = 20;
		//myprint();
		wb.execwb(7,1);
		window.close();
		
	    document.all("print1").value	= '列印';
	    document.all("print2").value	= '列印';
	    disabledButton(false);	
	}catch(e)
	{
		disabledButton(false);
		alert("未安裝ActiveX元件，無法進行列印!!");
	}		
}	

function doPrint66()
{
    document.all("print1").value	= '處理中';
    document.all("print2").value	= '處理中';
    disabledButton(true)	
    try{
    	var title="${teEnt.formName}";
		factory.printing.header = " ";
		factory.printing.footer = " ";
		factory.printing.leftMargin = 10;
		factory.printing.topMargin = 5;
		factory.printing.rightMargin = 10;
		factory.printing.bottomMargin = 20;
		//myprint();
		wb.execwb(6,6);
		window.close();
		
	    document.all("print1").value	= '列印';
	    document.all("print2").value	= '列印';
	    disabledButton(false);	
	}catch(e)
	{
		disabledButton(false);
		alert("未安裝ActiveX元件，無法進行列印!!");
	}		
}	


