function createNewUser(){
   $.post(post_url,{ 
      a: "gMPN",
      b: user_num
   },
   function(data){
      user_max_post_num = utils.nullToZero(data);
      $.post(post_url,{ 
         a: "gBI",
         b: user_num,
         c: user_max_post_num
      }, 
      function (result){
         var obj = eval("(" + result + ")");
         
         if (obj.length == 0){
            var my_blog_initial_message_div = $("<div />",{id: "my_blog_main_div_message_1", class: "message_block"});
            my_blog_initial_message_div.html(my_blog_initial_message_text);
            my_blog_initial_message_div.css("padding", "177px 86px 0");
         
            var upload_button = $("<a />",{id: "upload_button", href:"javascript:void(0)", text:"Загрузить"});
            
            var my_blog_initial_message_2_div = $("<div />",{id: "my_blog_main_div_message_2", class: "message_block"});
            my_blog_initial_message_2_div.html(my_blog_initial_message_2_text);
            my_blog_initial_message_2_div.css("padding", "20px 86px 0");
            
            $('#my_blog_main_div').append(my_blog_initial_message_div);
            //$('#my_blog_main_div').append(upload_button);
            //$('#my_blog_main_div').append(my_blog_initial_message_2_div);
            
            /*$('#upload_button').upload({
               name: 'file',
               method: 'post',
               enctype: 'multipart/form-data',
               action: '../upload.php?user_num='+user_num,
               onSubmit: function(){
                  $('#upload_button').text('Отправка файла...');         
               },
               onComplete: function(data){
                  showMyBlog();
               }
            });
            
            $('#upload_button').parent().css({"height":"29px", "width":"100%", "padding":"45px 0 0", "cursor":"default"});*/
            
            vkapi.changeHeight();
         }
         else{
            var upload_second_button = $("<button />",{id: "upload_second_button", class: "cupid-green-light"});
            upload_second_span = $("<span />",{id: "upload_second_button_span", class: "post_social_panel_span", text: "Загрузить новое изображение"});
            upload_second_button.append(upload_second_span);
            
            var show_friends_button = $("<button />",{id: "show_friends_button", class: "cupid-green-light"});
            show_friends_span = $("<span />",{id: "show_friends_button_span", class: "post_social_panel_span", text: "Показать ленту друзьям"});
            show_friends_button.append(show_friends_span);
            
            var settings_button = $("<button />",{id: "settings_button", class: "cupid-green-light"});
            settings_span = $("<span />",{id: "settings_button_span", class: "post_social_panel_span", text: "Настройки"});
            settings_button.append(settings_span);
            
            //$('#my_blog_main_div').append(upload_second_button);
            //$('#my_blog_main_div').append(show_friends_button);
            //$('#my_blog_main_div').append(settings_button);
            
            $('#upload_second_button').upload({
               name: 'file',
               method: 'post',
               enctype: 'multipart/form-data',
               action: '../upload.php?user_num='+user_num,
               onSubmit: function(){
                  $('#upload_second_button').text('Отправка файла...');         
               },
               onComplete: function(data){
                  utils.log("upload.onComplete: "+data)
                  showMyBlog();
               }
            });
            
            $('#show_friends_button').click(function(){
               VK.api('wall.post', // получаем имя и пол посетителя. и детектим кам ин
               {
                  owner_id: viewer_id,
                  message: "Глянь картинки: vk.com/app3300251#"+user_num
               },
               function(data){});
            });
            
            upload_second_button.css("width", "236px");
            $('#show_friends_button').attr("style","margin-left: -134px");
            $('#upload_second_button').parent().css({"margin-left":"156px", "cursor":"default", "float":"left"});
            $('#upload_second_button').parent().children("form").children("input").css({"marginLeft":"27px", "marginTop":"-59px"});
            
            getUserPosts();
         }
      });
   });
}// JavaScript Document

function getUserPosts(){
   $.post(post_url,{ 
         a: "gBI",
         b: user_num,
         c: user_max_post_num
      },
      function (result){
         user_max_post_num -= 21;
         var obj = eval("(" + result + ")");
         
         for (var i = 0; i < obj.length; i++)
            createPost(obj[i], 2);
         
         user_loaded_next_20 = 1;
      });
}

function getStrangerName(strngr_num){
   $.post(post_url,{ 
         a: "gSNM",
         b: strngr_num
      }, 
      function (result){
         $('#stranger_blog_tab_a').text(result);
      });
}

function getStrangerLink(strngr_num){
   $.post(post_url,{ 
         a: "gSVK",
         b: strngr_num
      }, 
      function (result){
         $('#vk_link_a').attr("href", "http://vk.com/id"+result);
      });
}