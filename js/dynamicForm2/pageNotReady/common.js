function gFormSave_183(ele, successCall, errorCall) {
    var load = $(window.parent.document.body).find('.loadingBlock')[0];
    if (load == null) { load = $(window.parent.parent.document.body).find('.loadingBlock')[0]; }
    if (load == null) { load = $(window.parent.parent.parent.document.body).find('.loadingBlock')[0]; }
    gFormJS.searchParamGF.sourceId=sourceId;
    needCheck = (gFormJS.status=="N") ? false : (gFormJS.status=="Y") ? true : true;
    var items = dynamicFormSave_getItems(ele); //取得 Items[]
    if (items) {
        if (items.rejected){
            if (errorCall){
                errorCall({"type":"rejected", "rejectedItem" : items.rejectedItem});
            }
            return items.rejectedItem;
        }
    }
    $(load).show();
    gFormSave(ele, function(result) {
        $(load).hide();
        successCall(result);
    }, errorCall);
}

/**
 *  跨團隊會議記錄 獲取表單字符串
 * @param form 表單數據
 * @param temp 表單模板
 * @returns {string}
 */
function getStrByFormAndTemp(form,temp) {
    var formStr = "";
    var str = "";
    if(form!=null && temp!=null){
        if(form.gformItemMap!=null && form.gformItemMap.EVALUATIONDATE!=null && form.gformItemMap.EVALUATIONDATE.itemValue!=null){
            formStr = "評估日期："+form.gformItemMap.EVALUATIONDATE.itemValue+"；";
        }
        var arr = ["EVALUATIONDATE"];
        if(form.gformItemMap.OTHER == null || form.gformItemMap.OTHER.itemValue == null || form.gformItemMap.OTHER.itemValue == ""){
            arr.push("OTHER");
        }
        str = getRecordStringByFormTemplate(temp,form.gformItems,arr);
    }
    if(str != null && str != ""){formStr += str;}
    if(formStr.indexOf("；")!=-1){
        formStr = formStr.substring(0, formStr.lastIndexOf('；'))+"。";
    }
    console.log("---formStr---\n"+formStr);
    return formStr;
}

/**
 *  获取表單记录字符串
 * @param dynamicFormTemplate 表单模板
 * @param items               页面数据
 * @param notInFormItems      不转子项数组（itemKey）
 * @returns {string}
 */
function getRecordStringByFormTemplate(dynamicFormTemplate,items,notInFormItems) {
    var recordString = '';
    if(dynamicFormTemplate!=null && dynamicFormTemplate.items!=null && dynamicFormTemplate.items.length>0 && items!=null && items.length>0){
        var formItems = dynamicFormTemplate.items;
        notInFormItems = addFormItemsByFormTemplate(notInFormItems,formItems,items);
        for(var s=0;s<items.length;s++){
            var item = items[s];
            if(checkFormItems(notInFormItems,item)){
                for(var i=0;i<formItems.length;i++){
                    var formItem = formItems[i];
                    var otherFormItems = [];
                    if(formItem.horizontalFormItem!=null){
                        otherFormItems = formItem.horizontalFormItem.split("|,|");
                    }else if(formItem.verticalFormItem!=null){
                        otherFormItems = formItem.verticalFormItem.split("|,|");
                    }
                    notInFormItems = addFormItems(notInFormItems,otherFormItems);
                    if(formItem.name == item.itemKey){
                        var text = '';
                        if(formItem.controlType == 'text' || formItem.controlType == 'datetime' || formItem.controlType == 'textarea'){
                            text = formItem.title + '：' + item.itemValue;
                        }else{
                            var vals = item.itemValue.split(",");
                            if(formItem.uiValue!=null && formItem.uiValue.length>0 && vals!=null && vals.length>0){
                                for(var a=0;a<vals.length;a++){
                                    for(var z=0;z<formItem.uiValue.length;z++){
                                        if(formItem.uiValue[z] == vals[a]){
                                            if(text == ''){
                                                text = formItem.title + '：' + formItem.uiDesc[z];
                                            }else{
                                                text += '，'+ formItem.uiDesc[z];
                                            }
                                            if(formItem.hasOther[z]){
                                                var otherInput = $("#"+formItem.name+"_"+z+"_otherText");
                                                if(otherInput!=null && otherInput.length>0){
                                                    text += '：'+otherInput[0].value;
                                                }
                                            }
                                            if(otherFormItems!=null && otherFormItems.length>0 && otherFormItems.length>z){
                                                var otherFormItem = getOtherFormItem(formItems,otherFormItems[z]);
                                                var otherItem = getOtherItem(items,otherFormItems[z]);

                                                if(otherFormItem!=null && otherItem!=null){
                                                    var othOtherFormItems = [];
                                                    if(otherFormItem.horizontalFormItem!=null){
                                                        othOtherFormItems = otherFormItem.horizontalFormItem.split("|,|");
                                                    }else if(otherFormItem.verticalFormItem!=null){
                                                        othOtherFormItems = otherFormItem.verticalFormItem.split("|,|");
                                                    }
                                                    notInFormItems = addFormItems(notInFormItems,othOtherFormItems);
                                                    var otherText = '';
                                                    if(otherFormItem.controlType == 'text' || otherFormItem.controlType == 'datetime'){
                                                        otherText = otherFormItem.title + '：' + otherItem.itemValue;
                                                    }else{
                                                        var otherVals = otherItem.itemValue.split(",");
                                                        if(otherFormItem.uiValue!=null && otherFormItem.uiValue.length>0 && otherVals!=null && otherVals.length>0){
                                                            for(var b=0;b<otherVals.length;b++){
                                                                for(var c=0;c<otherFormItem.uiValue.length;c++){
                                                                    if(otherFormItem.uiValue[c] == otherVals[b]){
                                                                        if(otherText == ''){
                                                                            otherText = otherFormItem.title + '：' + otherFormItem.uiDesc[c];
                                                                        }else{
                                                                            otherText += '，'+ otherFormItem.uiDesc[c];
                                                                        }
                                                                        if(otherFormItem.hasOther[c]){
                                                                            var otherInput = $("#"+otherFormItem.name+"_"+c+"_otherText");
                                                                            if(otherInput!=null && otherInput.length>0){
                                                                                otherText += '：'+otherInput[0].value;
                                                                            }
                                                                        }

                                                                        if(othOtherFormItems!=null && othOtherFormItems.length>0 && othOtherFormItems.length>c){
                                                                            var othOtherFormItem = getOtherFormItem(formItems,othOtherFormItems[c]);
                                                                            var othOtherItem = getOtherItem(items,othOtherFormItems[c]);

                                                                            if(othOtherFormItem!=null && othOtherItem!=null){
                                                                                var othOtherText = '';
                                                                                if(othOtherFormItem.controlType == 'text' || othOtherFormItem.controlType == 'datetime'){
                                                                                    othOtherText = othOtherFormItem.title + '：' + othOtherItem.itemValue;
                                                                                }else{
                                                                                    var othOtherVals = othOtherItem.itemValue.split(",");
                                                                                    if(othOtherFormItem.uiValue!=null && othOtherFormItem.uiValue.length>0 && othOtherVals!=null && othOtherVals.length>0){
                                                                                        for(var f=0;f<othOtherVals.length;f++){
                                                                                            for(var e=0;e<othOtherFormItem.uiValue.length;e++){
                                                                                                if(othOtherFormItem.uiValue[e] == othOtherVals[f]){
                                                                                                    if(othOtherText == ''){
                                                                                                        othOtherText = othOtherFormItem.title + '：' + othOtherFormItem.uiDesc[e];
                                                                                                    }else{
                                                                                                        othOtherText += '，'+ othOtherFormItem.uiDesc[e];
                                                                                                    }
                                                                                                    if(othOtherFormItem.hasOther[e]){
                                                                                                        var otherInput = $("#"+othOtherFormItem.name+"_"+e+"_otherText");
                                                                                                        if(otherInput!=null && otherInput.length>0){
                                                                                                            othOtherText += '：'+otherInput[0].value;
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                                if(othOtherText !=null && othOtherText!=''){
                                                                                    if(otherText != ''){otherText += '，';}
                                                                                    otherText += othOtherText;
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if(otherText !=null && otherText!=''){
                                                        if(text != ''){text += '，';}
                                                        text += otherText;
                                                    }
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if(text !=null && text!=''){
                            recordString += '\n'+text+"；"; //&#10;
                        }
                        break;
                    }
                }
            }
        }
    }
    return recordString;
}

function addFormItemsByFormTemplate(notInFormItems,formItems,items) {
    if(formItems!=null && formItems.length>0 && items!=null && items.length>0){
        for(var s=0;s<formItems.length;s++){
            if(formItems[s].recordItems!=null && formItems[s].recordItems!=''){
                var falg = false;
                for(var i=0;i<items.length;i++){
                    if(items[i].itemKey == formItems[s].name){
                        falg = true;break;
                    }
                }
                //转记录选框未勾选
                if(!falg){
                    notInFormItems = addFormItems(notInFormItems,formItems[s].recordItems.split(","));
                }
            }
        }
    }
    return notInFormItems;
}

function checkFormItems(notInFormItems,item) {
    var falg = true;
    if(item!=null && item.itemValue != null && item.itemValue != ''){
        if(notInFormItems!=null && notInFormItems.length>0){
            for(var s=0;s<notInFormItems.length;s++){
                if(notInFormItems[s] == item.itemKey){
                    falg = false;break;
                }
                if(falg){
                    if(item.itemKey.indexOf("isRecord")>-1){
                        falg = false;break;
                    }
                }
            }
        }
    }else{
        falg = false;
    }
    return falg;
}

function addFormItems(notInFormItems,otherFormItems) {
    if(otherFormItems!=null && otherFormItems.length>0){
        for(var s=0;s<otherFormItems.length;s++){
            notInFormItems.push(otherFormItems[s]);
        }
    }
    return notInFormItems;
}

function getOtherFormItem(formItems,itemKey) {
    var otherFormItem = null;
    if(itemKey!=null && itemKey!='' && formItems!=null && formItems.length>0){
        for(var s=0;s<formItems.length;s++){
            if(formItems[s].name == itemKey){
                otherFormItem = formItems[s];break;
            }
        }
    }
    return otherFormItem;
}

function getOtherItem(items,itemKey) {
    var otherItem = null;
    if(itemKey!=null && itemKey!='' && items!=null && items.length>0){
        for(var s=0;s<items.length;s++){
            if(items[s].itemKey == itemKey){
                otherItem = items[s];break;
            }
        }
    }
    return otherItem;
}

function processNormal(tar) {
    var $tar = $(tar);
    var desc = $tar.next("label").text();
    if (desc === '正常' || desc === '無異狀') {
        if (tar.checked) {
            $("input[name='" + tar.name + "'][value!='"+tar.value+"']",$tar.parent()).prop("disabled", true).prop("checked", false);
        }else{
            $("input[name='" + tar.name + "']",$tar.parent()).prop("disabled", false);
        }
    }
}