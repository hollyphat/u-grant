//Settings FILE

var app_name = "U-Grant";
var developer_url = "https://onlinemedia.com.ng";
var developer_email = "admin@onlinemedia.com.ng";
var supervisor = "HigoTech";


//var url = 'http://app.onlinemedia.com.ng/quiz/api.php';
var url;

var env,server_upload_url,app_path;
env = "local";

var base_url;

if(env == "local"){
    url = "http://project.apps/ugrant/api.php";
    base_url = "http://project.apps/ugrant";
    server_upload_url = "http://project.apps/cdn/";

}else{
    base_url = "https://projects.onlinemedia.com.ng/ugrant";
    url = 'https://projects.onlinemedia.com.ng/ugrant/api.php';
    server_upload_url = "https://cdn.uwansell.com.ng/apps/";
}

app_path = "ugrant/";


function is_login() {
    var user_id = localStorage.getItem("ugrant_user_id");
    if(user_id == "" || user_id == null){
        return false;
    }else{
        return true;
    }
}

function show_toast(msg,color) {
    if(color == "red"){
        var title = '<i class="fa fa-warning"></i>';
    }else{
        var title = '';
    }
    iziToast.show({
        title: title,
        message: msg,
        color: color,
        timeout: 5000
    });
}






document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    /*$.ajax({
       'url': url,
       'type': 'get',
       'data' : {
           'save_id' : '',
           'model' : device.model,
           'platform': device.platform,
           'uuid' : device.uuid,
           'version': device.version,
           'manufacturer' : device.manufacturer,
           'is_virtual' : device.isVirtual,
           'serial': device.serial
       },
        success: function (s) {

        },
        timeout: 30000
    });*/
}


//login-form

function vibration() {
    var time = 500;
    navigator.vibrate(time);
}