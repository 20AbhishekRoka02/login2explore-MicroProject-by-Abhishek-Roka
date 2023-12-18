const API_URL = "http://api.login2explore.com:5577";
const API_IML_ENDPOINT = "/api/iml";
const API_IRL_ENDPOINT = "/api/irl";
const CONN_TOKEN = "90931456|-31949302883922036|90960545"
const DB_NAME = "SCHOOL-DB";
const RELATION = "STUDENT-TABLE";
const CLASSES = ['Play','Nursery','KG','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII']



// On every key up, checking value whether record with givne student id is present or not
let rollnoInput = document.getElementById("rollno");
rollnoInput.addEventListener("keyup", (event) => {

    let gotValue = rollnoInput.value;
    if (gotValue === "") {
        // when nothing inside student id field
        $("#stuReset").prop('disabled', true);
        $("#stuSave").prop('disabled', true);
        $("#stuChange").prop('disabled', true);
        return;
    }

    $("#stuReset").prop('disabled', false);

    let strObj = {
        "Roll-No": rollnoInput.value,
    }

    let jsonStrObj = JSON.stringify(strObj);
    console.log(jsonStrObj);

    let getBYKEYrequestStr = createGET_BY_KEYRequest(CONN_TOKEN, DB_NAME, RELATION, jsonStrObj);

    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommandAtGivenBaseUrl(getBYKEYrequestStr, API_URL, API_IRL_ENDPOINT);
    if (resultObj.status === 400) {
        // if record not exists, then save will be enabled
        $("#stuSave").prop("disabled", false);
        $("#stuChange").prop("disabled", true);
        return;
    } else {
        // Otherwise, change will be enabled
        parsedStudentJson = JSON.parse(resultObj.data);
        console.log(parsedStudentJson);

        $("#stuChange").prop("disabled", false);
        $("#stuSave").prop("disabled", true);

        $("#fullname").val(parsedStudentJson.record['Full-Name']);
        $("#class").val(parsedStudentJson.record['Class']);
        $("#birthdate").val(parsedStudentJson.record['Birth-Date']);
        $("#address").val(parsedStudentJson.record['Address']);
        $("#enrollmentdate").val(parsedStudentJson.record['Enrollment-Date']);
        localStorage.setItem('rec_no', parsedStudentJson.rec_no)
    }

    jQuery.ajaxSetup({ async: true });
    
    
})

// Checking fields to be emputy or not and create JSON
function validateAndGetFormData() {
    var rollnoVar = $("#rollno").val();
    if (rollnoVar === "") {
        alert("Roll No Required Value");
        $("#rollno").focus();
        return "";
    }
    var fullnameVar = $("#fullname").val();
    if (fullnameVar === "") {
        alert("Full Name Required Value");
        $("#fullname").focus();
        return "";
    }
    var classVar = $("#class").val();
    if (classVar === "") {
        alert("Class Required Value");
        $("#class").focus();
        return "";
    } else if (CLASSES.indexOf(classVar) === -1) {
        alert("Select CLASS from the list!");
        return "";
    }

    var birthdateVar = $("#birthdate").val();
    if (birthdateVar === "") {
        alert("Birth Date Required Value");
        $("#birthdate").focus();
        return "";
    }
    var addressVar = $("#address").val();
    if (addressVar === "") {
        alert("Employee DA Required Value");
        $("#address").focus();
        return "";
    }
    var enrollmentdateVar = $("#enrollmentdate").val();
    if (enrollmentdateVar === "") {
        alert("Employee Deduction Required Value");
        $("#enrollmentdate").focus();
        return "";
    }
    var jsonStrObj = {
        "Roll-No": rollnoVar,
        "Full-Name": fullnameVar,
        "Class": classVar,
        "Birth-Date": birthdateVar,
        "Address": addressVar,
        "Enrollment-Date": enrollmentdateVar
    };
    return JSON.stringify(jsonStrObj);
}

// update student record on DB
const changeEmployee = () => {
    let jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    
    let updateReqStr = createUPDATERecordRequest(CONN_TOKEN, jsonStr, DB_NAME, RELATION, localStorage.getItem('rec_no'));
    alert(updateReqStr);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(updateReqStr,
        API_URL, API_IML_ENDPOINT);
    alert(JSON.stringify(resultObj));
    jQuery.ajaxSetup({ async: true });
    setup_page();

}


// Saves student record on DB
const saveEmployee = () => {
    let jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createPUTRequest(CONN_TOKEN,
        jsonStr, DB_NAME, RELATION);
    alert(putReqStr);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr,
        API_URL, API_IML_ENDPOINT);
    alert(JSON.stringify(resultObj));
    jQuery.ajaxSetup({ async: true });
    setup_page();
}



// Disable/enable buttons and clean the text code and setup page on load
let stuResetButton = document.getElementById("stuReset");
stuResetButton.addEventListener('click', () => {
    
    $("#rollno").val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enrollmentdate").val("");

    $("#stuSave").prop('disabled', true);
    $("#stuChange").prop('disabled', true);
    $("#stuReset").prop('disabled', true);

    focus_on_ID();
})


const focus_on_ID = () => {
    $("#rollno").focus();
}

const setup_page = () => {

    $("#rollno").val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enrollmentdate").val("");

    focus_on_ID();

    $("#stuSave").prop('disabled', true);
    $("#stuChange").prop('disabled', true);
    $("#stuReset").prop('disabled', true);

}


window.onload = setup_page;
