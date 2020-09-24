
function dropPrev(treeId, nodes, targetNode) {
    var pNode = targetNode.getParentNode();
    if (pNode && pNode.dropInner === false) {
        return false;
    } else {
        for (var i=0,l=curDragNodes.length; i<l; i++) {
            var curPNode = curDragNodes[i].getParentNode();
            if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                return false;
            }
        }
    }
    return true;
}

function dropInner(treeId, nodes, targetNode) {
    if (targetNode && targetNode.dropInner === false) {
        return false;
    } else {
        for (var i=0,l=curDragNodes.length; i<l; i++) {
            if (!targetNode && curDragNodes[i].dropRoot === false) {
                return false;
            } else if (curDragNodes[i].parentTId && curDragNodes[i].getParentNode() !== targetNode && curDragNodes[i].getParentNode().childOuter === false) {
                return false;
            }
        }
    }
    return true;
}

function dropNext(treeId, nodes, targetNode) {
    var pNode = targetNode.getParentNode();
    if (pNode && pNode.dropInner === false) {
        return false;
    } else {
        for (var i=0,l=curDragNodes.length; i<l; i++) {
            var curPNode = curDragNodes[i].getParentNode();
            if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                return false;
            }
        }
    }
    return true;
}

function beforeDragOpen(treeId, treeNode) {
    autoExpandNode = treeNode;
    return true;
}

function onDrag(event, treeId, treeNodes) {
    className = (className === "dark" ? "":"dark");
    showLog("[ "+getTime()+" onDrag ]&nbsp;&nbsp;&nbsp;&nbsp; drag: " + treeNodes.length + " nodes." );
}

function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
    className = (className === "dark" ? "":"dark");
    showLog("[ "+getTime()+" onDrop ]&nbsp;&nbsp;&nbsp;&nbsp; moveType:" + moveType);
    showLog("target: " + (targetNode ? targetNode.name : "root") + "  -- is "+ (isCopy==null? "cancel" : isCopy ? "copy" : "move"))
}

function onExpand(event, treeId, treeNode) {
    if (treeNode === autoExpandNode) {
        className = (className === "dark" ? "":"dark");
        showLog("[ "+getTime()+" onExpand ]&nbsp;&nbsp;&nbsp;&nbsp;" + treeNode.name);
    }
}

function showLog(str) {
    if (!log) log = $("#log");
    log.append("<li class='"+className+"'>"+str+"</li>");
    if(log.children("li").length > 8) {
        log.get(0).removeChild(log.children("li")[0]);
    }
}

function setTrigger() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.setting.edit.drag.autoExpandTrigger = $("#callbackTrigger").attr("checked");
}

function getTime() {
    var now= new Date(),
        h=now.getHours(),
        m=now.getMinutes(),
        s=now.getSeconds(),
        ms=now.getMilliseconds();
    return (h+":"+m+":"+s+ " " +ms);
}



function onRemove(e, treeId, treeNode) {
    showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
}

function beforeRename(treeId, treeNode, newName, isCancel) {
    className = (className === "dark" ? "":"dark");
    showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
    if (newName.length == 0) {
        setTimeout(function() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.cancelEditName();
            alert("节点名称不能为空.");
        }, 0);
        return false;
    }
    return true;
}

function onRename(e, treeId, treeNode, isCancel) {
    showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
}

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
}

function selectAll() {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
}

function beforeDrag(treeId, treeNodes) {
    className = (className === "dark" ? "":"dark");
    showLog("[ "+getTime()+" beforeDrag ]&nbsp;&nbsp;&nbsp;&nbsp; drag: " + treeNodes.length + " nodes." );
    for (var i=0,l=treeNodes.length; i<l; i++) {
        if (treeNodes[i].drag === false) {
            curDragNodes = null;
            return false;
        } else if (treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
            curDragNodes = null;
            return false;
        }
    }
    curDragNodes = treeNodes;
    return true;
}

//拖动节点
function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
    className = (className === "dark" ? "":"dark");
    showLog("[ "+getTime()+" beforeDrop ]&nbsp;&nbsp;&nbsp;&nbsp; moveType:" + moveType);
    showLog("target: " + (targetNode ? targetNode.name : "root") + "  -- is "+ (isCopy==null? "cancel" : isCopy ? "copy" : "move"));
    if(treeNodes!=null && treeNodes.length>0 && targetNode!=null){
        for(var z=0;z<treeNodes.length;z++){
            for(var s=0;s<zNodes.length;s++){
                if(treeNodes[z].id === zNodes[s].id){
                    zNodes[s].pId = targetNode.pId;
                }
            }
        }
    }
    return true;
}

//删除节点
function beforeRemove(treeId, treeNode) {
    className = (className === "dark" ? "":"dark");
    showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.selectNode(treeNode);
    var flag = confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
    if(flag){
        var zNodesThis = new Array();
        for(var s=0;s<zNodes.length;s++){
            if(treeNode.id !== zNodes[s].id){
                zNodesThis.push(zNodes[s]);
            }
        }
        zNodes = zNodesThis;
    }
    return flag;
}

//编辑节点
function beforeEditName(treeId, treeNode) {
    className = (className === "dark" ? "":"dark");
    showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.selectNode(treeNode);
    setTimeout(function() {
        if (confirm("进入节点 " + treeNode.name + " 的编辑状态吗？")) {
            setTimeout(function() {
                //zTree.editName(treeNode);
                thisTreeNode = treeNode;
                $("#id_value").val(treeNode.id);
                $("#key_value").val(treeNode.key);
                $("#name_value").val(treeNode.name);
                $("#link_value").val(treeNode.link);
                $("#perm_value").val(treeNode.perm);
                $("#gformtype_value").val(treeNode.gformtype);
                $("#pId_value").val(treeNode.pId);
                $("#showMenu_value").val(treeNode.showMenu);
                $("#returnDiv").click();
            }, 0);
        }
    }, 0);
    return false;
}

//新增节点
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        thisTreeNode = treeNode;
        $("input[name='cause']").val('');
        $("#pId_value").val(treeNode.id);
        $("#id_value").val(uuid());
        $("#returnDiv").click();
        return false;
    });
}

function addOrUpdateZNodes() {
    var id = $("#id_value").val();
    var key = $("#key_value").val();
    var name = $("#name_value").val();
    var link = $("#link_value").val();
    var perm = $("#perm_value").val();
    var gformtype = $("#gformtype_value").val();
    var pId = $("#pId_value").val();
    var showMenu = $("#showMenu_value").val();
    var menuData = {id: id, key: key, name: name, link: link, perm: perm, gformtype: gformtype, pId: pId, showMenu: showMenu, open: true};
    var zNodesThis = new Array();
    var flag = true;
    for(var s=0;s<zNodes.length;s++){
        if(id !== zNodes[s].id){
            zNodesThis.push(zNodes[s]);
        }else{
            flag = false;
            zNodesThis.push(menuData);
        }
    }
    if(flag){zNodesThis.push(menuData);}
    zNodes = zNodesThis;
    $("input[name='cause']").val('');
    $("#closeThis").click();
    setTreeMenuHtml();
}

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
}

function setTreeMenuHtml() {
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    $("#callbackTrigger").bind("change", {}, setTrigger);
    $("#selectAll").bind("click", selectAll);
}

function submitMemu(type) {
    if (confirm("確認修改菜單？？？")) {
        var span = $("#treeDemo").find("span[class='node_name']");
        var zNodesThis = [];
        for (var s = 0; s < span.length; s++) {
            var treeId = $(span[s]).attr("treeId");
            for (var z = 0; z < zNodes.length; z++) {
                if (zNodes[z].id === treeId) {
                    zNodes[z].seq = s;
                    var id = zNodes[z].id != null ? (zNodes[z].id != '' ? zNodes[z].id : 'null') : 'null';
                    var key = zNodes[z].key != null ? (zNodes[z].key != '' ? zNodes[z].key : 'null') : 'null';
                    var name = zNodes[z].name != null ? (zNodes[z].name != '' ? zNodes[z].name : 'null') : 'null';
                    var seq = zNodes[z].seq != null ? (zNodes[z].seq != '' ? zNodes[z].seq : 'null') : 'null';
                    var gformtype = zNodes[z].gformtype != null ? (zNodes[z].gformtype != '' ? zNodes[z].gformtype : 'null') : 'null';
                    var link = zNodes[z].link != null ? (zNodes[z].link != '' ? zNodes[z].link : 'null') : 'null';
                    var perm = zNodes[z].perm != null ? (zNodes[z].perm != '' ? zNodes[z].perm : 'null') : 'null';
                    var pId = zNodes[z].pId != null ? (zNodes[z].pId != '' ? zNodes[z].pId : 'null') : 'null';
                    var showMenu = zNodes[z].showMenu != null ? (zNodes[z].showMenu != '' ? zNodes[z].showMenu : 'null') : 'null';
                    var str = id + '@' + name + '@' + key + '@' + gformtype + '@' + link + '@' + perm + '@' + pId + '@' + showMenu + '@' + seq;
                    //把 ',' 替换成 '#'
                    var str2 = str.replace(/,/g, '#');
                    zNodesThis.push(str2); //JSON.stringify(zNodes[z])
                    break;
                }
            }
        }
        if (zNodesThis.length > 0) {
            var zNodesStr = null;
            for (var j = 0; j < zNodesThis.length; j++) {
                if (zNodesStr === null) {
                    zNodesStr = zNodesThis[j];
                } else {
                    zNodesStr += ',' + zNodesThis[j];
                }
            }
            $.ajax({
                url: '../treeMenu/updateMenu.do',
                data: {menuArr: zNodesStr, caseType: caseType, type: type},
                method: 'POST',
                async: false,
                cache: false,
                success: function (resultSet) {
                    if (console) console.log(resultSet);
                    if (resultSet != null) {
                        var data = JSON.parse(resultSet);
                        if (data != null && data.length > 0) {
                            alert(data[0].resultMsg.message);
                            if (data[0].resultMsg.success) {
                                caseType = data[0].caseType;
                                searchMemuByCaseType(false);
                            }
                        }
                    }
                },
                error: function (e) {
                    if (console) console.log(e)
                }
            });
        }
    }
}

function searchMemuByCaseType(type,type1) {
    if (type) {
        caseType = $("#caseTypeSel").val();
    }
    if(type1 === null || type1 === undefined || type1 === ''){
        type1 = 'N';
    }
    if (caseType != null && caseType != '') {
        $.ajax({
            url: '../treeMenu/menu.do',
            contentType: "application/json;charset=UTF-8",
            data: '{"caseType": "' + caseType + '","type": "' + type1 + '"}',
            type: 'post',
            dataType: "json",
            async: false,
            cache: false,
            success: function (resultSet) {
                if (console) console.log(resultSet);
                if (resultSet != null && resultSet.menu != null && resultSet.menu.itemList != null && resultSet.menu.itemList.length > 0) {
                    zNodes = new Array();
                    setZNodes(resultSet.menu.itemList, null);
                    setTreeMenuHtml();
                    if(type1 === 'Y'){
                        alert("還原成功！！！");
                    }
                }
            },
            error: function (e) {
                if (console) console.log(e)
            }
        });
    }
}

function setZNodes(menuList, pid) {
    if (menuList != null && menuList.length > 0) {
        for (var s = 0; s < menuList.length; s++) {
            var menu = menuList[s];
            menu.indexId = uuid();
            var menuData = {id: menu.indexId, key: menu.id, name: menu.name, link: menu.link, perm: menu.perm, gformtype: menu.gformtype, pId: pid, showMenu: menu.showMenu, open: true};
            zNodes.push(menuData);
            if (menu.itemList != null && menu.itemList.length > 0) {
                setZNodes(menu.itemList, menuData.id);
            }
        }
    }
}
