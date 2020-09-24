/**
 * tempid 当前版本
 * 检查cs-client版本
 */
eNursing.checkApkClient=function(tempid,succeCall,errorCall){
	eNursing.sendMsg("upgrade",tempid,"check","CS-Client",succeCall,errorCall);
}
/**
 * 检查cs-gateway版本
 */
eNursing.checkApkService=function(succeCall,errorCall){
	eNursing.sendMsg("upgrade","","check","CS-Gateway",succeCall,errorCall);
}


/**
 * 安装cs-client
 */
eNursing.installApkClient=function(tempid,succeCall,errorCall){
	eNursing.sendMsg("upgrade","","install","CS-Client",succeCall,errorCall);
}


/**
 * 安装cs-gateway
 */
eNursing.installApkService=function(tempid,succeCall,errorCall){
	eNursing.sendMsg("upgrade","","install","CS-Gateway",succeCall,errorCall);
}
/**
 * 产生系统日志文件
 */
eNursing.createLogFile=function(succeCall,errorCall){
	eNursing.sendMsg("logfile","","","",succeCall,errorCall);
}




