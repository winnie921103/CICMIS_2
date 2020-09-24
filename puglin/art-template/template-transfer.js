function dateFormat(date, format,pattern) {
    if (pattern) {
        date = toDate(date, pattern);
    }
    else{
        if (typeof date === "string") {
            var mts = date.match(/(\/Date\((\d+)\)\/)/);
            if (mts && mts.length >= 3) {
                date = parseInt(mts[2]);
            } else {//yyyy/MM/dd HHmm此格式
                var mst = date.match(/^((?:19|20)\d\d)\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\s(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$/);
                if (mst) {
                    var d = "";
                    if (format === 'yyyy/MM/dd') {
                        d = date.split(" ")[0];
                    } else if (format === 'HHmm') {
                        d = date.split(" ")[1];
                    } else if (format === 'HH:mm') {
                        d = date.split(" ")[1];
                        d = d.substring(0, 2) + ":" + d.substring(2, 4);
                    }
                    return d;
                }
            }
        }
        date = new Date(date);
    }
    if (!date || date.toUTCString() === "Invalid Date") {
        return "";
    }

    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "H": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };

    format = format.replace(/([yMdHmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
}
template.defaults.imports.dateFormat=dateFormat;
function toDate(date,format){
    if(!date) return date;
    var yearExec=/y{4}/.exec(format);
    var monthExec=/M{2}/.exec(format);
    var dayExec=/d{2}/.exec(format);
    var hourExec=/H{2}/.exec(format);
    var minuteExec=/m{2}/.exec(format);
    var secondExec=/s{2}/.exec(format);
    var millisecondExec=/S{3}/.exec(format);
    var year=yearExec?date.substring(yearExec.index, yearExec.index+yearExec[0].length):"1970";
    var month=monthExec?date.substring(monthExec.index, monthExec.index+monthExec[0].length):"01";
    var day=dayExec?date.substring(dayExec.index, dayExec.index+dayExec[0].length):"01";
    var hour=hourExec?date.substring(hourExec.index, hourExec.index+hourExec[0].length):"00";
    var minute=minuteExec?date.substring(minuteExec.index, minuteExec.index+minuteExec[0].length):"00";
    var second=secondExec?date.substring(secondExec.index, secondExec.index+secondExec[0].length):"00";
    var millisecond=millisecondExec?date.substring(millisecondExec.index, millisecondExec.index+millisecondExec[0].length):"000";
    date = new Date(year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second);
    date.setMilliseconds(millisecond);
    return date;
}
template.defaults.imports.toDate=toDate;
template.defaults.imports.jsonFormat =  function (json,space,pre) {
    var str = "";
    if(json){
        try{
            str = JSON.stringify(JSON.parse(json), null, space||0);
            if(pre)str = "<pre>" + str + "</pre>";
        }catch (e) {
            str = json;
        }
    }
    return str;
};
template.defaults.imports.trimAll =  function (str) {
    return str.replace(/^\s*/g,"").replace(/\s+/g, "").replace(/\s*$/g,"").replace(/(^\s*)|(\s*$)/g, "").replace(/\s/g,'');
};
template.defaults.imports.trim =  function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
};