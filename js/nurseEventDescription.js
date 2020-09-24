/*
取得 Nurse Event 各種對照說明
function getTypeName(selVal)         取得 大分類項目說明
function getSubTypeName(selVal)      取得 子項目說明 EVENT_TYPE
function getBP_PoseName(selVal)      取得 血壓 POSE 說明
function getBP_RegionName(selVal)    取得 血壓 REGION 說明
function getINPUT_RegionName(selVal) 取得 輸出量 REGION 說明
function getSpTreatName(selVal)      取得 特殊治療說明(SPECIAL_TREATMENT)
function getStoolName(selVal)        取得 排便性狀說明
*/

// 取得 大分類項目說明
function getTypeName(selVal)
{
	var v=""
	if (selVal=="BT") v="體溫"
	if (selVal=="PULSE") v="脈搏"
	if (selVal=="RESPIRATORY") v="呼吸"
	if (selVal=="BP") v="血壓"
	if (selVal=="STOOL") v="排便"
	if (selVal=="URINATION") v="排尿"
	return v
}

// 取得子項目說明 EVENT_TYPE
function getSubTypeName(selVal)
{
	var v=""
	// Vital Sign
	if (selVal=="EAR") v="耳溫"
	if (selVal=="ORAL") v="口溫"
	if (selVal=="AXILLARY") v="腋溫"
	if (selVal=="RECTAL") v="肛溫"
	if (selVal=="PULSE") v="脈搏"
	if (selVal=="HEART.BEAT") v="心尖脈"
	if (selVal=="CONSTIPATION") v="便祕"
	if (selVal=="DIARRHOEA") v="腹瀉"
	if (selVal=="STOOL.NORMAL") v="自解"
	if (selVal=="STOOL.COLOSTOMY") v="人工肛門"
    if (selVal=="STOOL.ENEMA") v="灌腸"
	if (selVal=="STOOL.DULCOLAX") v="塞劑"
	if (selVal=="STOOL.DIGITAL") v="指挖"
	if (selVal=="SOILING") v="滲便"
	if (selVal=="NBP") v="NBP"
	if (selVal=="ABP") v="ABP"
	// INPUT
	if (selVal=="INPUT.DRANK.SOLID")  v="飲食量_固體類　"
	if (selVal=="INPUT.DRANK.FLUID")  v="飲食量_液體(藥)"
	if (selVal=="INPUT.DRANK.LIQUID")  v="飲食量_液體"
	if (selVal=="INPUT.INJECT.LVP")   v="注射量_靜脈輸液"
	if (selVal=="INPUT.BLOOD")        v="注射量_輸血量　"
	if (selVal=="INPUT.CAPD.INPUT") v="CAPD輸入量　　"
	if (selVal=="INPUT.LAVAGE")       v="灌洗入量　　　"
	// OUTPUT	
	if (selVal=="OUTPUT.URINE.SELF")          v="尿量_自解量"
	if (selVal=="OUTPUT.URINE.CATHETER")      v="尿量_導尿量"
	if (selVal=="OUTPUT.URINE.URECCHYSIS")           v="尿量_滲尿量"
	if (selVal=="OUTPUT.VOMIT")               v="嘔吐量　　 "
	if (selVal=="OUTPUT.DRAINAGE")		      v="引流量"
	if (selVal=="OUTPUT.DRAINAGE.CHEST")      v="引流量_胸管"
	if (selVal=="OUTPUT.DRAINAGE.WOUND")      v="引流量_傷口"
	if (selVal=="OUTPUT.DRAINAGE.ABDOMINAL")  v="引流量_腹部"
	if (selVal=="OUTPUT.BLOOD.LOSE")          v="失血量　　 "
	if (selVal=="OUTPUT.LAVAGE")              v="灌洗出量　"
	if (selVal=="OUTPUT.CAPD.OUTPUT")         v="CAPD輸出量 "
	if (selVal=="OUTPUT.REGULAR")             v="排便量 "
	if (selVal=="OUTPUT.OTHER")             v="其他 "
	if (selVal=="OUTPUT.ENTERIC.OSTOMY")      v="腸造口 "	
	if (selVal=="OUTPUT.OTHER.OSTOMY")      v="其它造口"	
	if (selVal=="OUTPUT.DRAINAGE.TAPPING")      v="放液量 "	
	
	return v
}

// 取得 血壓POSE 說明
function getBP_PoseName(selVal)
{
	var v=""
	if (selVal==1) v="躺"
	if (selVal==2) v="坐"
	if (selVal==3) v="立"
	return v
}

// 取得 血壓 REGION 說明
function getBP_RegionName(selVal)
{
	var v=""
	if (selVal==1) v="左手"
	if (selVal==2) v="右手"
	if (selVal==3) v="左腳"
	if (selVal==4) v="右腳"
	return v
}

// 取得輸出量 REGION 說明
function getINPUT_RegionName(selVal)
{
	var v=""
	if (selVal==1) v="上"
	if (selVal==2) v="下"
	if (selVal==3) v="左"
	if (selVal==4) v="右"
	if (selVal==5) v="中間"
	if (selVal==6) v="左上"
	if (selVal==7) v="右上"
	if (selVal==8) v="左下"
	if (selVal==9) v="右下"
	return v
}

// 取得特殊治療說明(SPECIAL_TREATMENT)
function getSpTreatName(selVal)
{
	var v=""
	if (selVal==0) v="無特殊治療"
	if (selVal==1) v="cath"
	if (selVal==2) v="胃鏡"
	if (selVal==3) v="減痛分娩"
	if (selVal==4) v="Bronchoscopy"
	if (selVal==5) v="OP"
	if (selVal==6) v="Liver biopsy"
	if (selVal==7) v="ECT"
	if (selVal==8) v="H/D"	
	if (selVal==9) v="Renal Biopsy"
	if (selVal==10) v="CT guide biopsy"
	if (selVal==11) v="TAE"
	if (selVal==12) v="Angiography"
	if (selVal==99) v="其他"			
	return v
}

// 取得排便性狀說明
//function getStoolName(selVal)
//{
//	var v=""
//	if (selVal==1) v="硬便"
//	if (selVal==2) v="糞石"
//	if (selVal==3) v="水便"
//	if (selVal==4) v="糊便"
//	if (selVal==5) v="黏液便"
//	if (selVal==6) v="血便"
//	if (selVal==7) v="柏油便"
//	if (selVal==8) v="惡臭便"
//	if (selVal==9) v="鬆散、不成形便"
//	if (selVal==10) v="顆粒便"
//	if (selVal==11) v="條狀便"
//	if (selVal==12) v="鬆散成形便"
//	if (selVal==13) v="泥稀便"
//	if (selVal==14) v="水、液狀便"
//	if (selVal==15) v="未解便"
//	if (selVal==16) v="Colostomy"
//	if (selVal==17) v="Ileostomy"
//	if (selVal==18) v="條狀成形"
//	if (selVal==19) v="軟便"
//	return v
//}

// 取得 疼痛部位1 說明
function getPAIN_RegionName(selVal)
{
	var v=""
	if (selVal==1) v="左"
	if (selVal==2) v="右"
	return v
}

// 取得 疼痛部位2 說明
function getPAIN_PoseName(selVal)
{
	var v=""
	if (selVal==1) v="上"
	if (selVal==2) v="下"
	return v
}

function get_Reason_Name(selVal){
	var v=""
	if (selVal=='1') v="測不到";
	if (selVal=='2') v="送手術";
	if (selVal=='3') v="送檢查";
	if (selVal=='4') v="送治療";
	if (selVal=='5') v="入睡中";
	if (selVal=='6') v="拒絕";
	if (selVal=='7') v="請假";
	if (selVal=='8') v="送會診";
	if (selVal=='9') v="哭鬧";
	if (selVal=='99') v="其他";	
	return v;
}
