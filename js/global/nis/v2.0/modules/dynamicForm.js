!function () {
    eNursing.Nursing.extend = function (){
        var target=eNursing.extend({},arguments[0]);
        for (var i=1, len=arguments.length; i<len; i++){
            target=eNursing.extend(target, arguments[i]);
        }
        return target;
    };
    eNursing.Nursing.leftJoin = function (){
        var target = {};
        for (var i=0, len=arguments.length; i<len; i++){
            target=arguments[i];
            if (eNursing.isObject(target)) {
                for (key in this) {
                    if (target.hasOwnProperty(key)){
                        if (!eNursing.isObject(target[key])||(eNursing.isObject(target[key])&&eNursing.getModules()[key.replace(/^\S/,function(s){return s.toUpperCase();})]))
                            this[key]=target[key];
                    }
                }
            }
        }
    };
    eNursing.Nursing.clearObj = function(){
        this.leftJoin(new eNursing.getModules()[this.nodeId]());
    };

    eNursing.Nursing.commonCRUD = function (process, argument, node, action, successCall, errorCall, completeCall, rewrite) {
        eNursing.info("process: "+process);
        eNursing.info("argument: "+argument);
        var arg = this.extend(argument);
        for (i in arg){
            clearJson(arg[i]);
        }
        function clearJson(obj){
            for (key in obj){
                if (key=="add"){
                    obj[key]="clear by commonCRUD.clearJson ...";
                }else if(eNursing.isFunction(obj[key])){
                    delete obj[key];
                }else if (eNursing.isObject(obj[key])){
                    clearJson(obj[key]);
                }
            }
        }
        eNursing.info(JSON.stringify(arg));
        eNursing.info("node: "+node);
        eNursing.info("action: "+action);

        var param = {
            node: node,
            action: action
        };
        eNursing.sendMsg(process, argument, param, "", function (_data) {
            var result=_data;
            if (!eNursing.isObject(_data))
                result=JSON.parse(_data);
            if (result.resultMsg.success) {
                eNursing.info("success: "+JSON.stringify(result));
                if(eNursing.isFunction(successCall))
                    successCall(result);
            } else {
                eNursing.error("commonCRUD: "+JSON.stringify(result));
                if(eNursing.isFunction(errorCall))
                    errorCall(result);
            }
            if(eNursing.isFunction(completeCall))
                completeCall();

        }, function (error) {
            eNursing.error("commonCRUD: "+error);
            if(eNursing.isFunction(errorCall))
                errorCall(error);
        },action, rewrite);
    };
    /** @function nursing.createDynamicForm*/
    /** @function nursing.getDynamicForm*/
    function DynamicForm() {
        this.nodeId = eNursing.getFnName(DynamicForm);
        this.parentConstructor = eNursing.getModules("Patient");
        //SearchParamDF 查询条件
        this.searchParamDF = new SearchParamDF();
        //String 主健
        this.formId = null;
        //String 表單模板ID
        this.formVersionId = null;
        //String 表单类型
        this.formType = null;
        //String 表单模版
        this.formModel = null;
        //String 版本號
        this.versionNo = null;
        //String 护理站
        this.stationId = null;
        //String 总分
        this.totalScore = null;
        //Date 评估时间
        this.evaluationTime = null;
        //Date 创建时间
        this.createTime = null;
        //String 床号
        this.bedId = null;
        //String 创建者ID
        this.createUserId = null;
        //String 创建者名字
        this.createUserName = null;
        // ArrayList<DynamicFormItem> 评估项
        this.items = [];
        //HashMap<String(itemKey), DynamicFormItem> 评估项
        this.formItems = {};
        //String 護理紀錄主鍵
        this.recordPoid = null;
        //String 動態表單XML模板
        this.content = null;
        //String 所有用到的itemKey
        this.itemstring = null;
        //String 签名接收人
        this.receiveUserId = null;
        //String 签名接收姓名
        this.receiveUserName = null;
        //Date 签名接收时间
        this.receiveTime = null;
        //String 内关联主健
        this.ofFormId = null;
        //String 镇静评估表CALM的主键id
        this.calmId = null;
        //String 护理事件id
        this.eventIds = null;
        //String 簽章ID
        this.signatureId = null;
        //String 簽章名稱
        this.signatureName = null;
        //Date 簽章時間
        this.signatureDate = null;
        //String 啟用狀態
        this.states = "Y";




        //轉換dataset和template物件的大小寫和型態
        this.datasetType={
            title             : { value:"title",             type:"string" },
            showtitle         : { value:"showTitle",         type:"boolean" },
            printshowtitle    : { value:"printShowTitle",    type:"boolean" },
            controltype       : { value:"controlType",       type:"string" },
            controlmode       : { value:"controlMode",       type:"string" },
            width             : { value:"width",             type:"string" },
            defaultvalue      : { value:"defaultValue",      type:"string" },
            backtitle         : { value:"backTitle",         type:"string" },
            typeformat        : { value:"typeFormat",        type:"string" },
            minlimit          : { value:"minLimit",          type:"string" },
            maxlimit          : { value:"maxLimit",          type:"string" },
            uidesc            : { value:"uiDesc",            type:"array[string]" },
            uiscore           : { value:"uiScore",           type:"array[float]" },
            uidescsimple      : { value:"uiDescSimple",      type:"array[string]" },
            uivalue           : { value:"uiValue",           type:"array[string]" },
            show              : { value:"show",              type:"boolean" },
            required          : { value:"required",          type:"boolean" },
            prompttips        : { value:"promptTips",        type:"string" },
            textsize          : { value:"textSize",          type:"integer" },
            maxlength         : { value:"maxlength",         type:"integer" },
            placeholder       : { value:"placeholder",       type:"string" },
            placeholderdate   : { value:"placeholderDate",   type:"string" },
            placeholdertime   : { value:"placeholderTime",   type:"string" },
            totalscoretype    : { value:"totalScoreType",    type:"string" },
            maxtotalscore     : { value:"maxTotalScore",     type:"float" },
            maxitemtotalscore : { value:"maxItemTotalScore", type:"float" },
            displaymode       : { value:"displayMode",       type:"string" },
            hasother          : { value:"hasOther",          type:"array[boolean]" },
            othertitle        : { value:"otherTitle",        type:"array[string]" },
            otherbackTitle    : { value:"otherBackTitle",    type:"array[string]" },
            otherwidth        : { value:"otherWidth",        type:"array[string]" },
            name              : { value:"name",              type:"string" },
            upload            : { value:"upload",            type:"string" },
            checked           : { value:"checked",           type:"array[boolean]"},
            toomoretext       : { value:"tooMoreText",            type:"integer" }, //字數過長時，縮短顯示
            uivalueitem      : { value:"uiValueItem",        type:"array[string]"}, //指定單選複選要顯示哪一個uiDesc
            uidescitem       : { value:"uiDescItem",         type:"array[string]"},  //指定單選複選要顯示哪一個uiValue
            //fns
            dateformat           : { value:"dateFormat",     type:"string"},
            timeformat           : { value:"dateFormat",     type:"string"}
        };

        this.datasetChange = function (key, value){
            var datasetType = this.datasetType[key];
            if (datasetType == undefined){
                return {key: key, value: value};
            }else{
                if (datasetType.type=="string"){
                    value = value.toString();
                }else if (datasetType.type=="boolean"){
                    value = (value==true||value=="true");
                }else if (datasetType.type=="integer"){
                    value = parseInt(value);
                }else if (datasetType.type=="float"){
                    value = parseFloat(value);
                }else if (datasetType.type=="array[string]"){
                    value = value.split(",");
                    for(var i=0; i<value.length; i++){
                        value[i]= value[i].toString();
                    }
                }else if (datasetType.type=="array[boolean]"){
                    value = value.split(",");
                    for(var i=0; i<value.length; i++){
                        value[i]= (value[i]==true||value[i]=="true");
                    }
                }else if (datasetType.type=="array[float]"){
                    value = value.split(",");
                    for(var i=0; i<value.length; i++){
                        value[i]= parseFloat(value[i]);
                    }
                }
                return {key: datasetType.value, value: value};
            }
        };

        // <div class="pFormItem" fns-XXX="xxx">
        // 執行元件的fns方法後返回itemValue
        this.doFns = function(ele, itemValue){
            var fns = this.getFns(ele);
            for ( var i=0, len=fns.length; i<len; ++i){
                var fnsName = (this.datasetType[fns[i].fnsName]) ? this.datasetType[fns[i].fnsName].value : fns[i].fnsName;
                itemValue = this.fns[fnsName](itemValue, fns[i].arguments);
            }
            return itemValue;
        };

        // <div class="pFormItem" fns-XXX="xxx">
        // 取得元件的fns
        this.getFns = function(ele){
            var fns = [];
            var attrs = ele.attributes,//元素的属性集合
                name,
                matchStr,
                hasSort = false;

            for(var i = 0;i<attrs.length;i++){
                //是否是fns- 开头 (ex. fns-xxx or fns-xxx-123)
                matchStr = attrs[i].name.match(/^fns-([a-z|A-Z|0-9]+)-?(.+)?/);;
                if(matchStr){
                    //fns-auto-play 转成驼峰写法 autoPlay
                    name = matchStr[1].replace(/-([\da-z])/gi,function(all,letter){
                        return letter.toLowerCase();
                    });
                    matchStr[2] = parseFloat(matchStr[2]);
                    if (!hasSort && !isNaN(matchStr[2])){
                        hasSort = true;
                    }
                    fns.push({fnsName: name, arguments: attrs[i].value, sort: matchStr[2]});
                }
            }
            //排序
            if (fns.length>0 && hasSort){
                fns.sortJson({key:'sort',orderby:'asc'});
            }
            return fns;
        };

        this.fns={};
        //arg = (regexp/substr,replacement)
        this.fns.replace = function(v, arg){
            var args=arg.split(","), regexp=eval(args[0]), replacement=eval(args[1]);
            return v.replace(regexp, replacement);
        };
        //arg = (start,length)
        this.fns.substr = function(v, arg){
            var args=arg.split(","), start=parseInt(args[0]), length=parseInt(args[1]);
            return (v && v!="") ? v.substr(start, length) : "";
        };
        //添加後方文字
        //arg = (text)
        this.fns.backTitle = function(v, arg){
            return v+arg;
        };
        //arg = (format, type[string(default), timestamp(int)])
        //type = string(ex1. 2019/10/17, ex2. 2019-10-17) / timestamp(ex1. 1280977330748)
        this.fns.dateFormat = function(v, arg){
            var args=arg.split(","), format=eval(args[0]), type=(args.length==1) ? "string" : eval(args[1]);
            // timestamp的話，要先把v轉為int
            v = (type=="timestamp") ? (typeof(v)=="string" && v!="") ? parseInt(v) : v : v;
            // string的話，要先把v的"-"轉為"/"，因為IE只認斜線，且毫秒的"."最好拿掉
            v = (typeof(v)=="string") ? v.replace(/\-/g, "/").split(".")[0] : v;

            return new Date(v).format(format);
        };

        //將items(arr)轉為FormItems(json)
        this.setFormItems = function (dForm){
            var items = dForm.items;
            var formItems = {};
            for (i2=0, len2=items.length; i2<len2; i2++){
                formItems[items[i2].itemKey]={
                    "itemValue" : items[i2].itemValue,
                    "otherValue" : items[i2].otherValue
                };
            }
            dForm.formItems=formItems;
            return dForm;
        };

        //依據病歷號、formType 取得所有動態表單
        this.getDynamicFormByEncIdV3 = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: dynamicFormParam.getNode(),
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.encounterId=dynamicFormParam.parent.caseno;
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.hasContent=dynamicFormParam.searchParamDF.hasContent;

            eNursing.sendMsg("dynamicFormService.getDynamicFormByEncIdV3", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var dForms = result.data;
                    if (window.console) console.log(dForms);
                    successCall(dForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }

            }, errorCall);
        };

        //依據病歷號、formType 取得最後一筆動態表單
        this.getLastDynamicFormByEncIdV3 = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: dynamicFormParam.getNode(),
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.encounterId=dynamicFormParam.parent.caseno;
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.hasContent=dynamicFormParam.searchParamDF.hasContent;

            eNursing.sendMsg("dynamicFormService.getLastDynamicFormByEncIdV3", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var dForms = result.data;
                    if (window.console) console.log(dForms);
                    successCall(dForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }

            }, errorCall);
        };

        //新增或修改動態表單
        this.addOrUpdateDynamicForm = function (dynamicFormParam, successCall, errorCall) {
            dynamicFormParam.formItems={};
            var param = {
                /**不同数据*/
                node: dynamicFormParam.getNode(),
                /**动作*/
                action: "add"
            };

            eNursing.sendMsg("dynamicFormService.addOrUpdateDynamicForm", [{"dynamicForm":dynamicFormParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    var dForms = result.data;
                    if (window.console) console.log(dForms);
                    if(dForms){
                        for (i=0, len=dForms.length; i<len; i++){
                            var dForm = dForms[i].dynamicForm;
                            var items = dForm.items;
                            var formItems = {};
                            for (i2=0, len2=items.length; i2<len2; i2++){
                                formItems[items[i2].itemKey]={
                                    "itemValue" : items[i2].itemValue,
                                    "otherValue" : items[i2].otherValue
                                };
                            }
                            dForm.formItems=formItems;
                        }
                        if (window.console) console.log(dForms);
                    }
                    successCall(dForms);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }

            }, errorCall);
        };


        //刪除動態表單
        this.deleteDynamicForm = function (dynamicFormParam, successCall, errorCall) {
            if (confirm("确定要删除吗?")){
                var param = {
                    /**不同数据*/
                    node: dynamicFormParam.getNode(),
                    /**动作*/
                    action: "delete"
                };

                eNursing.sendMsg("dynamicFormService.deleteDynamicForm", [{"dynamicForm":dynamicFormParam}], param, "", function (result) {
                    if (result.resultMsg.success) {
                        successCall();
                    } else {
                        eNursing.F2ReportErrorMsg(result.resultMsg);
                    }
                }, errorCall);
            }
        };

        /**
         *  callBackendApi
         *  呼叫後台 api function 或 其餘動態表單
         *
         *  @param dynamicForm      formVersion物件
         *  @param apisObjectArray  Apis物件陣列
         *  @param gformObject
         *  @param async            同步true / 非同步false (非同步=等待api完成才設定api要ditto的值)
         *  @param successCall      回調函數(成功)
         *  @param errorCall        回調函數(失敗)
         */
        this.callBackendApi = function (dynamicForm, apisObjectArray, gformObject, async, successCall, errorCall) {
            var dy = this;
            if (gformObject === null) {
                gformObject = {};
            }
            // 遍歷 Apis 物件陣列
            for (var i = 0, len = apisObjectArray.length; i < len; ++i) {
                // 判斷是否需要 ditto (預先帶入值)
                if (apisObjectArray[i].act === 'ditto') {
                    // 回調變數
                    // if (apiRecall !== undefined) {
                    //     ++apiRecall;
                    // }
                    // 判斷是否為呼叫動態表單 (判斷方式為動態表單參數) (可再調整)
                    if (apisObjectArray[i].paramsDynamicForm.length > 0) {
                        // 遍歷動態表單參數
                        for (var j = 0, len2 = apisObjectArray[i].paramsDynamicForm.length; j < len2; j++) {
                            // 取得各參數物件
                            var formParams = apisObjectArray[i].paramsDynamicForm[j];
                            // 判斷參數來源，詳細待補充
                            if (formParams.source === 'form') {

                            } else if (formParams.source === 'formItem') {

                            } else if (formParams.source === 'patBasic') {
                                gFormJS.searchParamGF[formParams.key] = GlobalClasses.patInfo["get" + formParams.value]();
                            } else if (formParams.source === 'fixed') {
                                gFormJS.searchParamGF[formParams.key] = formParams.value;
                            } else if (formParams.source === 'dateFamily') {
                                var d = new Date();
                                gFormJS.searchParamGF[formParams.key] = d.setDefaultDate(formParams.value);
                            } else if (formParams.source === 'customize') {
                                gFormJS.searchParamGF[formParams.key] = formParams.value;
                            }
                        }
                        // 判斷必填項目是否填入
                        var keyArray = Object.keys(gFormJS.searchParamGF);
                        if (keyArray.indexOf("formType") === -1 || (keyArray.indexOf("sourceId") === -1 && keyArray.indexOf("sourceIds") === -1)) {
                            // 未填入則回傳錯誤訊息並清空查詢條件
                            var errorMsg = {"success": false, "errorMsg": "呼叫動態表單必須包含formType 與 sourceId"};
                            gFormJS.searchParamGF = {};
                            errorCall(errorMsg);
                            return;
                        }
                        // 呼叫依條件查詢動態表單 function ，詳見 gForm.js => getGFormListWithCondition()
                        gFormJS.getGFormListWithCondition(gFormJS,
                            function(result) {
                                console.log(result);
                                // 判斷取得結果是否存在
                                if (result.length > 0) {
                                    // 取得 Apis ditto 節點
                                    var hashItems = Object.keys(dynamicForm.hashItems);
                                    var dittos = apisObjectArray[i].dittos;
                                    for (var j = 0, len3 = dittos.length; j < len3; j++) {
                                        if (hashItems.indexOf(dittos[j].beanName) > -1) {
                                            if (dynamicForm.hashItems[hashItems[hashItems.indexOf(dittos[j].beanName)]].objAttr !== undefined)
                                                dittos[j].value = dynamicForm.hashItems[hashItems[hashItems.indexOf(dittos[j].beanName)]].objAttr;
                                        }
                                    }
                                    // 呼叫 function 設定仿 gForm 物件
                                    dy.settingAllBean(gformObject, result[0].gForm, dittos);
                                    // 判斷前台 api 物件是否宣告
                                    if (apiObj !== undefined) {
                                        // 使用 gForm.js => setGFormItems 將 gformItemMap設定至 gformItems
                                        // 並將前台 api 物件賦值
                                        gFormJS.setGFormItems(gformObject);
                                        apiObj.apiResults.push(result);
                                        apiObj.localTime            = new Date();
                                        apiObj.dittoGformItems      = gformObject.gformItem;
                                        apiObj.dittoGformItemMap    = gformObject.gformItemMap;
                                    }
                                    var apiObj_new = {localTime:"", apiResults: [], dittoGformItems:[], dittoGformItemMap:{}};
                                    apiObj_new.apiResults.push(result);
                                    apiObj_new.localTime            = new Date();
                                    apiObj_new.dittoGformItems      = gformObject.gformItem;
                                    apiObj_new.dittoGformItemMap    = gformObject.gformItemMap;
                                    successCall(async, apiObj_new);
                                } else {
                                    // 若不存在則回傳錯誤訊息並清空查詢條件
                                    var errorMsg = {"success": false, "errorMsg": "根據條件查無表單"};
                                    gFormJS.searchParamGF = {};
                                    errorCall(errorMsg);
                                    return;
                                }
                            },
                            function(error) {
                                errorCall(error);
                            }
                        );
                    } else {
                        // 宣告傳參物件
                        var dataObject  = {};
                        var hashItems   = Object.keys(dynamicForm.hashItems);
                        var dittos      = apisObjectArray[i].dittos;
                        for (var j = 0, len3 = dittos.length; j < len3; j++) {
                            if (hashItems.indexOf(dittos[j].beanName) > -1) {
                                if (dynamicForm.hashItems[hashItems[hashItems.indexOf(dittos[j].beanName)]].objAttr !== undefined){
                                    dittos[j].value = dynamicForm.hashItems[hashItems[hashItems.indexOf(dittos[j].beanName)]].objAttr;
                                }

                            }
                        }
                        // 判斷傳參陣列是否存在
                        if (apisObjectArray[i].params.length > 0) {
                            // 遍歷傳參陣列
                            for (var j = 0, len2 = apisObjectArray[i].params.length; j < len2; j++) {
                                // 取得各參數物件
                                var params = apisObjectArray[i].params[j];
                                // 判斷參數來源，詳細待補充
                                if (params.source === 'form') {

                                } else if (params.source === 'formItem') {

                                } else if (params.source === 'patBasic') {
                                    dataObject[params.key] = GlobalClasses.patInfo["get" + formParams.value]();
                                } else if (params.source === 'fixed') {
                                    dataObject[params.key] = eval(params.value);
                                } else if (params.source === 'dateFamily') {
                                    var d = new Date();
                                    dataObject[params.key] = d.setDefaultDate(params.value);
                                } else if (params.source === 'customize') {
                                    dataObject[params.key] = params.value;
                                }
                            }
                        }
                        // ajax call Api
                        $.ajax({
                            url: apisObjectArray[i].url,
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(dataObject),
                            async: true,
                            type: "post",
                            success: function(result) {
                                console.log(result);
                                // 解析 string result to json
                                if(typeof result === "string")
                                    var json = JSON.parse(result);
                                else
                                    var json = result;
                                console.log(json);
                                // 呼叫 function 設定仿 gForm 物件
                                dy.settingAllBean(gformObject, json, dittos);
                                // 判斷前台 api 物件是否宣告
                                if (apiObj !== undefined) {
                                    // 使用 gForm.js => setGFormItems 將 gformItemMap設定至 gformItems
                                    // 並將前台 api 物件賦值
                                    gFormJS.setGFormItems(gformObject);
                                    apiObj.apiResults.push(result);
                                    apiObj.localTime            = new Date();
                                    apiObj.dittoGformItems      = gformObject.gformItem;
                                    apiObj.dittoGformItemMap    = gformObject.gformItemMap;
                                }
                                var apiObj_new = {localTime:"", apiResults: [], dittoGformItems:[], dittoGformItemMap:{}};
                                apiObj_new.apiResults.push(result);
                                apiObj_new.localTime            = new Date();
                                apiObj_new.dittoGformItems      = gformObject.gformItem;
                                apiObj_new.dittoGformItemMap    = gformObject.gformItemMap;
                                successCall(async,apiObj_new);
                            },
                            error: function(error) {
                                errorCall(error);
                            }
                        });
                    }
                }
            }
        };

        /**
         *  settingAllBean
         *  呼叫 objectTreeGetValue 及 objectTreeSetValue
         *  將傳入參數設定完成
         *
         *  @param gformObject gForm物件 (最終設定物件)
         *  @param jsonObject  取值物件 (通常為 api 取得的結果)
         *  @param ditto       取值節點與最終賦值元件
         */
        this.settingAllBean = function (gformObject, jsonObject, ditto) {
            // 遍歷 ditto 物件陣列
            for (var i = 0; i < ditto.length; i++) {
                // 組合元件節點
                var bean = "gformItemMap." + ditto[i].beanName + ".itemValue";
                var tree = ditto[i].value;
                // call objectTreeGetValue 取的 jsonObject 指定節點值 (如下)
                var targetValue = this.objectTreeGetValue(jsonObject, tree);
                // 設定 gForm 物件賦值
                this.objectTreeSetValue(gformObject, bean, targetValue);
            }
        }

        /**
         *  objectTreeGetValue
         *  從傳入物件 obj 取的對應 tree 節點
         *
         *  @param  obj    取值物件 (通常為 api 取得的結果)
         *  @param  tree   取值節點
         *  @return value  節點值
         */
        this.objectTreeGetValue = function (obj, tree) {
            // 最終回傳值宣告
            var end;
            // console.log(obj, tree);
            // 最終結束取參，判斷 tree 節點是否為最終
            if (tree.indexOf('.') === -1) {
                // 判斷節點是否為陣列
                if (tree.indexOf('[') > -1) {
                    // 陣列分割 ex: a[5] >>> clsName = a, clsNum = 5
                    var clsName = tree.substring(0, tree.indexOf('['));
                    var clsNum  = tree.substring(tree.indexOf('[') + 1, tree.indexOf(']'));
                    if (obj[clsName][clsNum] === undefined) {
                        return false;
                    }
                    return obj[clsName][clsNum];
                } else {
                    return obj[tree];
                }
            }
            // 解構 tree 節點與陣列閘
            var tpr = tree.split('.');
            var boa = false;
            // 判斷目標節點是否為陣列
            if (tpr[0].indexOf('[') > -1) {
                // 陣列分割 ex: a[5] >>> clsName = a, clsNum = 5，開啟陣列閘
                var clsName = tpr[0].substring(0, tpr[0].indexOf('['));
                var clsNum  = tpr[0].substring(tpr[0].indexOf('[') + 1, tpr[0].indexOf(']'));
                boa         = true;
            }
            // 判斷陣列或物件
            if (!Array.isArray(obj)) {
                if (boa) {
                    // 若無此節點回傳 false
                    if (obj[clsName][clsNum] === undefined) {
                        return false;
                    } else {
                        // 深入節點並遞迴取值
                        tpr.splice(0, 1);
                        tpr = tpr.join('.');
                        end = this.objectTreeGetValue(obj[clsName][clsNum], tpr);
                    }
                } else {
                    // 同上
                    var clsName = tpr[0];
                    if (obj[clsName] === undefined) {
                        return false;
                    } else {
                        tpr.splice(0, 1);
                        tpr = tpr.join('.');
                        end = this.objectTreeGetValue(obj[clsName], tpr);
                    }
                }
            } else {
                // 同上，增加遍歷取值物件陣列
                for (var i = 0; i < obj.length; i++) {
                    if (boa) {
                        if (obj[i][clsName][clsNum] !== undefined) {
                            tpr.splice(0, 1);
                            tpr = tpr.join('.');
                            end = this.objectTreeGetValue(obj[i][clsName][clsNum], tpr);
                            break;
                        }
                    } else {
                        var clsName = tpr[0];
                        if (obj[i][clsName] !== undefined) {
                            tpr.splice(0, 1);
                            tpr = tpr.join('.');
                            end = this.objectTreeGetValue(obj[i][clsName], tpr);
                            break;
                        }
                    }
                }
            }
            // 回傳值
            return end;
        }

        /**
         *  objectTreeSetValue
         *  將傳入物件依照 tree 節點賦值(param)
         *
         *  @param obj    gForm物件(通常)
         *  @param tree   gFrom節點(通常)
         *  @param param  賦值參數
         */
        this.objectTreeSetValue = function (obj, tree, param) {
            console.log(obj, tree);
            // 最終結束取參，判斷 tree 節點是否為最終
            if (tree.indexOf('.') === -1) {
                // 判斷節點是否為陣列
                if (tree.indexOf('[') > -1) {
                    // 陣列分割 ex: a[5] >>> clsName = a, clsNum = 5
                    var clsName = tree.substring(0, tree.indexOf('['));
                    var clsNum  = tree.substring(tree.indexOf('[') + 1, tree.indexOf(']'));
                    // 若物件不存在則自動新增
                    if (obj[clsName] === undefined) {
                        obj[clsName] = [];
                        for (var i = 0; i < clsNum; i++) {
                            obj[clsName].push({});
                        }
                    } else if (obj[clsName][clsNum] === undefined) {
                        var len = obj[clsName].length;
                        for (var i = 0; i < clsNum - len + 1; i++) {
                            obj[clsName].push({});
                        }
                    }
                    obj[clsName][clsNum] = param;
                } else {
                    obj[tree] = param;
                }
                return false;
            }
            // 解構 tree 節點與陣列閘
            var tpr = tree.split('.');
            var boa = false;
            // 判斷目標節點是否為陣列
            if (tpr[0].indexOf('[') > -1) {
                // 陣列分割 ex: a[5] >>> clsName = a, clsNum = 5，開啟陣列閘
                var clsName = tpr[0].substring(0, tpr[0].indexOf('['));
                var clsNum  = tpr[0].substring(tpr[0].indexOf('[') + 1, tpr[0].indexOf(']'));
                boa         = true;
            }
            // 判斷陣列或物件
            if (!Array.isArray(obj)) {
                if (boa) {
                    // 若無此節點則自動新增
                    if (obj[clsName] === undefined) {
                        obj[clsName] = [];
                        for (var i = 0; i < clsNum; i++) {
                            obj[clsName].push({});
                        }
                    } else if (obj[clsName][clsNum] === undefined) {
                        var len = obj[clsName].length;
                        for (var i = 0; i < clsNum - len + 1; i++) {
                            obj[clsName].push({});
                        }
                    }
                    // 深入節點
                    tpr.splice(0, 1);
                    tpr = tpr.join('.');
                    this.objectTreeSetValue(obj[clsName][clsNum], tpr, param);
                } else {
                    // 同上
                    var clsName = tpr[0];
                    if (obj[clsName] === undefined) {
                        obj[clsName] = {};
                    }
                    tpr.splice(0, 1);
                    tpr = tpr.join('.');
                    this.objectTreeSetValue(obj[clsName], tpr, param);
                }
            } else {
                // 同上，增加遍歷取值物件陣列
                for (var i = 0; i < obj.length; i++) {
                    if (boa) {
                        if (obj[i][clsName] === undefined) {
                            obj[i][clsName] = [];
                            for (var i = 0; i < clsNum; i++) {
                                obj[i][clsName].push({});
                            }
                        }
                        tpr.splice(0, 1);
                        tpr = tpr.join('.');
                        this.objectTreeSetValue(obj[clsName][clsNum], tpr, param);
                    } else {
                        var clsName = tpr[0];
                        if (obj[i][clsName] === undefined) {
                            obj[i][clsName] = {};
                        }
                        tpr.splice(0, 1);
                        tpr = tpr.join('.');
                        this.objectTreeSetValue(obj[i][clsName], tpr, param);
                    }
                }
            }
        }

        //用template-web畫出動態表單的元件
        //ele               必填 $(ele).html(template-web)
        //formItemTemplate  必填 準備被畫的元件
        //formItemsTemplate 可選 完整formVersion物件
        this.createElement = function(ele, formItemTemplate, formItemsTemplate){
            var cxt=null;
            var url=window.location.href.split("/");
            var domain=url[0]+"//"+url[2]+"/"+url[3]+"/";
            domain+=(url[0]=="file:")?url[4]+"/":"";
            if (!this.checkboxCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/checkbox.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.checkboxCxt = cxt;
            }
            if (!this.radioCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/radio.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.radioCxt = cxt;
            }
            if (!this.selectCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/select.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.selectCxt = cxt;
            }
            if (!this.textCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/text.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.textCxt = cxt;
            }
            if (!this.hiddenCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/hidden.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.hiddenCxt = cxt;
            }
            if (!this.dateCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/date.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.dateCxt = cxt;
            }
            if (!this.timeCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/time.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.timeCxt = cxt;
            }
            if (!this.datetimeCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/datetime.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.datetimeCxt = cxt;
            }
            if (!this.textareaCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/textarea.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.textareaCxt = cxt;
            }
            if (!this.textareaEditorCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/textareaEditor.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.textareaEditorCxt = cxt;
            }
            if (!this.labelCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/label.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.labelCxt = cxt;
            }
            if (!this.buttonCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/button.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.buttonCxt = cxt;
            }
            if (!this.fileCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/file.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.fileCxt = cxt;
            }
            if (!this.addressTWCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/addressTW.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.addressTWCxt = cxt;
            }
            if (!this.totalScoreCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/totalScore.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.totalScoreCxt = cxt;
            }
            if (!this.signatureCxt){
                $.ajax({url: domain+"iq-nurs/nursing/customFormV3/template/signature.html", cache: false, ifModified:true, async: false}).done(function( context ) {
                    cxt = template.compile(context);
                }).fail(function(err){/*error*/});
                this.signatureCxt = cxt;
            }
            try{
                var tpl = $.extend(true, {}, formItemTemplate);
                //將data-xxx賦值到template，並替換為駝峰式的變數名稱
                var dataset=getDataset(ele);
                for (var key in dataset){
                    var datasetChange = this.datasetChange(key, dataset[key]);
                    tpl[datasetChange.key] = datasetChange.value;
                }
                //刪除左右空白
                for (var key in tpl){
                    if (tpl[key] != null && typeof tpl[key] === "string") {
                        tpl[key] = tpl[key].trim();
                    }
                }
                tpl.languageMode = languageMode;
                var html = this[tpl.controlType+"Ct"](ele, tpl);
                var that = this;

                if (html!==false && html!==undefined){
                    html = html.replace(/\s+\</g, "<");
                    var $html = $(html);
                    while ($html.find(".replaceHorFormItem").length > 0 || $html.find(".replaceVerFormItem").length > 0){
                        //橫向展開其他項 horizontalFormItem
                        $html.find(".replaceHorFormItem").each(function(){
                            try{
                                var bean = getDataset(this).bean.trim();
                                //如果這個橫向展開已經重複了就不再創建(理當同個bean不該被多個元件橫向展開)
                                if ($html.find("#div_"+bean).length>0 || $("#div_"+bean).length>0){
                                    $(this).removeClass("replaceHorFormItem").addClass("replaceHorFormItemRepeat");
                                }else{
                                    tpl = (formItemsTemplate[bean]) ? $.extend(true, {}, formItemsTemplate[bean]) : undefined;
                                    tpl.isHorFormItem = true;
                                    tpl.languageMode = languageMode;
                                    //replace : 移除開頭的空白+換行 避免無謂的空白
                                    html = that[tpl.controlType+"Ct"](this, tpl);
                                    if (html!==false && html!==undefined){
                                        html = html.replace(/\s+\</g, "<");
                                    }
                                    $(this).html(html);
                                    $(this).removeClass("replaceHorFormItem").addClass("replaceHorFormItemOk");
                                }
                            }catch(e){
                                console.error(e);
                                that.createElementOnError({ele: this, formItemTemplate: tpl, errMsg: e});
                                $(this).removeClass("replaceHorFormItem").addClass("replaceHorFormItemError");
                                $html.replaceWith(this);
                            }
                        });
                        //向下展開其他項 verticalFormItem
                        $html.find(".replaceVerFormItem").each(function(){
                            try{
                                var bean = getDataset(this).bean.trim();
                                //如果這個向下展開已經重複了就不再創建(理當同個bean不該被多個元件向下展開)
                                if ($html.find("#div_"+bean).length>0 || $("#div_"+bean).length>0){
                                    $(this).removeClass("replaceVerFormItem").addClass("replaceVerFormItemRepeat");
                                }else{
                                    tpl = (formItemsTemplate[bean]) ? $.extend(true, {}, formItemsTemplate[bean]) : undefined;
                                    tpl.isVerFormItem = true;
                                    tpl.languageMode = languageMode;
                                    //replace : 移除開頭的空白+換行 避免無謂的空白
                                    html = that[tpl.controlType+"Ct"](this, tpl);
                                    if (html!==false && html!==undefined){
                                        html = html.replace(/\s+\</g, "<");
                                    }
                                    $(this).html(html);
                                    $(this).removeClass("replaceVerFormItem").addClass("replaceVerFormItemOk");
                                }
                            }catch(e){
                                console.error(e);
                                that.createElementOnError({ele: this, formItemTemplate: tpl, errMsg: e});
                                $(this).removeClass("replaceHorFormItem").addClass("replaceHorFormItemError");
                                $html.replaceWith(this);
                            }
                        });
                    }
                    //ele.innerHTML = $("<div/>").append($html).html(); //此寫法效能比$(ele).html($html)還快三倍
                    $(ele).html($html); // //此方法可以執行<script>
                }
            }catch(e){
                console.error(e);
                this.createElementOnError({ele: ele, formItemTemplate: formItemTemplate, errMsg: e});
            }
        };

        this.createElementOnError = function(msg){
            var st="<font color='red'>";
            var template=msg.formItemTemplate;
            st+=(msg.errMsg.name=="TemplateError") ? "缺少參數<br/>" : "";
            st+=(msg.errMsg.message.indexOf("this.controllerType[formItemTemplate.controlType]")>-1) ? "缺少表單元件controlType("+((template)?template.controlType:"缺少表單模板:"+getDataset(msg.ele).bean)+")<br/>" : "";
            st+="</font>";
            st+="<b> beanName: </b>"+((template)?template.name+" (controlType="+template.controlType+")":"缺少表單模板 "+getDataset(msg.ele).bean)+"<br/>";
            st+="<b> 錯誤訊息: </b><br/>"+msg.errMsg.message.replace(/\r\n/g, "<br/>");
            $(msg.ele).html(st);
            console.log(st);
            console.log(msg);
        };
        this.checkboxCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.checkboxCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.radioCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.radioCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.selectCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.selectCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.textCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.textCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.hiddenCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.hiddenCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.dateCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                formItemTemplate.dateFormat = JSON.parse(formItemTemplate.typeFormat).date.format.replace("mm", "MM");
                if (!formItemTemplate.placeholder){
                    formItemTemplate.placeholder = formItemTemplate.dateFormat;
                }
                var html=this.dateCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.timeCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                formItemTemplate.timeFormat = JSON.parse(formItemTemplate.typeFormat).time.format.replace("hh", "HH").replace("ii", "mm");
                if (!formItemTemplate.placeholder){
                    formItemTemplate.placeholder = formItemTemplate.timeFormat;
                }
                var html=this.timeCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.datetimeCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                formItemTemplate.dateFormat = JSON.parse(formItemTemplate.typeFormat).date.format.replace("mm", "MM");
                formItemTemplate.timeFormat = JSON.parse(formItemTemplate.typeFormat).time.format.replace("hh", "HH").replace("ii", "mm");
                if (!formItemTemplate.placeholderDate){
                    formItemTemplate.placeholderDate = formItemTemplate.dateFormat;
                }
                if (!formItemTemplate.placeholderTime){
                    formItemTemplate.placeholderTime = formItemTemplate.timeFormat;
                }
                var html=this.datetimeCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.textareaCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.textareaCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.textareaEditorCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.textareaEditorCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.labelCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.labelCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.buttonCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.buttonCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.fileCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.fileCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.addressTWCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var tfmt = JSON.parse(formItemTemplate.typeFormat);
                formItemTemplate.hasZipcode = tfmt.hasZipcode;
                formItemTemplate.hasCounty = tfmt.hasCounty;
                formItemTemplate.hasDistrict = tfmt.hasDistrict;
                formItemTemplate.hasStreet = tfmt.hasStreet;
                var html=this.addressTWCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }
        };

        this.totalScoreCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.totalScoreCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }else{
                return false;
            }
        };
        this.signatureCt = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (!this.groupCheck(ele, formItemTemplate)){
                var html=this.signatureCxt(formItemTemplate);
                return html;
                //$(ele).html(html);
                // ele.innerHTML=html;  //此方法在IE不能插入<div>至<p>
            }else{
                return false;
            }
        };

        this.groupCt = function(ele, formItemTemplate){
            ele.style.display="none";
            $(ele).attr("data-grouptemplate", "true");
            if (formItemTemplate.parent!=undefined){
                $(ele).attr("data-parent", formItemTemplate.parent);
            }else{
                $(ele).attr("data-parent", "");
            }
            if (formItemTemplate.children!=undefined){
                $(ele).attr("data-children", formItemTemplate.children);
            }else{
                $(ele).attr("data-children", "");
            }
            //標記為grouptemplate的物件不會被create
            $(ele).find(".pFormItem").each(function(){
                $(this).attr("data-grouptemplate", "true");
            });
            return false;
        };

        this.groupCheck = function(ele, formItemTemplate){
            //標記為grouptemplate的物件不會被create
            if (getDataset(ele).grouptemplate=="true"){ //不能被create
                return true;
            }else{ //可以被create
                return false;
            }
        };

        this.groupIndexJSON = {};
        this.groupCreate = function(idx, groupBean, $groupEle, formItemsTemplate){
            if (thisTimeIsDittoTime && formItemsTemplate[groupBean] && formItemsTemplate[groupBean].dontDitto===true){
                return false;
            }
            var index; //group的索引號
            var that=getDataset($groupEle[0]); //同個group可能散落在各處，但parentNode應該要是一樣的
            //找到正確的index號
            if (that.parent==""){ //沒有父層代表是根節點
                index = this.groupIndexJSON[groupBean];
                index = this.groupIndexJSON[groupBean] = (index==undefined) ? -1 : index;
                if (idx!=-1){ //有指定 index 的話
                    this.groupIndexJSON[groupBean] = (idx>index) ? idx : index; //記錄目前最大號
                    index = idx;
                }else{
                    this.groupIndexJSON[groupBean] = ++index;
                }
            }else{ //子節點
                index = this.groupIndexJSON[that.parentnode+"-"+that.bean];
                index = this.groupIndexJSON[that.parentnode+"-"+that.bean] = (index==undefined) ? -1 : index;
                if (idx!=-1){ //有指定 index 的話
                    this.groupIndexJSON[that.parentnode+"-"+that.bean] = (idx>index) ? idx : index; //記錄目前最大號
                    index = idx;
                }else{
                    this.groupIndexJSON[that.parentnode+"-"+that.bean] = ++index;
                }
            }
            //到每個被選中的group[groupBean]底下去創建節點
            $groupEle.each(function(){
                var that=getDataset(this);
                var beanName=that.bean.split("-")[that.bean.split("-").length-1]; //找到此節點的節點名稱
                /**
                 * nodeId
                 * that.parent==""  ->  根結點的 nodeId 為 groupBean+"-"+index
                 * 子節點需判斷節點名稱 beanName 是否相符
                 *   -> 相符 -> nodeId 為 that.nodeid
                 *   -> 不符 -> nodeId 為 that.nodeid+"-"+beanName+"-"+index
                 **/
                var nodeId = (that.parent=="") ? groupBean+"-"+index : ("-"+that.nodeid+"--".indexOf("-"+beanName+"--")>-1)? that.nodeid : that.nodeid+"-"+beanName+"-"+index; //根結點
                var parentNode = (that.parent=="") ? beanName : that.parentnode;
                //(group) 複製後設定 nodeid parentnode ， 移除 grouptemplate 標記為可create
                var $groupClone = $(this).clone()
                    .css("display","")
                    .attr("data-nodeid", nodeId)
                    .attr("data-parentnode", parentNode)
                    .removeAttr("data-grouptemplate");
                //找到此節點下的 gorup 並設定 nodeid parentnode ，正確的nodeid會到下一次該group被複製時修正
                $groupClone.find(".pFormItemGroup").each(function(){
                    var that=getDataset(this);
                    $(this).attr("data-nodeid", nodeId)
                        .attr("data-parentnode", nodeId);
                });
                //找到此節點下的 pFormItem
                $groupClone.find(".pFormItem").each(function(){
                    var that=getDataset(this);
                    var beanName=that.bean.split("-")[that.bean.split("-").length-1]; //(pFormItem) 找到此節點的節點名稱
                    if (formItemsTemplate[that.bean]==undefined){
                        eNursing.F2ReportErrorMsg("缺少formVersion -> beanName="+that.bean+"");
                        return;
                    }
                    var parentName=formItemsTemplate[that.bean].parent;
                    if (parentName!=undefined){
                        parentName=parentName.split("-")[parentName.split("-").length-1]; //(pFormItem) 找到此節點的父層節點名稱
                        /**
                         * 比較 外頭被複製的節點名稱 和 此節點(pFormItem)的父層節點名稱
                         *   -> 相符 -> 代表此為group內的group節點，不該在這時候被create -> return (相當於continue)
                         *   -> 不符 -> 代表此為group內的節點，準備create -> 繼續程序
                         **/
                        if ((","+parentName+",").indexOf(","+nodeId.split("-")[nodeId.split("-").length-2]+",")==-1)
                            return;
                    }
                    //(pFormItem) 設定 nodeid parentnode ， 移除 grouptemplate 標記為可create
                    $(this).attr("data-nodeid", nodeId+"-"+beanName)
                        .attr("data-parentnode", nodeId)
                        .removeAttr("data-grouptemplate");
                    //設定beanName，讓id、name等關鍵屬性 = nodeId+"-"+beanName
                    var formItemTemplate = $.extend(true, {}, formItemsTemplate[that.bean]);
                    formItemTemplate.name=nodeId+"-"+beanName;
                    //create元件
                    dynamicForm.createElement(this, formItemTemplate);
                    //(formItem) 設定 nodeid parentnode
                    $(this).find(".formItem")
                        .attr("data-nodeid", nodeId+"-"+beanName)
                        .attr("data-parentnode", nodeId);
                });
                $groupClone.find(".createGroupBtn").attr("data-parentnode", nodeId);
                //將group插入此節點之前
                // this.parentNode.insertBefore($groupClone[0],this); //兼容ie，效能比$(this).before($groupClone);還高
                // this.before($groupClone[0]); //不兼容ie
                $(this).before($groupClone); //此方法可以執行<script>
            });
        };
        this.groupRemove = function($groupEle){
            $groupEle.remove();
        };

        this.setElementValue = function(ele, formItem, formItemTemplate){
            if (formItem!=undefined&&!!formItem.itemValue){
                var dataset=getDataset(ele);
                var tpl = $.extend(true, {}, formItemTemplate);
                for (var key in dataset){
                    var datasetChange = this.datasetChange(key, dataset[key]);
                    tpl[datasetChange.key] = datasetChange.value;
                }
                if (thisTimeIsDittoTime && tpl.dontDitto===true){ //在ditto模式時，跳過被設置為不要ditto的元件
                    return false;
                }
                var formItem2 = $.extend(true, {}, formItem);
                formItem2.itemValue = this.doFns(ele, formItem2.itemValue);
                this[tpl.controlType+"SetValue"](ele, formItem2, tpl);
            }
        };

        this.checkboxSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue.split(",");
            var otherValue = (fi.otherValue==undefined)?["&nbsp;"]:fi.otherValue.split("|");
            var html = "";
            for (var i=0, len=itemValue.length; i<len; i++){
                var eleIndex = tp.uiValue.indexOf(itemValue[i]);
                var eleId = tp.name+"_"+eleIndex;
                if (tp.controlMode=="readOnly"){
                    html+="|,|"+tp.uiDesc[eleIndex];
                    html+=(otherValue[i]=="&nbsp;" || otherValue[i]=="") ? "" : ":"+otherValue[i];
                }else{
                    var eleOtherText = $(ele).find("#"+eleId+"_otherText");
                    var $eleTarget = $(ele).find("#"+eleId);
                    if ($eleTarget.length>0 && !$eleTarget[0].checked){
                        $eleTarget.click();
                    }
                    if (eleOtherText.length!=0)
                        eleOtherText.val(otherValue[i]).change();
                }
            }
            if (tp.controlMode=="readOnly"){
                if (html!=""){
                    if (tp.displayMode=="vertical"){
                        html=html.substring(3).replace(/\|\,\|/g, "<br/>");
                    }else{
                        html=html.substring(3).replace(/\|\,\|/g, ",");
                    }
                }
                $(ele).find("#"+tp.name).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", (fi.otherValue==undefined)?"":fi.otherValue)
                    .html(html).change();
            }
        };

        this.radioSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = (fi.otherValue==undefined)?"":fi.otherValue;
            var eleIndex = tp.uiValue.indexOf(itemValue);
            var eleId = tp.name+"_"+eleIndex;
            if (tp.controlMode=="readOnly"){
                var html = (otherValue=="") ? tp.uiDesc[eleIndex] : tp.uiDesc[eleIndex]+":"+otherValue;
                $(ele).find("#"+tp.name).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", (fi.otherValue==undefined)?"":fi.otherValue)
                    .html(html).change();
            }else{
                var eleOtherText = $(ele).find("#"+eleId+"_otherText");
                var $eleTarget = $(ele).find("#"+eleId);
                if ($eleTarget.length>0 && !$eleTarget[0].checked){
                    $eleTarget.attr("checked",true).click();
                }
                if (eleOtherText.length!=0)
                    eleOtherText.val(otherValue).change();
            }
        };

        this.selectSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = (fi.otherValue==undefined)?"":fi.otherValue;
            var eleIndex = tp.uiValue.indexOf(itemValue);
            var eleId = tp.name+"_"+eleIndex;
            if (tp.controlMode=="readOnly"){
                var html = (otherValue=="") ? tp.uiDesc[eleIndex] : tp.uiDesc[eleIndex]+":"+otherValue;
                $(ele).find("#"+tp.name).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", (fi.otherValue==undefined)?"":fi.otherValue)
                    .html(html).change();
            }else{
                var eleOtherText = $(ele).find("#"+eleId+"_otherText");
                $(ele).find("#"+eleId).attr("selected",true).change();
                if (eleOtherText.length!=0)
                    eleOtherText.val(otherValue).change();
            }
        };

        this.textSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;

            var eleId = tp.name;
            if (tp.controlMode=="readOnly")
                $(ele).find("#"+eleId).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else
                $(ele).find("#"+eleId).val(itemValue).change().keyup().blur();
        };

        this.hiddenSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            if (tp.controlMode=="readOnly")
                $(ele).find("#"+eleId).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else
                $(ele).find("#"+eleId).val(itemValue).change();
        };

        this.dateSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            var $e = $(ele).find("#"+eleId);

            if (tp.controlMode=="readOnly")
                $e.attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else{
                //如果是upd頁面，而且是正式存檔，要把日期限制重新設為輸入時間 (原本是當前時間)
                var isChangeLimit = false;
                if ((!tp.minLimit && !tp.maxLimit) && itemValue){ //兩個都沒有限制時間才要重設，且itemValue必須要有值
                    if (thisTimeIsGform){ //gForm
                        if (gForm && gForm.status==="Y") isChangeLimit = true;
                    }else{
                        if (dForm && dForm.states==="Y") isChangeLimit = true;
                    }
                    if (isChangeLimit){
                        var limit = {};
                        var typeFormat = JSON.parse(tp.typeFormat).date;
                        typeFormat.format = typeFormat.format.replace("mm", "MM");
                        var value = (typeFormat.format+"").replace(/(yyyy)*[\-]*(MM)*[\-]*(dd)*/, function(st,y,m,d){
                            var arr=itemValue.split("-");
                            var i=0;
                            var st = "";
                            var yyyy = new Date().format("yyyy");
                            var MM = new Date().format("MM");
                            var dd = new Date().format("dd");
                            st += (y==undefined) ? yyyy+"/" : arr[i++]+"/";
                            st += (m==undefined) ? MM+"/" : arr[i++]+"/";
                            st += (d==undefined) ? dd : arr[i++];
                            return st;
                        });
                        limit = {"date":value.replace(/\//g, "-")};
                        $e.attr({
                            "data-minlimit" : JSON.stringify(limit),
                            "data-maxlimit" : JSON.stringify(limit)
                        });
                    }
                }

                $e.val(itemValue).change().blur();
            }

        };

        this.timeSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            var $e = $(ele).find("#"+eleId);
            if (tp.controlMode=="readOnly")
                $e.attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else
                $e.val(itemValue).change().blur();
        };

        this.datetimeSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            var $e = $(ele).find("#"+eleId);

            if (tp.controlMode=="readOnly")
                $e.attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else{
                //如果是upd頁面，而且是正式存檔，要把日期限制重新設為輸入時間 (原本是當前時間)
                var isChangeLimit = false;
                if ((!tp.minLimit && !tp.maxLimit)
                    && itemValue && itemValue!=" "
                    && itemValue.split(" ")[0]!=""
                ){ //兩個都沒有限制時間才要重設，且itemValue必須要有值
                    if (thisTimeIsGform){ //gForm
                        if (gForm && gForm.status==="Y") isChangeLimit = true;
                    }else{
                        if (dForm && dForm.states==="Y") isChangeLimit = true;
                    }
                    if (isChangeLimit){
                        var limit = {};
                        var typeFormat = JSON.parse(tp.typeFormat).date;
                        typeFormat.format = typeFormat.format.replace("mm", "MM");
                        var value = (typeFormat.format+"").replace(/(yyyy)*[\-]*(MM)*[\-]*(dd)*/, function(st,y,m,d){
                            var arr=itemValue.split(" ")[0].split("-");
                            var i=0;
                            var st = "";
                            var yyyy = new Date().format("yyyy");
                            var MM = new Date().format("MM");
                            var dd = new Date().format("dd");
                            st += (y==undefined) ? yyyy+"/" : arr[i++]+"/";
                            st += (m==undefined) ? MM+"/" : arr[i++]+"/";
                            st += (d==undefined) ? dd : arr[i++];
                            return st;
                        });
                        limit = {"date":value.replace(/\//g, "-")};
                        limit.time = JSON.parse($(ele).find("#"+eleId+"_time").attr("data-minlimit")).time;
                        $(ele).find("#"+eleId+"_date, #"+eleId+"_time").attr("data-minlimit", JSON.stringify(limit));
                        limit.time = JSON.parse($(ele).find("#"+eleId+"_time").attr("data-maxlimit")).time;
                        $(ele).find("#"+eleId+"_date, #"+eleId+"_time").attr("data-maxlimit", JSON.stringify(limit));
                    }
                }

                $e.val(itemValue).change();
            }

            $(ele).find("#"+eleId+"_date").change();
            $(ele).find("#"+eleId+"_time").change();
        };

        this.textareaSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            if (tp.controlMode=="readOnly")
                $(ele).find("#"+eleId).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else
                $(ele).find("#"+eleId).val(itemValue).change();
        };

        this.textareaEditorSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            if (tp.controlMode=="readOnly")
                $(ele).find("#"+eleId)[0].src = "data:text/html;charset=utf-8," + itemValue;
            else{
                //避免因iframe載入較慢導致 contentWindow 尚未ready
                try {
                    $(ele).find("#"+eleId)[0].contentWindow.$('#file_content').val(fi.itemValue).change();
                }catch(e){
                    window["textareaEditor_setDefaultValue_textareaEditor"] = function(){
                        $(ele).find("#"+eleId)[0].contentWindow.$("#file_content").val(itemValue).change();
                    }
                    // eval("textareaEditor_setDefaultValue_"+eleId+" = function(){"+
                    //     '$("#'+eleId+'")[0].contentWindow.$("#file_content").val("'+fi.itemValue.replace(/\\\'/g, "\\\\'")+'").change();'+
                    //     "}");
                }
            }
        };

        this.labelSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            $(ele).find("#label_"+eleId).attr("data-itemvalue", fi.itemValue)
                .attr("data-othervalue", "")
                .html(itemValue).change();
        };

        this.buttonSetValue = function(ele, formItem, formItemTemplate){
        };

        this.fileSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            $(ele).find("#"+eleId).attr("data-itemvalue", fi.itemValue)
                .attr("data-othervalue", "")
                .val(itemValue).change();
        };

        this.addressTWSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var eleId = tp.name;
            if (tp.controlMode=="readOnly")
                $(ele).find("#"+eleId).attr("data-itemvalue", fi.itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
            else{
                try{
                    $(ele).find("#"+eleId).val(itemValue).change();
                    var addrJson = this.addressTWGetOption(itemValue)
                    $(ele).find("#"+eleId+"_Zipcode").val(addrJson.zipcode).change();
                    $(ele).find("#"+eleId+"_County").val(addrJson.county).change();
                    $(ele).find("#"+eleId+"_District").val(addrJson.district).change();
                    $(ele).find("#"+eleId+"_Street").val(addrJson.street).change();
                }catch(e){
                    console.error(e);
                }

            }
        };
        this.signatureSetValue = function(ele, formItem, formItemTemplate){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            if (itemValue) {
                var eleId = tp.name;
                $(ele).find("#"+eleId)
                    .attr("data-itemvalue", itemValue)
                    .attr("data-othervalue", "")
                    .html(itemValue).change();
                var showArea=$(ele).find("#label_"+eleId)
                var imageData=itemValue.split("@")
                for (var i = 0; i < imageData.length; i++) {
                    var image = new Image()
                    image.style.width='200px'
                    image.src = imageData[i];
                    $(image).appendTo(showArea)
                }
            }
        };
        // return 地址 json {zipcode, county, district, street}
        // 其中"zipcode"只能查到3碼，若要查5碼，則必須填入控件去找，且有些縣市沒有3碼郵遞區號，
        this.addressTWGetOption = function(address){
            var addrSet = twzipcode32_defaults,
                addrCode = twzipcode32_data,
                zipcode = "",county = "",district = "",street = "",
                cty = "",
                addrJson = {"zipcode" : "---", "county" : "", "district" : "", "street" : ""};
            if (address && address!=""){
                //取得郵遞區號
                zipcode = address.match(/^[0-9\-]+/);
                if (zipcode){
                    addrJson.zipcode = zipcode[0];
                    address = address.substr(zipcode.length);
                }
                //取得縣市
                for (cty in addrCode){
                    var idx = address.indexOf(cty);
                    if (idx!=-1){
                        addrJson.county = cty;
                        address = address.substr(0, idx) + address.substr(idx+cty.length, address.length);
                        break;
                    }
                }
                //取得鄉鎮市區
                if (addrJson.county!==""){
                    //取得該縣市的鄉鎮市區+街道資訊
                    $.ajax({
                        url: (addrSet.root + addrSet.data + addrCode[addrJson.county].CODE + '.js?' + (new Date().getTime())),
                        type: 'GET',
                        async: false,
                        global: false,
                        cache: true,
                        dataType: 'JSON'
                    }).done(function (resp) {
                        //找到縣市鄉鎮
                        if (undefined !== resp[0]) {
                            //取得鄉鎮市區
                            for (district in resp[0]) {
                                if (resp[0].hasOwnProperty(district)) {
                                    var idx = address.indexOf(district);
                                    if (idx!=-1){
                                        addrJson.district = district;
                                        address = address.substr(0, idx) + address.substr(idx+district.length, address.length);
                                        break;
                                    }
                                }
                            }
                            //取得街道資訊
                            addrJson.street = address;
                            //(查找3碼或5碼郵遞區號)
                            //如果 district 為空則不必找
                            //如果 zipcode 不為"---"則不必找
                            if (addrJson.district !=="" && addrJson.zipcode==="---"){
                                var fiveZipcode = "";
                                //找出鄉鎮市區的5碼郵遞區號
                                for (street in resp[0][addrJson.district]){
                                    if (resp[0][addrJson.district].hasOwnProperty(street)) {
                                        var idx = address.indexOf(street);
                                        if (idx!=-1){
                                            //如果該街道有多個郵遞區號，就直接取第一個
                                            fiveZipcode = resp[0][addrJson.district][street][0][1];
                                            break;
                                        }
                                    }
                                }
                                if (fiveZipcode!==""){
                                    addrJson.zipcode = fiveZipcode;
                                }else{
                                    //找出縣市的3碼郵遞區號
                                    var code_district_arr = [];
                                    for (street in resp[0][addrJson.district]){
                                        var code_arr = resp[0][district][street];
                                        for (var i=0, len=code_arr.length; i<len; ++i){
                                            var code = code_arr[i][1].substr(0,3);
                                            if (code_district_arr.indexOf(code)==-1){
                                                code_district_arr.push(code);
                                            }
                                        }
                                    }
                                    //有些縣市會含多個3碼郵遞區號，如果是，就顯示"---"
                                    addrJson.zipcode = (code_district_arr.length===1) ? code_district_arr[0] : "---";
                                }
                            }
                        }
                    });
                }
            }
            return addrJson;
        };

        //顯示元件資料 (打印)
        this.showElementUiDesc_Print = function($pFormItem, $pFormItemGroup, dfTemplate, itemMaps){
            var dfItems = dfTemplate.items;
            var dfHashItems = dfTemplate.hashItems;
            //創建group
            if ($pFormItemGroup && $pFormItemGroup.length>0){
                $pFormItemGroup.each(function() {
                    var bean = getDataset(this).bean;
                    dynamicForm.createElement(this, dfHashItems[bean]);
                });
                //拆解Gorup的Items
                var groupItems = setElementValue_GetGroupItems(dfItems, itemMaps);
                //創建Gorup的元件
                setElementValue_CreateGroupElement($pFormItemGroup.selector, dfHashItems, groupItems);
                $pFormItem = $($pFormItem.selector);
            }

            //賦值
            $pFormItem.each(function() {
                var that=getDataset(this);
                var bean=that.bean;
                var nodeId=that.nodeid;
                if (nodeId){ //group
                    dynamicForm.showElementUiDesc(this, itemMaps[nodeId], dfHashItems[bean], itemMaps);
                }else{ //一般元件
                    dynamicForm.showElementUiDesc(this, itemMaps[bean], dfHashItems[bean], itemMaps);
                }
            });

        };

        //顯示元件資料
        this.showElementUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            ele.innerHTML=this.elementUiDescFormat(ele, formItem, formItemTemplate, itemMaps);
        };

        //format元件資料
        this.elementUiDescFormat = function(ele, formItem, formItemTemplate, itemMaps){
            var tempFormItem = {
                "itemKey": "無",
                "itemValue": ""
            };
            if (formItemTemplate==undefined) {
                return "";
            }else{
                if (formItem === undefined) {
                    formItem = tempFormItem;
                    formItem.itemKey = formItemTemplate.name;
                }
                var dataset=getDataset(ele);
                var tpl = $.extend(true, {}, formItemTemplate);
                for (var key in dataset){
                    var datasetChange = this.datasetChange(key, dataset[key]);
                    tpl[datasetChange.key] = datasetChange.value;
                }
                tpl.languageMode = languageMode;
                var formItem2 = $.extend(true, {}, formItem);
                formItem2.itemValue = this.doFns(ele, formItem2.itemValue);
                return this[tpl.controlType+"ShowUiDesc"](ele, formItem2, tpl, itemMaps);
            }
        };

        this.checkboxShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue.split(",");
            var otherValue = (fi.otherValue==undefined)?[""]:fi.otherValue.split("|");
            var otherItemsHor = [];
            var otherItemsVer = [];
            var otherItemsVer_idx = [];
            var formTemplateMaps = dynamicFormTemplate.hashItems;
            var uiDesc="";
            if(formItemTemplate.horizontalFormItem!=null){
                otherItemsHor = formItemTemplate.horizontalFormItem.split("|,|");
            }
            if(formItemTemplate.verticalFormItem!=null){
                otherItemsVer = formItemTemplate.verticalFormItem.split("|,|");
            }
            for (var i=0, len=itemValue.length; i<len; ++i){
                otherValue[i] = (otherValue[i]==undefined)?"":otherValue[i];
                var eleIndex = tp.uiValue.indexOf(itemValue[i]);
                if (eleIndex!=-1){uiDesc+=","+tp.uiDesc[eleIndex];}
                if (otherValue[i]!=""){uiDesc+=":"+otherValue[i]+(tp.otherBackTitle && tp.otherBackTitle[i]?tp.otherBackTitle[i]:'');}
                if (eleIndex!=-1 && itemMaps){
                    //橫向展開
                    if(otherItemsHor.length>0 && otherItemsHor[eleIndex]){
                        var otherItemsArr = otherItemsHor[eleIndex].split(",");
                        var oUiDesc = "";
                        for (var i2=0, len2=otherItemsArr.length; i2<len2; ++i2){
                            if(itemMaps[otherItemsArr[i2]]!=null && formTemplateMaps[otherItemsArr[i2]]!=null){
                                var oFormItem = itemMaps[otherItemsArr[i2]];
                                var oTpl = formTemplateMaps[otherItemsArr[i2]];
                                var oUiDesc2 = this.elementUiDescFormat(ele, oFormItem, oTpl);
                                oUiDesc += (oUiDesc2!="") ? ","+oUiDesc2 : "";
                            }
                        }
                        uiDesc+=(oUiDesc!="") ? "("+oUiDesc.substr(1)+")" : "";
                    }
                    //向下展開
                    otherItemsVer_idx[otherItemsVer_idx.length]=eleIndex;
                }
            }
            //向下展開
            if(otherItemsVer.length>0 && itemMaps){
                for (var i2=0, len2=otherItemsVer_idx.length; i2<len2; ++i2){
                    var otherItemsArr = otherItemsVer[otherItemsVer_idx[i2]].split(",");
                    var oUiDesc = "";
                    for (var i2=0, len2=otherItemsArr.length; i2<len2; ++i2){
                        if(itemMaps[otherItemsArr[i2]]!=null && formTemplateMaps[otherItemsArr[i2]]!=null){
                            var oFormItem = itemMaps[otherItemsArr[i2]];
                            var oTpl = formTemplateMaps[otherItemsArr[i2]];
                            var oUiDesc2 = this.elementUiDescFormat(ele, oFormItem, oTpl);
                            oUiDesc += (oUiDesc2!="") ? "<br/>"+oUiDesc2 : "";
                        }
                    }
                    uiDesc+=(oUiDesc!="") ? oUiDesc : "";
                }
            }
            return (uiDesc!="") ? uiDesc.substr(1) : "";
        };

        this.radioShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = (fi.otherValue==undefined)?"":fi.otherValue;
            var otherItemsHor = [];
            var otherItemsVer = [];
            var formTemplateMaps = dynamicFormTemplate.hashItems;
            var uiDesc="";
            var eleIndex = tp.uiValue.indexOf(itemValue);
            if (eleIndex!=-1) {
                uiDesc = tp.uiDesc[eleIndex];
                if (otherValue != "")
                    uiDesc += ":"+otherValue + (tp.otherBackTitle && tp.otherBackTitle[eleIndex] ? tp.otherBackTitle[eleIndex] : '');
                if (formItemTemplate.horizontalFormItem != null) {
                    otherItemsHor = formItemTemplate.horizontalFormItem.split("|,|");
                }
                if (formItemTemplate.verticalFormItem != null) {
                    otherItemsVer = formItemTemplate.verticalFormItem.split("|,|");
                }
                //橫向展開
                if (otherItemsHor.length > 0 && otherItemsHor[eleIndex] && itemMaps) {
                    var otherItemsArr = otherItemsHor[eleIndex].split(",");
                    var oUiDesc = "";
                    for (var i2 = 0, len2 = otherItemsArr.length; i2 < len2; ++i2) {
                        if (itemMaps[otherItemsArr[i2]] != null && formTemplateMaps[otherItemsArr[i2]] != null) {
                            var oFormItem = itemMaps[otherItemsArr[i2]];
                            var oTpl = formTemplateMaps[otherItemsArr[i2]];
                            var oUiDesc2 = this.elementUiDescFormat(ele, oFormItem, oTpl);
                            oUiDesc += (oUiDesc2 != "") ? "," + oUiDesc2 : "";
                        }
                    }
                    uiDesc += (oUiDesc != "") ? "(" + oUiDesc.substr(1) + ")" : "";
                }
                //向下展開
                if (otherItemsVer.length > 0 && itemMaps) {
                    var otherItemsArr = otherItemsVer[eleIndex].split(",");
                    var oUiDesc = "";
                    for (var i2 = 0, len2 = otherItemsArr.length; i2 < len2; ++i2) {
                        if (itemMaps[otherItemsArr[i2]] != null && formTemplateMaps[otherItemsArr[i2]] != null) {
                            var oFormItem = itemMaps[otherItemsArr[i2]];
                            var oTpl = formTemplateMaps[otherItemsArr[i2]];
                            var oUiDesc2 = this.elementUiDescFormat(ele, oFormItem, oTpl);
                            oUiDesc += (oUiDesc2 != "") ? "<br/>" + oUiDesc2 : "";
                        }
                    }
                    uiDesc += (oUiDesc != "") ? oUiDesc : "";
                }
            }
            return (uiDesc!="") ? ((tp.showTitle ? (tp.title + ':') : '') + uiDesc + (tp.backTitle || '')) : "";
        };

        this.selectShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var fi=formItem;
            var tp=formItemTemplate;
            var itemValue = fi.itemValue;
            var otherValue = (fi.otherValue==undefined)?"":fi.otherValue;
            var uiDesc="";
            var eleIndex = tp.uiValue.indexOf(itemValue);
            if (eleIndex!=-1) {
                uiDesc = tp.uiDesc[eleIndex];
                if (otherValue != "")
                    uiDesc += otherValue + ((tp.otherBackTitle && tp.otherBackTitle[eleIndex]) ? tp.otherBackTitle[eleIndex] : '');
            }
            return (uiDesc!="") ? uiDesc : "";
        };

        this.textShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            if (formItem.itemValue != "") {
                return (tp.showTitle ? (tp.title + ':') : '') + formItem.itemValue + (tp.backTitle || '');
            } else {
                return "";
            }
        };

        this.hiddenShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            return formItem.itemValue;
        };

        this.dateShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            return formItem.itemValue;
        };

        this.timeShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            return formItem.itemValue;
        };

        this.datetimeShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            return formItem.itemValue;
        };

        this.textareaShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            if (formItemTemplate.tooMoreText!=undefined && formItem.itemValue.length>formItemTemplate.tooMoreText){
                var html = formItem.itemValue.substr(0,formItemTemplate.tooMoreText)+"...";
                html+="<a href='#' onclick='$(this).parent().html(\""+formItem.itemValue.replaceToHtml().replace(/\&/g,"&amp;")+"\");return false;'>";
                if (formItemTemplate.languageMode=="Traditional Chinese"){
                    html+="(點擊展開)";
                }else if (formItemTemplate.languageMode=="Simplified Chinese"){
                    html+="(点击展开)";
                }
                html+="</a>";
                return html;
            }else{
                return formItem.itemValue.replaceToHtml();
            }
        };

        this.textareaEditorShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var iframe = $('<div><iframe id="'+formItemTemplate.name+'" frameborder="0" src="" class="textareaEditorShowUidesc" style="width: 100%; height: 100%;"></iframe></div>');
            iframe.find("iframe")[0].src = "data:text/html;charset=utf-8," + formItem.itemValue.replace(/\'/g, "\\'");
            return iframe.html();
        };

        this.labelShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            return formItem.itemValue;
        };
        this.buttonShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
        };
        this.fileShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var html = "";
            var fileInfos = formItem.itemValue;
            if (fileInfos && fileInfos!=""){
                fileInfos = JSON.parse(fileInfos);
                for (var i =0, len=fileInfos.length; i<len; ++i){
                    var fileInfo = fileInfos[i];
                    var a = "";
                    a += (i!=0) ? "<br/>" : "";
                    a += "<a href='#' onclick='";
                    a += "fileTool.downloadFile_FileOutputStream(\""+fileInfo.id+"\");";
                    a += "return false;";
                    a += "'>"+fileInfo.fileName.replaceToHtml()+"</a>";
                    html += a;
                }
            }
            return html;
        };

        this.addressTWShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var tp = formItemTemplate;
            if (formItem.itemValue != "") {
                return (tp.showTitle ? (tp.title + ':') : '') + formItem.itemValue + (tp.backTitle || '');
            } else {
                return "";
            }
        };
        this.signatureShowUiDesc = function(ele, formItem, formItemTemplate, itemMaps){
            var fi=formItem;
            var tp = formItemTemplate;
            var itemValue = fi.itemValue;
            var html = '';
            if (itemValue) {
                var imageData=itemValue.split("@")
                for (var i = 0; i < imageData.length; i++) {
                    html+='<img style="width:200px;" src="'
                        +imageData[i]
                        +'">';
                }
                return (tp.showTitle ? (tp.title + ':') : '') + html + (tp.backTitle || '');
            }else
                return html;
        };
    }
    eNursing.addModule(DynamicForm);

    /**条码信息**/
    function SearchParamDF() {
        this.nodeId = eNursing.getFnName(SearchParamDF);
        //String 查询病历号
        this.patientId = null;
        //String 查询住院号
        this.encounterId = null;
        //Date 查询开始时间
        this.beginDate = null;
        //Date 查询结束时间
        this.endDate = null;
        //String 查询表單类型
        this.formType = null;
        //String 查询表單對應頁面
        this.frameModel = null;
        //String 查询表單ID
        this.formId = null;
        //String 查询表單版本號
        this.versionNo = null;
        //String 準備被轉換的xml文本
        this.content = null;
        //Boolean 是否查詢content欄位
        this.hasContent = null;
    }
    eNursing.addModule(SearchParamDF);

    /**動態表單formItem**/
    /** @function nursing.createDynamicFormItem*/
    /** @function nursing.getDynamicFormItem*/
    function DynamicFormItem() {
        this.nodeId = eNursing.getFnName(DynamicFormItem);
        //String 主健
        this.ID = null;
        //String 项目
        this.itemKey = null;
        //String 项目值
        this.itemValue = null;
        //String 其他值
        this.otherValue = null;
    }
    eNursing.addModule(DynamicFormItem);

    /**formVersion模板**/
    function FormVersion() {
        this.nodeId = eNursing.getFnName(FormVersion);
        //String 表单模板ID
        this.id = null;
        //String 表单类型
        this.formType = null;
        //String 表单中文描述
        this.title = null;
        //String XML文本
        this.content = null;
        //int 版號
        this.version = null;
        //Timestamp 時戳
        this.ts = null;
        //String 未知
        this.creatorId = null;
        //String 未知
        this.creatorName = null;
        //Date 未知
        this.createTime = null;
        //String 未知
        this.modifyUserId = null;
        //String 未知
        this.modifyUserName = null;
        //Date 未知
        this.modifyTime = null;
    }
    eNursing.addModule(FormVersion);

    /**formFrame外框**/
    function FormFrame() {
        this.nodeId = eNursing.getFnName(FormFrame);
        //String 流水号
        this.id = null;
        //String 表单类型
        this.formType = null;
        //String 對應頁面
        this.frameModel = null;
        //String 模版文本
        this.content = null;
        //int 版號
        this.version = null;
        //String 備註
        this.note = null;
        //String 未知
        this.creatorId = null;
        //String 未知
        this.creatorName = null;
        //Date 未知
        this.createTime = null;
        //String 未知
        this.modifyUserId = null;
        //String 未知
        this.modifyUserName = null;
        //Date 未知
        this.modifyTime = null;
    }
    eNursing.addModule(FormFrame);


    /**基础参数**/
    /** @function nursing.createBasicParam*/
    /** @function nursing.getBasicParam*/
    function BasicParam() {
        this.nodeId = eNursing.getFnName(BasicParam);
        this.dynamicFormTemplate = null;
        this.dynamicFormFrame = null;

        //取得模板的所有清單 formVersion
        this.getFormVersionAllList = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "FormVersionAllList",
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};

            eNursing.sendMsg("dynamicFormService.getFormVersionAllList", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var list = result.data[0].basicParam;
                    if (window.console) console.log(list);
                    successCall(list.formVersionList);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null);
                }

            }, errorCall, false, false, "formVersion");
        };

        //获取模版最大版號 (根據formTypeArr)
        this.getFormVersionListMaxTsByFormType = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "formVersionListMax_."+dynamicFormParam.searchParamDF.formType,
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;

            eNursing.sendMsg("dynamicFormService.getFormVersionListMaxTsByFormType", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var list = result.data[0].basicParam;
                    if (window.console) console.log(list);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(result);
                }

            }, errorCall);
        };

        //获取模版差異資料 (根據formType,ts)
        this.getFormVersionListByFormTypeTs = function (syncParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "formVersionListSync",
                /**动作*/
                action: "select"
            };
            var isLastFormVersion, formVersionArr;
            if (syncParam.isLastFormVersion != undefined){
                isLastFormVersion = syncParam.isLastFormVersion, //是否只查詢最後一版formVersion
                formVersionArr    = syncParam.syncParam;         //查詢formVersion的參數
            }else{
                isLastFormVersion = false,                       //是否只查詢最後一版formVersion
                formVersionArr    = syncParam;                   //查詢formVersion的參數
            }


            eNursing.sendMsg("dynamicFormService.getFormVersionListByFormTypeTs", {"isLastFormVersion":isLastFormVersion, "syncParam":[{"basicParam":{"formVersionList":{"formVersion":formVersionArr}}}]}, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null);
                }

            }, errorCall);
        };

        //根据 FormType,获取該模版的清單 formVersionList
        this.getFormVersionListByFormType = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "FormVersionList."+dynamicFormParam.searchParamDF.formType,
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;

            eNursing.sendMsg("dynamicFormService.getFormVersionListByFormType", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var list = result.data[0].basicParam;
                    if (window.console) console.log(list);
                    successCall(list.formVersionList);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null);
                }

            }, errorCall);
        };

        //根據FormType,versionNo 获取模版 FormVersion
        this.getFormVersionByFormTypeVersionNo = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "DynamicFormFrame."+dynamicFormParam.searchParamDF.formType+"."+dynamicFormParam.searchParamDF.frameModel+"."+dynamicFormParam.searchParamDF.versionNo,
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.versionNo=dynamicFormParam.searchParamDF.versionNo;
            argumentParam.searchParamDF.encounterId="getFormVersionByFormTypeVersionNo";

            eNursing.sendMsg("dynamicFormService.getFormVersionByFormTypeVersionNo", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var list = result.data[0].basicParam.formVersionList.formVersion[0];
                    if (window.console) console.log(result);
                    successCall(list);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall, false, false, "formVersion");
        };

        //根據content 重新讀取xml轉換為 DynamicFormTemplate
        this.getDynamicFormTemplateByContent = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "DynamicFormTemplateByContent",
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.content=dynamicFormParam.searchParamDF.content;
            argumentParam.searchParamDF.encounterId="getDynamicFormTemplateByContent";

            eNursing.sendMsg("dynamicFormService.getDynamicFormTemplateByContent", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var dFTemplate = result.data[0].basicParam.dynamicFormTemplate;
                    if (window.console) console.log(dFTemplate);
                    successCall(dFTemplate);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall);
        };

        //依據formType(表單名)、frameModel(對應頁面) 取得最新版的formFrame(表單外框)
        this.getCurrDynamicFormFrameByformTypeFrameModel = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "DynamicFormFrame.Curr."+dynamicFormParam.searchParamDF.formType+"."+dynamicFormParam.searchParamDF.frameModel,
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.frameModel=dynamicFormParam.searchParamDF.frameModel;
            argumentParam.searchParamDF.encounterId="getCurrDynamicFormFrameByformTypeFrameModel";

            eNursing.sendMsg("dynamicFormService.getCurrDynamicFormFrameByformTypeFrameModel", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var formFrame = result.data[0].basicParam;
                    if (window.console) console.log(formFrame);
                    successCall(formFrame.dynamicFormFrame);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall, false, false, "formFrame");
        };
        //依據formType(表單名)、frameModel(對應頁面)、versionNo(版本號) 取得其對應的formFrame(表單外框)
        this.getDynamicFormFrameByformTypeFrameModelVersionNo = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "DynamicFormFrame."+dynamicFormParam.searchParamDF.formType+"."+dynamicFormParam.searchParamDF.frameModel+"."+dynamicFormParam.searchParamDF.versionNo,
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.frameModel=dynamicFormParam.searchParamDF.frameModel;
            argumentParam.searchParamDF.versionNo=dynamicFormParam.searchParamDF.versionNo;
            argumentParam.searchParamDF.encounterId="getDynamicFormFrameByformTypeFrameModelVersionNo";
            eNursing.sendMsg("dynamicFormService.getDynamicFormFrameByformTypeFrameModelVersionNo", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var formFrame = result.data[0].basicParam;
                    if (window.console) console.log(formFrame);
                    successCall(formFrame.dynamicFormFrame);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall, false, false, "formFrame");
        };
        //依據formType(表單名) 取得其對應的表單外框frameModel的清單
        this.getDynamicFormFrameModelListByformType = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "DynamicFormFrame.FrameModelList."+dynamicFormParam.searchParamDF.formType,
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.encounterId="getDynamicFormFrameModelListByformType";

            eNursing.sendMsg("dynamicFormService.getDynamicFormFrameModelListByformType", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var formFrameList = result.data[0].basicParam;
                    if (window.console) console.log(formFrameList);
                    successCall(formFrameList.formFormFrameList);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall);
        };
        //依據formType(表單名)、frameModel(對應頁面) 取得其對應的表單外框frame的清單
        this.getDynamicFormFrameListByformTypeFrameModel = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "DynamicFormFrame.FrameList."+dynamicFormParam.searchParamDF.formType+"."+dynamicFormParam.searchParamDF.frameModel,
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.frameModel=dynamicFormParam.searchParamDF.frameModel;
            argumentParam.searchParamDF.encounterId="getDynamicFormFrameListByformTypeFrameModel";

            eNursing.sendMsg("dynamicFormService.getDynamicFormFrameListByformTypeFrameModel", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    var formFrameList = result.data[0].basicParam;
                    if (window.console) console.log(formFrameList);
                    successCall(formFrameList.formFormFrameList);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null, result.resultMsg.message);
                }

            }, errorCall);
        };

        //获取动态表单 frame的差異資料 (根據List(FormVersion) -- formType,ts)
        this.getDynamicFormFrameListByformTypeTs = function (syncParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "formFrameListSync",
                /**动作*/
                action: "select"
            };
            var isLastFormFrame, formFrameArr;
            if (syncParam.isLastFormFrame != undefined){
                isLastFormFrame = syncParam.isLastFormFrame, //是否只查詢最後一版formFrame
                formFrameArr    = syncParam.syncParam;         //查詢formFrame的參數
            }else{
                isLastFormFrame = false,                       //是否只查詢最後一版formFrame
                formFrameArr    = syncParam;                   //查詢formFrame的參數
            }

            eNursing.sendMsg("dynamicFormService.getDynamicFormFrameListByformTypeTs", {"isLastFormFrame":isLastFormFrame, "syncParam":[{"basicParam":{"formVersionList":{"formVersion":formFrameArr}}}]}, param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result);
                    successCall(null);
                }

            }, errorCall);
        };

        //获取评估单表,获取当前最新版本模版 (formType)
        this.getCurrDynamicFormTemplateV3 = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: dynamicFormParam.getNode()+".CurrDynamicFormTemplate."+dynamicFormParam.searchParamDF.formType,
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.encounterId="getCurrDynamicFormTemplateV3";

            eNursing.sendMsg("dynamicFormService.getCurrDynamicFormTemplateV3", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result.data);
                    var dFTemplate = result.data[0].basicParam.dynamicFormTemplate;
                    var items=dFTemplate.items;
                    var hashItems = {};
                    if (items){
                        for (i=0, len=items.length; i<len; i++){
                            hashItems[items[i].name]=items[i];
                        }
                    }else{
                        dFTemplate.items={};
                    }
                    dFTemplate.hashItems=hashItems;
                    successCall(result.data);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                }

            }, errorCall, false, false, "formVersion");
        };
        //根据formType及versionNo版本號获取模版 (formType,versionNo)
        this.getDynamicFormTemplateByFormModelVersionNo = function (dynamicFormParam, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "DynamicFormTemplate."+dynamicFormParam.searchParamDF.formType+"."+dynamicFormParam.searchParamDF.versionNo,
                /**动作*/
                action: "select"
            };
            var argumentParam = {searchParamDF:{}};
            argumentParam.searchParamDF.formType=dynamicFormParam.searchParamDF.formType;
            argumentParam.searchParamDF.versionNo=dynamicFormParam.searchParamDF.versionNo;
            argumentParam.searchParamDF.encounterId="getDynamicFormTemplateByFormModelVersionNo";
            eNursing.sendMsg("dynamicFormService.getDynamicFormTemplateByFormModelVersionNo", [{"dynamicForm":argumentParam}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result.data);
                    successCall(result.data);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall, false, false, "formVersion");
        };
        //增加formVersion模板 (formType,title,content)
        this.addFormVersion = function (formVersion, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "DynamicFormTemplate.Add."+formVersion.formType,
                /**动作*/
                action: "add"
            };
            eNursing.sendMsg("dynamicFormService.addFormVersion", [{"basicParam":{"formVersionList":{"formVersion":[formVersion]}}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result.data);
                    successCall(result.data);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
        //覆蓋formVersion模板 (formType,content,version)
        this.updateFormVersionByFormTypeFormModelVersion = function (formVersion, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "DynamicFormTemplate."+formVersion.formType+"."+formVersion.version,
                /**动作*/
                action: "upd"
            };
            eNursing.sendMsg("dynamicFormService.updateFormVersionByFormTypeFormModelVersion", [{"basicParam":{"formVersionList":{"formVersion":[formVersion]}}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
        //同步formVersion模板 (要同步的FormVersion模板)
        this.syncFormVersion = function (formVersion, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "SyncFormFrame."+formVersion.formType+"."+formVersion.version,
                /**动作*/
                action: "sync"
            };
            eNursing.sendMsg("dynamicFormService.syncFormVersion", [{"basicParam":{"formVersionList":{"formVersion":[formVersion]}}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
        //增加formFrame模板 (formType,frameModel,content,note)
        this.addFormFrame = function (formFrame, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "DynamicFormFrame.Add."+formFrame.formType+"."+formFrame.frameModel,
                /**动作*/
                action: "add"
            };
            eNursing.sendMsg("dynamicFormService.addFormFrame", [{"basicParam":{"dynamicFormFrame":formFrame}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
        //覆蓋formFrame模板 (formType,frameModel,content,version,note)
        this.updateFormFrameByFormTypeFrameModelVesion = function (formFrame, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "DynamicFormFrame."+formFrame.formType+"."+formFrame.frameModel+"."+formFrame.version,
                /**动作*/
                action: "upd"
            };
            eNursing.sendMsg("dynamicFormService.updateFormFrameByFormTypeFrameModelVesion", [{"basicParam":{"dynamicFormFrame":formFrame}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
        //覆蓋formFrame模板 (formType,frameModel,content,version,note)
        this.syncFormFrame = function (formFrame, successCall, errorCall) {
            var param = {
                /**不同数据*/
                node: "SyncFormFrame."+formFrame.formType+"."+formFrame.frameModel+"."+formFrame.version,
                /**动作*/
                action: "sync"
            };
            eNursing.sendMsg("dynamicFormService.syncFormFrame", [{"basicParam":{"dynamicFormFrame":formFrame}}], param, "", function (result) {
                if (result.resultMsg.success) {
                    if (window.console) console.log(result);
                    successCall(result);
                } else {
                    eNursing.F2ReportErrorMsg(result.resultMsg);
                    errorCall(result.resultMsg.message);
                }

            }, errorCall);
        };
    }
    eNursing.addModule(BasicParam);

}(eNursing);