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

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('main-page-2', function (page) {

    //var s_id = sessionStorage.getItem("staff_id");
    if(staff_login()){
        $$("#staff-home").click();
    }else if(student_login()){
        $$("#home").click();
    }

    var ft = sessionStorage.getItem("ft");
    //console.log(ft);
    if((ft == null) || (ft == "")){
        //show splash
        sessionStorage.setItem("ft",1);
        document.getElementById('splash-page').style.display = "block";

        setTimeout(function(){
                show_main()
            },
            5000);
    }else{
        //show main
        show_main();
    }

    //show_main();


    function show_main()
    {
        //console.log("hello");
        document.getElementById('splash-page').innerHTML = "";
        document.getElementById('splash-page').style.display = "none";
        $$("#splash-page").remove();
        $$("#main-page").removeClass('hide');
        //document.getElementById('main-page').style.display = "block";

        //myApp.onPageInit('index');
    }
    //console.log("hello");
    // run createContentPage func after link was clicked
    $$('.act-btn').on('click', function (e) {
        e.preventDefault();
        var class_n = $$(this).attr("data-class");
        //myApp.alert(class_n,"Class Name");
        $$(".act-btn").removeClass('button-fill');
        $$(this).addClass('button-fill');
        $$(".log-page").addClass('hide');
        $$("."+class_n).removeClass('hide');
    });


});
//act-btn

myApp.onPageInit('index-page',function (page) {
    //myApp.initImagesLazyLoad('.page');

    load_featured(6);

    load_recent();

    load_category_campus();

    update_stat();

    $(".logout").on("click",function (e) {
        triggerLogout();
    });
    //load featured
}).trigger();


myApp.onPageInit('ads-category',function (page) {

    var categories = sessionStorage.getItem("session_category");

    if((categories == null) || (categories == "")){
        categories = localStorage.getItem("session_category");
    }


    //console.log(JSON.parse("categories"));

    var category_json = JSON.parse(categories);

    //console.log(category_json);

    var ul = "";

    for(var i = 0; i < category_json.length; i++){
        var li= '<a href="view_category.html?name='+category_json[i].name+'&icon='+category_json[i].icon+'&id='+category_json[i].id+'" data-id="'+category_json[i].id+'" class="item-link save-current-cat">';
        li += '<div class="item-content">';
        li += '<div class="item-inner">';
        li += '<div class="item-title"><i class="fa fa-stack '+category_json[i].icon+'"></i> ';
        li += category_json[i].name;
        li += ' ('+category_json[i].ads+')';
        li += '</div></div></div></a>';

        ul += li;
    }

    $$("#list-cats").html(ul);

});


myApp.onPageInit('ads-campus',function (page) {

    var categories = sessionStorage.getItem("session_campus");

    if((categories == null) || (categories == "")){
        categories = localStorage.getItem("session_campus");
    }


    //console.log(JSON.parse("categories"));

    var category_json = JSON.parse(categories);

    //console.log(category_json);

    var ul = "";

    for(var i = 0; i < category_json.length; i++){
        var li= '<a href="view_campus.html?name='+category_json[i].name+'&id='+category_json[i].id+'" data-id="'+category_json[i].id+'" class="item-link save-current-cat">';
        li += '<div class="item-content">';
        li += '<div class="item-inner">';
        li += '<div class="item-title">';
        li += category_json[i].name;
        li += ' ('+category_json[i].ads+')';
        li += '</div></div></div></a>';

        ul += li;
    }

    $$("#list-cats-campus").html(ul);

});


myApp.onPageInit('view-category',function (page) {

    var thisPageQuery = page.query;



    var category_id;

    category_id = thisPageQuery.id;

    //console.log(category_id);

    load_page();

    //var the_



    var ptrContent = $$('.pull-to-refresh-content');
    // Add 'refresh' listener on it
    ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            load_page();
            // When loading done, we need to reset it
            myApp.pullToRefreshDone();
        }, 2000);

    });


    function load_page(){

        myApp.showIndicator();

        //check for online ads

        $$.ajax({
            url: url,
            data:{
                'load-category-ads': '',
                'cat_id': category_id
            },
            type: 'get',
            dataType: 'json',
            crossDomain: true,
            timeout: 30000,
            success: function (f) {
                //save for offline usage

                var offline_ads = f.ads;

                localStorage.setItem("cat_ads_"+category_id, JSON.stringify(offline_ads));

                parse_featured_ads("#cat-ads-list",offline_ads);
                myApp.hideIndicator();
            },
            error: function (e) {

                console.log(e.responseText);
                var f = localStorage.getItem("cat_ads_"+category_id);
                if((f == "") || (f == null)) {
                    myApp.hideIndicator();

                    $("#cat-ads-list").html("<em>Network error, pull down to refresh page!</em>")
                    return;
                }
//            if(f == null) return;
                var ads = JSON.parse(localStorage.getItem("cat_ads_"+category_id));

                parse_featured_ads("#cat-ads-list",ads);
                myApp.hideIndicator();
            }
        });
    }
});

myApp.onPageInit('view-campus',function (page) {

    var thisPageQuery = page.query;



    var campus_id;

    campus_id = thisPageQuery.id;

    //console.log(category_id);

    load_campus_page();

    //var the_



    var ptrContent = $$('.pull-to-refresh-content');
    // Add 'refresh' listener on it
    ptrContent.on('refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            load_campus_page();
            // When loading done, we need to reset it
            myApp.pullToRefreshDone();
        }, 2000);

    });


    function load_campus_page(){

        myApp.showIndicator();

        //check for online ads

        $$.ajax({
            url: url,
            data:{
                'load-campus-ads': '',
                'campus_id': campus_id
            },
            type: 'get',
            dataType: 'json',
            crossDomain: true,
            timeout: 30000,
            success: function (f) {
                //save for offline usage

                var offline_ads = f.ads;

                localStorage.setItem("campus_ads_"+campus_id, JSON.stringify(offline_ads));

                parse_featured_ads("#campus-ads-list",offline_ads);
                myApp.hideIndicator();
            },
            error: function (e) {

                console.log(e.responseText);
                var f = localStorage.getItem("campus_ads_"+campus_id);
                if((f == "") || (f == null)) {
                    myApp.hideIndicator();

                    $("#campus-ads-list").html("<em>Network error, pull down to refresh page!</em>")
                    return;
                }
//            if(f == null) return;
                var ads = JSON.parse(localStorage.getItem("campus_ads_"+campus_id));

                parse_featured_ads("#campus-ads-list",ads);
                myApp.hideIndicator();
            }
        });
    }
});


myApp.onPageInit('featured-ads',function (page) {
    var rand = Math.floor(Math.random() * 3);
    if(rand == 0){
        var class_c = "preloader-blue";
    }else if(rand == 1){
        var class_c = "preloader-amber";
    }else if(rand == 2){
        var class_c = "preloader-green";
    }else{
        var class_c = "preloader-red";
    }

    $(".pre-load").addClass(class_c);

    $$.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data:{
            'load-featured-ads': ''
        },
        cache: true,
        crossDomain: true,
        timeout: 30000,
        success:function (f) {

            //console.log(f);

            var ads = f.ads;


            //f-ads-list
            parse_featured_ads("#f-ads-list",ads);
            $$(".f-lists").removeClass("hide");
            $$(".loader").remove();
            $$("img.ks-demo-lazy").trigger("lazy");
            localStorage.setItem("featured_ads_lists", JSON.stringify(ads));



        },
        error: function (e) {

            //console.log(e.responseText);
            //myApp.hideIndicator();
            //myApp.alert("<span style='color: #fd0023;'>Network error...</span>","Fetch Error");

            //load offline data

            var f = localStorage.getItem("featured_ads_lists");
            if(f == "") return;
            if(f == null) return;
            var ads = JSON.parse(localStorage.getItem("featured_ads_lists"));

            parse_featured_ads("#f-ads-list",ads);
            $$(".f-lists").removeClass("hide");
            $$(".loader").remove();
            $$("img.ks-demo-lazy").trigger("lazy");




        }
    });






});


myApp.onPageInit('submit-ad',function (page) {
    //show_loader("please wait...");


    var user_id = localStorage.getItem("uwansell_user_id");

    if((user_id == null) || (user_id == "")){
        $(".log-user").hide();
    }else{
        $(".un-log-user").hide();
    }


    if(is_login()){

        $("[name=user_id]").val(user_id);

        $(".embeded-login-form").remove();
    }else{
        //myApp.alert("Login");
        $(".embeded-post-form").addClass('hide');
    }


    var categories = sessionStorage.getItem("session_category");

    if((categories == null) || (categories == "")){
        categories = localStorage.getItem("session_category");
    }

    var cats = JSON.parse(categories);

    var ul = '<option value="">Select Category</option>';

    for(var i = 0; i < cats.length; i++){
        var li = "<option value='"+cats[i].id+"'>";
        li += cats[i].name;
        li += "</option>";

        ul += li;
    }

    $("[name=category]").html(ul);


    var campus = sessionStorage.getItem("session_campus");

    if((campus == null) || (campus == "")){
        campus = localStorage.getItem("session_campus");
    }

    var camps = JSON.parse(campus);

    var ul2 = '';
    for(var ii = 0; ii < camps.length; ii++){
        var li2 = "<option value='"+camps[ii].id+"'>";
        li2 += camps[ii].name;
        li2 += "</option>";

        ul2 += li2;
    }

    $("[name=campus]").html(ul2);


    //$()

    $("#add-login-form").on("submit",function (e) {
        e.preventDefault();
        //var datas = $("#add-login-form").serialize();

        //console.log($("[name=password]").val());
        show_loader("Loggin in, please wait");
        $$.ajax({
            url: url,
            data:{
                'login': '',
                'email': $("[name=email]").val(),
                'password': $("[name=password]").val()
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $$("[name=email]").val('');
                    $$("[name=password]").val('');

                    $(".embeded-login-form").remove();

                    $(".embeded-post-form").removeClass('hide');


                    var info = f.record;
                    localStorage.setItem("fname",info['fname']);
                    localStorage.setItem("uwansell_user_id",info['user_id']);
                    localStorage.setItem("lname",info['lname']);
                    localStorage.setItem("email",info['email']);
                    localStorage.setItem("phone",info['phone']);
                    myApp.alert("Welcome "+info['fname']+" "+info['lname']);

                    update_stat();


                    $("[name=user_id]").val(info['user_id']);

                    $(".page").mLoading('hide');
                    //$$("#home").click();
                }else {
                    myApp.hidePreloader();

                    // myApp.addNotification({
                    //     message: f.msg
                    // });

                    $(".page").mLoading('hide');
                    show_toast(f.msg,"red");


                }
            },
            error:function(err){
                console.log(err.responseText);
                $(".page").mLoading('hide');
                show_toast("Network error, try again","red");

            },
            timeout: 30000
        });

    });



    $("[name=category]").change(function (e) {
        var category = $(this).val();

        $.ajax({
            'url' : base_url + "extra_fields_mobile.php",
            'type': "get",
            'data':{
                'category': category
            },
            success: function (f) {
                //console.log(f);
                $(".extras").html(f);
            }
        });
    });

    $("#posting-form").on("submit",function (event) {
       event.preventDefault();

       var images = $("[name=images]").val();

       if(images == ""){
           myApp.alert("Error, You did not upload any image","Error!");

           return;
       }

       //send form to server and wait for message

        show_loader("Please wait while we submit your ads");

        var datas = $("#posting-form").serialize();

        $$.ajax({
           url: url+"?"+datas,
           type: 'post',
           dataType: 'json',
           crossDomain: true,
           timeout: 45000,
           success: function (f) {
               console.log(f);
               $(".page").mLoading("hide");
               myApp.alert("<p style='color: #00DC12'>Your ads has been submitted for review, you will receive a congratulatory email immediately we approve your ad</p>","Success!");

               $(".extras").html('');
               $("[name=title]").val('');
               $("[name=category]").val('');
               $("[name=campus]").val('');
               $("[name=price]").val('');
               $("[name=ads_desc]").val('');

               $("[name=images]").val('');
           },
            error: function (e) {
                console.log(e.responseText);
                $(".page").mLoading("hide");
                show_toast("Network error, try again","red");
            }
        });

       //posting-form
    });


    var manualUploader = new qq.FineUploader({
        element: document.getElementById('fine-uploader-manual-trigger'),
        template: 'qq-template-manual-trigger',
        request: {
            endpoint: base_url + 'upload.php'
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

                $("[name=images]").val($("[name=images]").val()+"\n"+image_name);


            }
        }
    });

    qq(document.getElementById("trigger-upload")).attach("click", function() {
        manualUploader.uploadStoredFiles();
    });
});


myApp.onPageInit('login-page', function (page) {

    $("#login-form").on("submit",function (e) {
        e.preventDefault();
        //var datas = $("#add-login-form").serialize();

        //console.log($("[name=password]").val());
        show_loader("Loggin in, please wait");
        $$.ajax({
            url: url,
            data:{
                'login': '',
                'email': $("[name=email]").val(),
                'password': $("[name=password]").val()
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $$("[name=email]").val('');
                    $$("[name=password]").val('');

                    var info = f.record;
                    localStorage.setItem("fname",info['fname']);
                    localStorage.setItem("uwansell_user_id",info['user_id']);
                    localStorage.setItem("lname",info['lname']);
                    localStorage.setItem("email",info['email']);
                    localStorage.setItem("phone",info['phone']);
                    myApp.alert("Welcome "+info['fname']+" "+info['lname']);

                    $(".page").mLoading('hide');

                    update_stat();
                    $$("#home").click();
                }else {
                    myApp.hidePreloader();

                    // myApp.addNotification({
                    //     message: f.msg
                    // });

                    $(".page").mLoading('hide');
                    show_toast(f.msg,"red");


                }
            },
            error:function(err){
                console.log(err.responseText);
                $(".page").mLoading('hide');
                show_toast("Network error, try again","red");
            },
            timeout: 30000
        });

    });


    $("#fb-login").on("click",function (e) {
       e.preventDefault();
       loginWithFB();
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

myApp.onPageInit("user_ads",function (page) {
    if(!is_login()){
        window.location = "main.html";
    }

    show_loader("Please wait...");

    var user_id = localStorage.getItem("uwansell_user_id");

    $("body").on("click",".delete-ads",function (e) {
       var id = $(this).data("id");

       var user_id = localStorage.getItem("uwansell_user_id");
       var c = myApp.confirm("Are you sure you want to delete this ad?",function (ev) {

           $$.ajax({
               url: url,
               type: 'post',
               data:{
                   'delete_user_ads': '',
                   'user_id': user_id,
                   'id': id
               },
               dataType: 'json',
               crossDomain: true,
               timeout: 45000,
               success: function(f){
                   $("[data-div="+id+"]").remove();
                   show_toast("Advert deleted successfully","green");
               },
               error:function (e) {
                   console.log(e.responseText);
                   show_toast("Network error","red");
               }
           });
       });


    });
    load_my_ads();
    //load my ads

    function load_my_ads(){
        $$.ajax({
            url: url,
            type: 'get',
            data:{
                'load_user_ads': '',
                'user_id': user_id
            },
            dataType: 'json',
            crossDomain: true,
            timeout: 45000,
            success: function(f){

                //console.log(f);
                var ads = f.ads;
                var t = ads.length;
                var ul = "";
                for(var i = 0; i < t; i++){

                    var li = '<div class="card"  data-div="'+ads[i].id+'"><div class="card-content">';
                    li += '<div class="card-header">'+ads[i].title+'</div>';
                    li += '<div class="card-content-inner">';
                    li += '<a href="view.html?id='+ads[i].id+'" data-ads-id="'+ads[i].id+'" class="button button-fill" ';
                    li += 'data-context = \'{';
                    li += '"title": "'+ads[i].title+'",';
                    li += '"campus": "'+ads[i].campus+'",';
                    li += '"category": "'+ads[i].category+'",';
                    li += '"price": "'+ads[i].price+'"}\'';
                    li += '>';
                    li += 'View</a>';
                    li += '<br>';
                    li += '<a href="#" class="delete-ads button button-fill color-red" data-id="'+ads[i].id+'"> <i class="fa fa-trash-o"></i> Delete Ad</a>';
                    li += '</div></div></div>';

                    ul += li;
                }

                //console.log(ul);


                $("#my-list").html(ul);

                if(t == 0){
                    $("#my-list").html("<h3>You do not have any active ad!</h3>");
                }

                $(".page").mLoading("hide");


                //console.log(f);
            },
            error: function (e) {
                $(".page").mLoading("hide");
                show_toast("Network error...","red");
            }
        });
    }

});
myApp.onPageInit("profile",function (page) {

    if(!is_login()){
        window.location = "main.html";
    }
    $(".user-name").html(localStorage.getItem("fname")+" "+localStorage.getItem("lname"));
    $("#profile_sname").val(localStorage.getItem("fname"));
    $("#profile_oname").val(localStorage.getItem("lname"));
    $("#profile_phone").val(localStorage.getItem("phone"));
    $("#profile_email").val(localStorage.getItem("email"));

    $$("#update-form").on("submit",function (e) {
        e.preventDefault();
       show_loader("Updating profile, please wait");

       $$.ajax({
           url: url,
           data:{
               'user_id': localStorage.getItem("uwansell_user_id"),
               'fname': $("#profile_sname").val(),
               'lname': $("#profile_oname").val(),
               'phone': $("#profile_phone").val(),
               'update-profile': ''
           },
           type: 'post',
           dataType: 'json',
           crossDomain: true,
           timeout: 45000,
           success: function (f) {
               $(".page").mLoading('hide');
               show_toast(f.msg,"green");
               localStorage.setItem("fname",$("#profile_sname").val());
               localStorage.setItem("lname",$("#profile_oname").val());
               localStorage.setItem("phome",$("#profile_phone").val());
           },
           error: function (e) {
               $(".page").mLoading('hide');
               show_toast("Network error...","red");
           }
       });
    });


    $$("#stu-password-form").on('submit',function (e) {
        e.preventDefault();

        var pass = $$("#password").val();
        var c_pass = $$("#confirm_password").val();

        if(pass !== c_pass){
            myApp.alert("Password does not match");
            return false;
        }
        show_loader("Updating password,<br/>Please Wait...");

        $$.ajax({
            url: url,
            data: {
                'update_stu_password': '',
                'password' : pass,
                'user_id' : sessionStorage.getItem("uwansell_user_id")
            },
            type: 'POST',
            dataType: 'json',
            crossDomain : true,
            cache: false,
            success:function(f){
                var ok = f.ok;
                if(ok == 1){
                    $(".page").mLoading('hide');
                    show_toast(f.msg,"green");
                    $("#password").val('');
                    $("#confirm_password").val('');
                }else {
                    $(".page").mLoading('hide');
                    show_toast ('Unable to update password',"red");

                }
            },
            error:function(err){
                //console.log(err.responseText);
                $(".page").mLoading('hide');
                show_toast("Network error, try again","red");
            },
            timeout: 60000
        });
    });
});
myApp.onPageInit('register-page', function (page) {

    $("#fb-reg-login").on("click",function (e) {
       e.preventDefault();
       loginWithFB();
    });
   $("#register-form").on("submit",function (e) {
      e.preventDefault();

       show_loader("Processing, please wait");
       $$.ajax({
           url: url,
           data:{
               'register': '',
               'email': $("[name=email]").val(),
               'password': $("[name=password]").val(),
               'phone': $("#phone").val(),
               'fname': $("#fname").val(),
               'lname': $("#lname").val()
           },
           type: 'POST',
           dataType: 'json',
           crossDomain : true,
           cache: false,
           success:function(f){
               var ok = f.ok;
               if(ok == 1){
                   //myApp.alert("Welcome "+info['fname']+" "+info['lname']);

                   $(".page").mLoading('hide');

                   show_toast(f.msg,"blue");
               }else {
                   myApp.hidePreloader();

                   // myApp.addNotification({
                   //     message: f.msg
                   // });

                   $(".page").mLoading('hide');
                   myApp.alert(f.msg,"Registration Error");


               }
           },
           error:function(err){
               console.log(err.responseText);
               $(".page").mLoading('hide');
               show_toast("Network error, try again","red");
           },
           timeout: 30000
       });
   });
});

myApp.onPageInit("search-page",function () {
    var categories = sessionStorage.getItem("session_category");

    if((categories == null) || (categories == "")){
        categories = localStorage.getItem("session_category");
    }

    var cats = JSON.parse(categories);

    var ul = '<option value="0">All Categories</option>';

    for(var i = 0; i < cats.length; i++){
        var li = "<option value='"+cats[i].id+"'>";
        li += cats[i].name;
        li += "</option>";

        ul += li;
    }

    $("[name=category]").html(ul);


    var campus = sessionStorage.getItem("session_campus");

    if((campus == null) || (campus == "")){
        campus = localStorage.getItem("session_campus");
    }

    var camps = JSON.parse(campus);

    var ul2 = '<option value="0">All Campuses</option>';
    for(var ii = 0; ii < camps.length; ii++){
        var li2 = "<option value='"+camps[ii].id+"'>";
        li2 += camps[ii].name;
        li2 += "</option>";

        ul2 += li2;
    }

    $("[name=campus]").html(ul2);

    /*$$("#input").input(function (e) {
        console.log(e);
    });*/

    /*var range = app.range.create({
        el: '#price',
        on: {
            change: function () {
                console.log(range.price);
            }
        }
    })*/

    $$("#search-form").on("submit",function (e) {
       e.preventDefault();


       var r = "search_result.html?"+$("#search-form").serialize();
       $$("[data-id=search]").attr('href',r).html(r);
       $$(".search-link").click();
    });

    $$("#submit-search").on("click",function (e) {
        var q = $$("#q").val();
        if(q == ""){
            show_toast("Enter a search term...","red");
            return;
        }
        var r = "search_result.html?"+$("#search-form").serialize();
        $$("[data-id=search]").attr('href',r);
        $$(".search-link").click();
    });
});

myApp.onPageInit("search-result",function (page) {
    myApp.showIndicator();
    var thisPageQuery = page.query;

    var search_query = thisPageQuery.q;
    var search_category = thisPageQuery.category;
    var search_campus = thisPageQuery.campus;
    var search_price = thisPageQuery.price;

    //ajax

    $$.ajax({
       url: url,
       type: 'get',
       dataType: 'json',
       crossDomain: true,
       cache: true,
       timeout: 30000,
       data:{
           'load_search': '',
           'q': search_query,
           'campus': search_campus,
           'category': search_category,
           'price': search_price
       } ,
        success: function (f) {
           myApp.hideIndicator();
            console.log(f);
            var ads = f.ads;
            //var a;

            $("#s-q").html(f.query);
            $("#s-camps").html(f.camps);
            $("#s-cats").html(f.cats);
            $("#s-counts").html(f.total);

            parse_featured_ads("#search-ads-list",ads);

            if(f.total == 0){
                $("#total-err").html("No result found...");
            }
        },
        error: function (e) {
            myApp.hideIndicator();
            //console.log(e);
            show_toast("Network error, try again","red");
        }
    });

});

myApp.onPageInit("view-ads", function (page) {
   //view-ads
    myApp.showIndicator();
    var q = page.query;
    var ads_id = q.id;
    var sender_msg = "";
    var sender_phone = "";
    var msgs = "";

    //load ads details

    var current_ads = sessionStorage.getItem("ads_info_"+ads_id);
    if(current_ads != null ) {
        $(".page-data").removeClass('hide');
        myApp.hideIndicator();
        show_ads_on_page(JSON.parse(current_ads));
    }else {
        $$.ajax({
            url: url,
            type: 'get',
            data: {
                'ads_details': '',
                'ads_id': ads_id
            },
            dataType: 'json',
            timeout: 30000,
            success: function (f) {
                $(".page-data").removeClass('hide');
                myApp.hideIndicator();
                var ads = f.ads;

                show_ads_on_page(f);
                sessionStorage.setItem("ads_info_"+ads_id,JSON.stringify(f));

                //console.log(f);

                //document.querySelector('.prev-siema').addEventListener('click', () => mySiema.prev());
                //document.querySelector('.next-siema').addEventListener('click', () => mySiema.next());
            },
            error: function (e) {
                myApp.hideIndicator();
                show_toast("Network error...","red");
            }
        });

    }

    $("#calls").on("click",function (e) {
       e.preventDefault();

       send_whatsapp(sender_phone,sender_msg);
    });

    $$("#report-ads").on("click",function (e) {
        e.preventDefault();
        $(".report-page").fadeIn("slow");
    });

    $$("#report-form").on("submit",function (e) {
       e.preventDefault();

        show_toast("Sending your request...","blue");

       $$.ajax({
          url: url,
          type: 'post',
          data:{
              'report_ad': '',
              'ads_id': ads_id,
              'name': $$("#name").val(),
              'reason': $$("#reason").val()
          },
           timeout: 45000,
           success: function(){
              show_toast("Your report request is successful","green");
              $$("#name").val('');
              $$("#reason").val('');
              $(".report-page").fadeOut('slow');
           },
           error: function (e) {
               show_toast("Network error...","red");
               //$("report-form").fadeOut('slow');
           }
       });
    });


    function show_ads_on_page(ad){
    //console.log(ad);
    //return;
    var f = ad;
    var ads = f.ads;
    var img = f.img;
    var details = f.details;
    var s = "";

    $("#ads-desc").html(ads.ads_desc);
    $("#ads-price").html(ads.price);
    $("#ads-user").html(ads.user);
    $("#ads-phone").html(ads.phone);
    $("#ads-date").html(ads.date_posted);
    //$("#calls").attr("href","tel:"+ads.phone);

    sender_msg = "Hello "+ads.user+" , I am interested in your ads titled *"+ads.title+"* posted on uwansell";
    sender_phone = ads.phone;
    for(var i = 0; i < img.length; i++){
        s += '<div> <img src="'+img[i]+'" alt="'+ads.title+'" class="lazy lazy-fadeIn ks-demo-lazy img-responsive" data-src="'+img[i]+'"> </div>';
    }

    var extras = "";

    for(var i = 0; i < details.length; i++){
        extras += "<h4>"+details[i].name+"</h4>";
        extras += details[i].value;
    }

    $(".ads-extra").html(extras);

    $(".siema").html(s);
    const mySiema = new Siema({
        loop: true
    });

    $(".next-siema").on("click",function (e) {
        e.preventDefault();
        mySiema.next();
    });

    $(".prev-siema").on("click",function (e) {
        e.preventDefault();
        mySiema.prev();
    });
}
});


function triggerLogout(){
    localStorage.removeItem("uwansell_user_id");
    localStorage.removeItem("fname");
    localStorage.removeItem("lname");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    myApp.alert("You have logout successfully","Logout");
    update_stat();
}

function load_featured(t) {

    var f = localStorage.getItem("featured_ads");
    if((f != "") && (f != null))
    {
        var ads = JSON.parse(localStorage.getItem("featured_ads"));

        parse_featured_ads("#ads-list",ads);
    }

    $$.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data:{
            'load-featured': '',
            'total': t
        },
        cache: true,
        crossDomain: true,
        timeout: 30000,
        success:function (f) {

            var t = f.total;

            var ads = f.ads;

            parse_featured_ads("#ads-list",ads);

            localStorage.setItem("featured_ads", JSON.stringify(ads));

            //$("#ads-list").html(ul);

            $$("img.ks-demo-lazy").trigger("lazy");

        },
        error: function (e) {
            //myApp.hideIndicator();
            //myApp.alert("<span style='color: #fd0023;'>Network error...</span>","Fetch Error");

            //load offline data

            //check featured_ads
            var f = localStorage.getItem("featured_ads");
            if(f == "") return;
            if(f == null) return;
            var ads = JSON.parse(localStorage.getItem("featured_ads"));


            parse_featured_ads("#ads-list",ads);


        }
    });
}

function load_recent() {
    //load-recent-ads

    var f = localStorage.getItem("recent_ads");
    if((f != "") && (f != null))
    {
        var ads = JSON.parse(localStorage.getItem("recent_ads"));

        parse_featured_ads("#recent-ads-list",ads);
    }

    $$.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data:{
            'load-recent-ads': ''
        },
        cache: true,
        crossDomain: true,
        timeout: 60000,
        success:function (f) {
            //console.log(f);
            var t = f.total;

            var ads = f.ads;


            localStorage.setItem("recent_ads", JSON.stringify(ads));

            parse_featured_ads("#recent-ads-list",ads);

            $$("img.ks-demo-lazy").trigger("lazy");

        },
        error: function (e) {
            //myApp.hideIndicator();
            //myApp.alert("<span style='color: #fd0023;'>Network error...</span>","Fetch Error");

            //load offline data

            //check featured_ads
            show_toast("Network error, try again","red");
            //console.log(e);
        }
    });
}

function parse_featured_ads(container, data) {

    var ads = data;
    var t = ads.length;
    var ul = "";
    for(var i = 0; i < t; i++){
        var li = '<li><a href="view.html?id='+ads[i].id+'" data-ads-id="'+ads[i].id+'" class="item-link item-content" ';
        li += 'data-context = \'{';
        li += '"title": "'+ads[i].title+'",';
        li += '"campus": "'+ads[i].campus+'",';
        li += '"category": "'+ads[i].category+'",';
        li += '"price": "'+ads[i].price+'"}\'';
        li += '>';
        li += '<div class="item-media">';
        li += '<img class="lazy lazy-fadeIn ks-demo-lazy" alt="'+ads[i].title+'" data-src="'+ads[i].img+'" src="'+ads[i].img+'" width="80"/></div>';
        li += '<div class="item-inner"><div class="item-title-row">';
        li += '<div class="item-title">'+ads[i].title+'</div>';
        li += '<div class="item-after">&#8358; '+ads[i].price+'</div></div>';
        li += '<div class="item-subtitle">'+ads[i].category+'</div>';
        li += '<div class="item-text">'+ads[i].campus+'</div></div></a></li>';

        ul += li;
    }

    //console.log(ul);


    $$(container).html(ul);
}

function load_category_campus() {
    //check if there is session_cats

    var session_cats = sessionStorage.getItem("session_category");

    if((session_cats == null) || (session_cats == "")){

        //load from internet

        $$.ajax({
           url: url,
           type: 'get',
            data: {
               'load_campus_category': ''
            },
           dataType: 'json',
           crossDomain: true,
           timeout: 30000,
           success : function (f) {
               //console.log(f);

               localStorage.setItem("session_category", JSON.stringify(f.category));
               localStorage.setItem("session_campus", JSON.stringify(f.campus));

               sessionStorage.setItem("session_category", JSON.stringify(f.category));
               sessionStorage.setItem("session_campus", JSON.stringify(f.campus));
               //save local and session storage
           },
            error: function (e) {
               console.log(e.responseText);
                //load local storage
            }
        });
    }
    //check for internet cats

    //check for local cats

    //console.log(session_cats);
}


function update_stat() {
    var user_id = localStorage.getItem("uwansell_user_id");

    if((user_id == null) || (user_id == "")){
        $(".log-user").hide();
        $(".un-log-user").show();
    }else{
        $(".log-user").show();
        $(".un-log-user").hide();
    }
}

function loginWithFB(){

    if (window.cordova.platformId == "browser") {
        facebookConnectPlugin.browserInit(appId, version);
        // version is optional. It refers to the version of API you may want to use.
    }
    facebookConnectPlugin.login(["public_profile","email"],function(result){
        //calling api after login success
        facebookConnectPlugin.api("/me?fields=email,name,picture",
            ["public_profile","email"]
            ,function(userData){
                //API success callback
                //alert(JSON.stringify(userData));


                var user_fb_id = userData.id;
                var user_email = userData.email;
                var user_name = userData.name;

                //alert(user_fb_id);
                show_loader("Please wait while we log you in!");
                //return;
                //send it to api

                $$.ajax({
                   url: url,
                   type: 'post',
                   dataType: 'json',
                   timeout: 30000,
                   data:{
                       'fb_login': '',
                       'fb_id': user_fb_id,
                       'fb_name': user_name,
                       'fb_email': user_email
                   },
                    success: function (f) {

                        var info = f.record;
                        localStorage.setItem("fname",info['fname']);
                        localStorage.setItem("uwansell_user_id",info['user_id']);
                        localStorage.setItem("lname",info['lname']);
                        localStorage.setItem("email",info['email']);
                        localStorage.setItem("phone",info['phone']);
                        myApp.alert("Welcome "+info['fname']+" "+info['lname']);

                        $(".page").mLoading('hide');

                        update_stat();
                        $$("#home").click();
                    },
                    error: function (e) {
                        show_toast("Network error, try again","red");
                    }
                });
                //api save or update

                //login here
            },function(error){
                //API error callback
                show_toast("Network error, try again","red");
                //localStorage.setItem("cpy",JSON.stringify(error));
            });
    },function(error){
        //authenication error callback
        //alert(JSON.stringify(error));
        show_toast("Network error, try again","red");
        //localStorage.setItem("cpy",JSON.stringify(error));
    });
}


function international_number(number){
    //var l = number.length;

    var int_numbers = "234"+number;

    return int_numbers;
}

function send_whatsapp(number,msg) {
    var text = encodeURI(msg);
    number = "234"+number;
    var m = "https://api.whatsapp.com/send?phone="+number+"&text="+text;

    window.open(m);
}