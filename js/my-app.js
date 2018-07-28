// Initialize your app
var myApp = new Framework7({
    modalTitle: app_name,
    material: true,
    pushState : true,
    smartSelectOpenIn: 'picker',
    template7Pages: true, // enable Template7 rendering for Ajax and Dynamic pages
    precompileTemplates: true
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true //enable inline page
});


myApp.onPageInit('index-page',function (page) {
    //myApp.initImagesLazyLoad('.page');

    $("#login-form").on("submit",function (e) {

        e.preventDefault();
        var login_as;
        $$('select[name="login_as"] option:checked').each(function () {
            login_as = this.value;
        });

        var email = $("#email_login").val();
        var password = $("#password_login").val();



        if(email == "" || password == "" || login_as == ""){
            vibration();
            show_toast("All fields are required","red");
            return;
        }

        $(".login-btn").addClass("hide");
        $(".login-waiting").removeClass("hide");

        $$.ajax({
           url: url,
           type: 'POST',
           dataType: 'json',
           data: {
               'login': '',
               'login_type': login_as,
               'email': email,
               'password': password
           },
            timeout: 45000,
            success: function (f) {
               console.log(f);
                $(".login-btn").removeClass("hide");
                $(".login-waiting").addClass("hide");
                vibration();

                var ok = f.ok;

                if(ok == 1){
                    var d = f.datas;
                    sessionStorage.setItem("login_as",login_as);
                    sessionStorage.setItem("user_id",d.id);
                    sessionStorage.setItem("name",d.name);
                    sessionStorage.setItem("email",d.email);
                    sessionStorage.setItem("phone",d.phone);
                    sessionStorage.setItem("image",d.image);
                    if(login_as === "buyer"){
                        $$("#buyer-link").click();
                    }else{
                        $$("#seller-link").click();
                    }
                }else{
                    show_toast(f.msg,"red");
                }
            },
            error: function (e) {
                $(".login-btn").removeClass("hide");
                $(".login-waiting").addClass("hide");
                vibration();

                show_toast("Network error...","red");
            }
        });
    });

    $(".logout").on("click",function (e) {
        triggerLogout();
    });
    //load featured
}).trigger();


myApp.onPageInit('register',function (page) {

    var manualUploader = new qq.FineUploader({
        element: document.getElementById('fine-uploader-manual-trigger'),
        template: 'qq-template-manual-trigger',
        request: {
            endpoint: server_upload_url + 'upload.php',
            params: {
                'project': 'ugrant',
                'folder': 'users'
            }
        },
        thumbnails: {
            placeholders: {
                waitingPath: 'lib/upload/waiting-generic.png',
                notAvailablePath: 'lib/upload/not_available-generic.png'
            }
        },
        validation: {
            allowedExtensions: ['jpeg', 'jpg', 'png'],
            itemLimit: 1,
            sizeLimit: 2097152 // 50 kB = 50 * 1024 bytes
        },
        autoUpload: true,
        debug: false,
        callbacks: {
            onComplete: function (id, name, responseJSON, xhr) {

                var image_name = (responseJSON.image_name);

                $("[name=sell-images]").val(image_name);

            }
        }
    });

    qq(document.getElementById("trigger-upload")).attach("click", function() {
        manualUploader.uploadStoredFiles();
    });


    var manualUploader_2 = new qq.FineUploader({
        element: document.getElementById('fine-uploader-manual-trigger_2'),
        template: 'qq-template-manual-trigger_2',
        request: {
            endpoint: server_upload_url + 'upload.php',
            params: {
                'project': 'ugrant',
                'folder': 'users'
            }
        },
        thumbnails: {
            placeholders: {
                waitingPath: 'lib/upload/waiting-generic.png',
                notAvailablePath: 'lib/upload/not_available-generic.png'
            }
        },
        validation: {
            allowedExtensions: ['jpeg', 'jpg', 'png'],
            itemLimit: 5,
            sizeLimit: 2097152 // 50 kB = 50 * 1024 bytes
        },
        autoUpload: true,
        debug: false,
        callbacks: {
            onComplete: function (id, name, responseJSON, xhr) {

                var image_name = (responseJSON.image_name);

                $("[name=buy-images]").val(image_name);

            }
        }
    });

    qq(document.getElementById("trigger-upload_2")).attach("click", function() {
        manualUploader_2.uploadStoredFiles();
    });


    $("#loan-seller-form").on("submit",function (e) {
       e.preventDefault();

       var sell_image = $("[name=sell-images]").val();

       if(sell_image == ""){
           show_toast("Kindly upload your company image","red");
           vibration();

           return;
       }

       var datas = $(this).serialize();

       myApp.showPreloader("Registration in progress...");

       $.ajax({
          url: url,
          dataType: 'json',
           method: 'post',
           timeout: 45000,
           data: datas,
           success:function (f) {
              myApp.hidePreloader();
               var ok = f.ok;

               if(ok == 1){
                   show_toast(f.msg,"green");
                   $(".go-back").click();
               }else{
                   show_toast(f.msg,"red");
               }

           },
           error: function (err) {
               myApp.hidePreloader();
               show_toast("Network error...","red");
           }
       });
    });


    $("#loan-buyer-form").on("submit",function (e) {
        e.preventDefault();

        var buy_image = $("[name=buy-images]").val();

        if(buy_image == ""){
            show_toast("Kindly upload profile image","red");
            vibration();
            return;
        }

        var datas = $(this).serialize();

        myApp.showPreloader("Registration in progress...");

        $.ajax({
            url: url,
            dataType: 'json',
            method: 'post',
            timeout: 45000,
            data: datas,
            success:function (f) {
                myApp.hidePreloader();
                var ok = f.ok;

                if(ok == 1){
                    show_toast(f.msg,"green");
                    $(".go-back").click();
                }else{
                    show_toast(f.msg,"red");
                }

            },
            error: function (err) {
                myApp.hidePreloader();
                show_toast("Network error...","red");
            }
        });
    });
});



myApp.onPageInit('password',function (page) {

    $$("#password-form").on('submit',function(e){
        e.preventDefault();
        //var pass_matric = $$("#pass_matric").val();

        var pass_email = $$("#email").val();
        myApp.showPreloader("Please wait...");

        $$.ajax({
            url: url,
            data: {
                'reset_pass': '',
                'email': pass_email
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    //$$("#pass_matric").val('');
                    //$$("#pass_email").val('');
                    show_toast(f.msg,"green");
                }else{
                    show_toast(f.msg,"red");
                }
                myApp.hidePreloader();


            },
            error:function(err){
                myApp.hidePreloader();
                show_toast("Network error, try again","red");
                console.log(err.responseText);
            },
            timeout: 60000
        });
    });
});

myApp.onPageInit('buyer_home',function (page) {
    update_stat();
    $(".u-name").html(sessionStorage.getItem("name"));
    var user_img = server_upload_url + "/" + app_path + "/users/"+sessionStorage.getItem("image");
    $(".u-img").attr("src",user_img);
    $(".u-email").html(sessionStorage.getItem("email"));
    $(".u-phone").html(sessionStorage.getItem("phone"));


    $(".logout").on("click",function (e) {
        e.preventDefault();
        triggerLogout();
    })
});

myApp.onPageInit('seller_home',function (page) {
    update_stat();
    $(".u-name").html(sessionStorage.getItem("name"));
    var user_img = server_upload_url + "/" + app_path + "/users/"+sessionStorage.getItem("image");
    $(".u-img").attr("src",user_img);
    $(".u-email").html(sessionStorage.getItem("email"));
    $(".u-phone").html(sessionStorage.getItem("phone"));


    $(".logout").on("click",function (e) {
        e.preventDefault();
        triggerLogout();
    })
});


myApp.onPageInit('request-loan',function (page) {
   update_stat();

   myApp.showIndicator();
   var user_id = sessionStorage.getItem("user_id");

   $.ajax({
      url: url,
      type: 'GET',
      data: {
          'acc-status': '',
          'user_id': user_id
      },
       success: function (f) {
           if(f == 0){
               show_toast("Kindly update your account details to proceed!","red");
           }else{
               $(".page-info").removeClass("hide");
           }
           myApp.hideIndicator();
       },
       timeout: function (e) {
           vibration();
           show_toast("Network error...","red");
           myApp.hideIndicator();
       }
   });


    var manualUploader = new qq.FineUploader({
        element: document.getElementById('fine-uploader-manual-trigger'),
        template: 'qq-template-manual-trigger',
        request: {
            endpoint: server_upload_url + 'upload.php',
            params: {
                'project': 'ugrant',
                'folder': 'loan'
            }
        },
        thumbnails: {
            placeholders: {
                waitingPath: 'lib/upload/waiting-generic.png',
                notAvailablePath: 'lib/upload/not_available-generic.png'
            }
        },
        validation: {
            allowedExtensions: ['jpeg', 'jpg', 'png'],
            itemLimit: 2,
            sizeLimit: 2097152 // 50 kB = 50 * 1024 bytes
        },
        autoUpload: true,
        debug: false,
        callbacks: {
            onComplete: function (id, name, responseJSON, xhr) {

                var image_name = (responseJSON.image_name);

                $("[name=g_images]").val($("[name=g_images]").val()+"\n"+image_name);

            }
        }
    });

    qq(document.getElementById("trigger-upload")).attach("click", function() {
        manualUploader.uploadStoredFiles();
    });


    $("[name=user_id]").val(user_id);
    $("#request-form").on("submit",function (e) {
        e.preventDefault();

        //console.log($("[name=g_images]").val());

        var img = $("[name=g_images]").val();
        if(img == ""){
            vibration();
            show_toast("Kindly upload the guarantor ID","red");
            return;
        }

        myApp.showPreloader("Please wait while we submit your application...");

        $.ajax({
           url: url,
           type: 'post',
           data: $(this).serialize(),
           timeout: 45000,
           dataType: 'json',
           success: function (f) {
               myApp.hidePreloader();
               if(f.ok == 1){
                   show_toast(f.msg,"green");
               }else{
                   show_toast(f.msg,"red");
               }
           },
            error: function (err) {
                myApp.hidePreloader();
                show_toast("Network error..., try again","red");
            }
        });
    });
});
//grant_loan
myApp.onPageInit("loan_history",function (page) {
    update_stat();
    var user_id = sessionStorage.getItem("user_id");
   myApp.showIndicator();

   $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      timeout: 45000,
      data: {
          'get_loan_history': '',
          'user_id': user_id
      },
       success: function (f) {
           if(f.total == 0){
               show_toast("You do not have any loan history!","yellow");
           }else{

               parse_loan("#loan-list",f.record,"view_loan.html");
           }
           myApp.hideIndicator();
       },
       error: function (err) {
           myApp.hideIndicator();
           show_toast("Network error, please try again","red");
       }
   });


});


myApp.onPageInit("grant_loan",function (page) {
    update_stat();
    myApp.showIndicator();

    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        timeout: 45000,
        data: {
            'loan_list': ''
        },
        success: function (f) {
            if(f.total == 0){
                show_toast("No list to grant!","yellow");
            }else{

                parse_loan("#loan-list",f.record,"grant_loan.html");
            }
            myApp.hideIndicator();
        },
        error: function (err) {
            myApp.hideIndicator();
            show_toast("Network error, please try again","red");
        }
    });


});

myApp.onPageInit("pay_loan",function (page) {
    update_stat();
    var user_id = sessionStorage.getItem("user_id");
    myApp.showIndicator();

    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        timeout: 45000,
        data: {
            'repay_loan': '',
            'user_id': user_id
        },
        success: function (f) {
            if(f.total == 0){
                show_toast("You do not have any loan to repay!","yellow");
            }else{

                parse_loan("#loan-list",f.record,"pay_loan.html");
            }
            myApp.hideIndicator();
        },
        error: function (err) {
            myApp.hideIndicator();
            show_toast("Network error, please try again","red");
        }
    });


});

myApp.onPageInit('b-bank',function (page) {
   update_stat();

   myApp.showPreloader("Fetching account details...");
   var user_id = sessionStorage.getItem("user_id");

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        data: {
            'get-acc-status': '',
            'user_id': user_id
        },
        success: function (f) {
            myApp.hidePreloader();
            console.log(f.total);
            if(f.total == 1){
                //console.log(f.data);
                //var d =
                console.log(f.datas);
                $("[name=bank_name]").val(f.datas.bank_name);
                $("[name=account_no]").val(f.datas.account_no);
                $("[name=account_name]").val(f.datas.account_name);
            }
        },
        timeout: 45000,
        error: function (e) {
            myApp.hidePreloader();
            vibration();
            show_toast("Network error..., unable to load your account details!","red");
        }
    });


    $("#b-account-form").on("submit",function (e) {
        e.preventDefault();

        myApp.showPreloader("Please wait...");
        $.ajax({
           url: url,
           type: 'post',
           dataType: 'json',
            data:{
              'save_account': '',
              'user_id': user_id,
              'bank_name': $("[name=bank_name]").val(),
                'account_name': $("[name=account_name]").val(),
                'account_no': $("[name=account_no]").val()
            },
           timeout: 45000,
           success: function (f) {
               myApp.hidePreloader();
               show_toast(f.msg,"green");
           },
            error: function (err) {
                myApp.hidePreloader();
                show_toast("Newtork error...","red");
                vibration();
            }
        });
    });

});


myApp.onPageInit("view-loan-2",function (page) {

    update_stat();

    var thisPageQuery = page.query;



    var loan_id;

    loan_id = thisPageQuery.id;

    $("[name=email]").val(sessionStorage.getItem("email"));

    //Voguepay.init({form:'payform'});

    $("#pay-now").on("click",function (e) {
       e.preventDefault();

       var user_id = sessionStorage.getItem("user_id");
       $.ajax({
          url: url,
          type: 'post',
          data:{
              'pay_loan' : '',
              'user_id': user_id,
              'loan_id': loan_id
          },
           success: function (f) {
               show_toast("Payment made successfully","green");
               //window.location()
           },
           error: function (err) {
               show_toast("Network error, try again","red");
           }
       });
    });


});

function triggerLogout(){
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("image");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("login_as");
    myApp.alert("You have logout successfully","Logout");
    update_stat();
}




function update_stat() {
    var user_id = sessionStorage.getItem("user_id");
    if((user_id == null) || (user_id == "")){
        window.location = "main.html";
    }

    var login_type = sessionStorage.getItem("login_as");
    if(login_type == "buyer"){
        $(".buyer-l").show();
        $(".seller-l").hide();
    }else{
        $(".buyer-l").hide();
        $(".seller-l").show();
    }
}



function parse_loan(container,data,urls) {
    var ads = data;
    var t = ads.length;
    var ul = "";
    for(var i = 0; i < t; i++){
        var li = '<li><a href="'+urls+'?id='+ads[i].id+'&loan_type='+ads[i].loan_type+'"  class="item-link item-content" ';
        li += 'data-context = \'{';
        li += '"loan_type": "'+ads[i].loan_type+'",';
        li += '"duration": "'+ads[i].duration+'",';
        li += '"total": "'+ads[i].total+'",';
        li += '"total_pay": "'+ads[i].total_pay+'",';
        li += '"g1_name": "'+ads[i].g1_name+'",';
        li += '"g1_phone": "'+ads[i].g1_phone+'",';
        li += '"g2_name": "'+ads[i].g2_name+'",';
        li += '"g2_phone": "'+ads[i].g2_phone+'",';
        li += '"status": "'+ads[i].status+'",';
        li += '"date_applied": "'+ads[i].date_applied+'",';
        li += '"payment_date": "'+ads[i].payment_date+'",'; //amount_to_give
        li += '"amount_to_give": "'+ads[i].amount_to_give+'",';
        li += '"amount": "'+ads[i].amount+'"}\'';
        li += '>';
        li += '<div class="item-inner"><div class="item-title-row">';
        li += '<div class="item-title">'+ads[i].loan_type+' Loan</div>';
        li += '<div class="item-after">&#8358; '+ads[i].amount+'</div></div>';
        li += '<div class="item-subtitle">'+ads[i].status+'</div>';
        li += '<div class="item-text">'+ads[i].date_applied+'</div></div></a></li>';

        ul += li;
    }

    //console.log(ul);


    $$(container).html(ul);
}