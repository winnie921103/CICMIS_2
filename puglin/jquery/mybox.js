
function mybox(opt){
	/*默认*/
	
	var defaults = {
		id:'',
		content : '111111111',
		ctype : 'common',//url:则将url 里面的内容，加载进来
		width : 300,
		height : 200,
		posTop:12,
		posLeft:12,
		mask : true,
		drag : true,
		pos : 'center',//center=居中，rightdown=右下,custom=自定义
		fix : true,
		url : '',
		showMaskLayer : false
	};
	var userAgent = navigator.userAgent.toLowerCase();
	// Figure out what browser is being used
	jQuery.browser = {
		version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
		safari: /webkit/.test(userAgent),
		opera: /opera/.test(userAgent),
		msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
		mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
	};
	var isIe6 = $.browser.msie && ($.browser.version == "6.0");
	/*合并选项*/
	var config = $.extend(defaults, opt);

	this.winTime="";
	
	/*模板*/
	
	var tpl = '<div id="'+config.id+'"  style="position:absolute;  border:1px solid #84a0c4; background:#d3e2f5;  z-index:100;" class="popbox"><div style=" background:#fff; border:0px solid #84a0c4;width:100%;height:100%;z-index:99" id="popboxcontent"></div></div>';
	/*弹出*/ 
	this.popout=function(){
		$('#maskLayer').remove();
		$('.popbox').remove();
		if($("#"+config.id).html()==null){
		$("body").prepend(tpl);/*挂载*/
		}
		position();/*调整位置*/
		content();/*填充内容*/
		if(config.showMaskLayer){
			maskLayer("#FFF");
		}else{
			bindClosed();
		}
	};
	/*延时关闭窗口*/
	this.close=function(){
		$("#"+config.id).mouseout();
    }
	/*立即关闭窗口*/
	this.fastClose=function(){
	     $("#"+config.id).hide();
		 $("#"+config.id).remove();
	}
	
	function closed(){
		$("#maskLayer").click();
	}
	
	function bindClosed(){
	    $("#"+config.id).bind("mouseout",function(){
			this.winTime=setTimeout(closeTimeer,100);
		});
		
	    $("#"+config.id).mousemove(function(){
			if(this.winTime){
		     window.clearTimeout(this.winTime);
			 this.winTime=null;
			}
		 });
	    
		 $("#popboxcontent").scroll(function(){
			 $("#"+config.id).mousemove();
		 });
		 
		 $("#"+config.id).bind("click",function(){});
	}
	
	function closeTimeer()
	{
		$("#mainFrame").fadeIn("fast");
		if($("#"+config.id).html()!=null){
		 $("#"+config.id).hide();
		 $("#"+config.id).remove();
		 
		}
    }
	
	

	/*调整位置*/
	function position(){
		
		if(isIe6) {
			var fix = 'absolute';
		}else{
			var fix = config.fix ? 'fixed' : 'absolute';
		}
		if(config.pos == 'center'){/*居中*/
			var left = ($(window).scrollLeft() + $(window).width()/2 - (config.width/2))+'px';
			var top = ($(window).scrollTop() + $(window).height()/2 - (config.height/2))+'px';
			$("#"+config.id).css({'position':fix,'top':top,'left':left,'width':config.width,'height':config.height});
		}else if(config.pos == 'rightdown'){/*右下*/
			$("#"+config.id).css({'position':fix,'right':0,'bottom':0,'width':config.width,'height':config.height});
		}else if(config.pos=='custom'){//自定议
            var left = config.posLeft+'px';
			var top = config.posTop+'px';
			
			if(config.id=='selectStation'){
				
				$("#"+config.id).css({'position':fix,'top':top,'left':left,'width':config.width,'height':config.height });
			}else {
				
				$("#"+config.id).css({'position':fix,'top':top,'left':left,'width':config.width,'height':config.height ,'overflow':'hidden'});
			}
			

		}else{/*默认居中*/
			var left = ($(window).scrollLeft() + $(window).width()/2 - (config.width/2))+'px';
			var top = ($(window).scrollTop() + $(window).height()/2 - (config.height/2))+'px';
			$("#"+config.id).css({'position':fix,'top':top,'left':left,'width':config.width,'height':config.height});
		}


		
	};
	/*填充内容*/
	function content(){
	
		if(config.ctype == 'common'){/*文本或html内容*/
			$('#popboxcontent').html(config.content);
		}else if(config.ctype == 'url'){/*ajax请求*/
			if(!config.url){$('#popboxcontent').html('请确认url地址');return;}
			$.ajax({
				url:config.url,
				beforeSend : function(){$('#popboxcontent').html('加载中...');},
				type : 'post',
				success : function(msg){$('#popboxcontent').html(msg);},
				error : function(){$('#popboxcontent').html('加载失败:(');}
			});
		}else{/*默认*/
			$('#popboxcontent').html(config.content);
		}

		
	}














	/*遮罩层*/
	function maskLayer(color){
		if(!color){color='#e7e527';}
		var tmpMask=new String;
		tmpMask = '<div id="maskLayer" ></div>';
		$("body").prepend(tmpMask);
		$('#maskLayer').css({
			/*'width':$(document).width()+'px',*/
			'width':'100%',
			'height':$(document).height()+'px',
			'position':'absolute',
			'top':'0px',
			'left':'0px',
			'z-index':'99',
			'background-color':color,
			'filter':'alpha(opacity=50)',
			'opacity':'0.5'
		});

		$("#maskLayer").bind('click',function(){
			$("#mainFrame").fadeIn("fast");
			setTimeout("$('#maskLayer').fadeOut(500)",0);
			setTimeout("$('.popbox').fadeOut(500)",0);
			setTimeout("$('#maskLayer').remove()",500);
			setTimeout("$('.popbox').remove()",500);
			
			
		});
	};
	
	/*拖拽*/
	var mouse={x:0,y:0};
	function moveDialog(event){
		var e = window.event || event;
		var top = parseInt($('.popbox').css('top')) + (e.clientY - mouse.y);
		var left = parseInt($('.popbox').css('left')) + (e.clientX - mouse.x);
		if(top < 1){top = 0;}/*上*/
		if(left < 1){ left = 0;}/*左*/
		bt = $(window).height() - config.height; if(top > bt){top = bt;}/*下*/
		rt = $(window).width() - config.width; if(left > rt){left = rt;}/*右*/
		$('.popbox').css({top:top,left:left});
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	};
	$('#popboxtop').mousedown(function(event){
		if(!config.drag || config.pos=='rightdown'){return;}
		var e = window.event || event;
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		$(document).bind('mousemove',moveDialog);
	});
	$(document).mouseup(function(event){
		$(document).unbind('mousemove', moveDialog);
	});
	/*结束*/
}
