// 轉換字串(yyyyMMdd: yyyy/MM/dd, HHmm: HHmm)為日期
function parseDate(yyyyMMdd, HHmm){
    var date = new Date;
    var dateString = yyyyMMdd.split('/');
    date.setFullYear(dateString[0], dateString[1]-1, dateString[2]);
    date.setHours(HHmm.substring(0, 2), HHmm.substring(2, 4), 0, 0);
    return date;
}