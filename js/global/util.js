
/**
 * 日期转换函数
 * d.format("yyyy-MM-dd hh:mm:ss")
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function datetimepickerTimeToDate(value){
	var year1 =value.substr(0, 4);
	var month1 =value.substr(5, 2);
	var day1 =value.substr(8, 2);
	var minutes1 =value.substr(11, 2);
	var seconds1 =value.substr(14, 2);
	var d=new Date(year1, month1, day1, minutes1 , seconds1);
	return d;
}
$(document).ready(function()
	       {
			 (function ($) {

				    //扩展方法获取url参数
				    $.getUrlParam = function (name) {
				        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				        var r = window.location.search.substr(1).match(reg);
				        if (r != null) return unescape(r[2]); return null;
				    }
				})(jQuery); 
			});
