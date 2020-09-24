	//確認查詢起迄時間
	//輸入起始時間、日期及結束日期、時間
	//假如起始時間、日期大於結束日期、時間，回傳false
	//反之，回傳true
	function check_startdate_enddate(date1,time1,date2,time2){
	
		var d1_hour = parseInt(time1.substring(0,2),10);
		var d1_min = parseInt(time1.substring(2,4),10);
		
		var startday = new Date(date1);
		startday.setHours(d1_hour);
		startday.setMinutes(d1_min);
		
		var d2_hour = parseInt(time2.substring(0,2),10);
		var d2_min = parseInt(time2.substring(2,4),10);
		var endday = new Date(date2);
		endday.setHours(d2_hour);
		endday.setMinutes(d2_min);
		
		if((startday.getTime()-endday.getTime())>0){
			return false;	
		}else{
			return true;
		}
	}
