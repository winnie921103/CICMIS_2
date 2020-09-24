/*  動態表單各家獨立的js (表單建置後) (print專用) */
(function() {
    // getPatientData
    // var gFormJS = nursing.createGForm();
    var targetFormType = 'CICPatInfo';
    gFormJS.getExtendGFormData({
        formType:   targetFormType,
        action:     'baseInit',
        PHISTNUM:   window.localStorage['patient_phistnum'],
        PCASENO:    window.localStorage['patient_pcaseno']
    }, function (data) {
        console.log(data);
        // var gformItemMap = data[0].gForm.gformItemMap;
        if (data[0].gForm) 
            setElementValue_GForm(data[0].gForm)
    }, function (error) {
        console.log(error);
    });
})();