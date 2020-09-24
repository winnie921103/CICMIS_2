
function setBMIValue() {
    $("input[id='MNABMI']").attr("readOnly", false);
    var hVal = $("#MNAHeight").val();//身高
    var wVal = $("#MNAWeight").val();//體重
    if (hVal != null && hVal != "" && isRealNum(hVal)) {
        hVal = parseInt(hVal);
    } else {
        hVal = 0;
    }
    if (wVal != null && wVal != "" && isRealNum(wVal)) {
        wVal = parseInt(wVal);
    } else {
        wVal = 0;
    }
    var bmi = 0;
    if (wVal != 0 && hVal != 0) {
        bmi = parseFloat(wVal / ((hVal / 100) * (hVal / 100)).toFixed(1));
    }
    var index = 0;
    if (bmi >= 19 && bmi < 21) {
        index = 1;
    } else if (bmi >= 21 && bmi < 23) {
        index = 2;
    } else if (bmi >= 23) {
        index = 3;
    }
    $("#MNABMI").val(bmi);
    var inps = $("input[name='MNABMIResult']");
    if (inps != null) {
        $(inps[index]).click();
    }
    $("input[id='MNABMI']").attr("readOnly", true);
}

function isRealNum(val) {
    if (val === "" || val == null) {
        return false;
    }
    if (!isNaN(val)) {
        return true;
    } else {
        return false;
    }
}