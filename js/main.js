// OBJECTS
var host_domain = "http://ymb.cherdack.ru";
var utils = null; // объект utils.js, утилиты
var vkapi = null;

// GLOBAL VARIABLES
var cur_active_tab; // текущая активная вкладка (объект)
var cur_active_tab_id = ""; // текущая активная вкладка (id)
var post_url = "../php/main.php"; // url для ajax-запросов
var viewer_id = -1; // ВК ID просматривающего приложение
var viewer_name = -1; // ВК имя просматривающего приложение
var viewer_sex = -1; // пол посетителя
var hash = -1;
var user_num = 1; // my user number
var user_was = 0; // was before in app
var stranger_num = 1; // номер юзера чужого блога + хэш приложения, взятый при его открытии
var prev_stranger_num = 0;
var test_mode = 0;
var showed_blog_on_start = 0;
var stranger_max_post_num = 0;
var user_max_post_num = 0;
var stranger_loaded_next_20 = 0;
var sorted_mode = 0;
var user_loaded_next_20 = 0;
var test_mode = 0;
var time_out = 0;

$(document).ready(function(){  
   if (time_out){
      timeOut();
   }
   else{
      if (!detectBrowser())
         init();
      else
         onBrowserUnsupported();
   }
});

function init(){
   utils = new Utils();
   vkapi = new VKapi();
   utils.log(2, "All objects are created");
   
   $('#wrapper_div').show();
   setDOMevents();
   
   VK.loadParams(document.location.href);
   viewer_id = VK.params.viewer_id;
   
   if (utils.undfnd(viewer_id) && test_mode == 0){
      document.location.href = 'http://admin.youmadbro.ru';
   }
   else{
      if (!utils.undfnd(VK.params.hash))
         stranger_num = VK.params.hash;
         
      VK.api('getProfiles',{
         uids: viewer_id,
         fields: "sex"
      },
      function(data){         
         if (data.response){
            viewer_name = data.response[0].first_name+" "+data.response[0].last_name;
            viewer_sex = data.response[0].sex;
            
            $.post(post_url,{ // is user here?
               a: "iTU",
               b: viewer_id,
               c: viewer_name,
               d: viewer_sex
            }, 
            function (result){
               var obj = result.split("_");
               user_num = obj[0];
               user_was = obj[1];               
               cur_active_tab = $('#ship_tab_a');
               switchTab("stranger_blog_tab_a", "showStrangerBlog("+stranger_num+")"); // вывод чужой вкладки
               vkapi.changeHeight();
            });
         }  
      });
   }
}

function setDOMevents(){   
   VK.callMethod("scrollSubscribe", 0);
   VK.addCallback("onScroll", onScroll);
}

function onScroll(a,b){ // method for onScroll VK event
   var dif = $('#content_div').height() - a;
   
   if (cur_active_tab_id === "stranger_blog_tab_a"){
      if (dif < 2000 && stranger_loaded_next_20 === 1 && !sorted_mode){
         stranger_loaded_next_20 = 0;
         getStrangerPosts();
      }
   }else{
      if (dif < 2000 && user_loaded_next_20 === 1){
         user_loaded_next_20 = 0;
         getUserPosts();
      }
   }
}

function timeOut(){
   var msg = $("<img />", {
      id: "old_brow_msg_img",
      src: "./img/time-out.png"
   });
   
   $('#wrapper_div').html(msg);
   $('#wrapper_div').show();
}