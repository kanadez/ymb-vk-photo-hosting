function switchTab(clicked_tab_id, callback_function){ // переключает вкалдку
   if (cur_active_tab_id != clicked_tab_id){
      cur_active_tab.removeClass("tab");
      cur_active_tab.addClass("tab_unactive");
      clicked_tab = $('#'+clicked_tab_id);
      clicked_tab.addClass("tab");
      clicked_tab.removeClass("tab_unactive");
      cur_active_tab = clicked_tab;
      eval(callback_function);
      vkapi.changeHeight();
   }
}

function showStrangerBlog(strngr_num){ // выводит контент вкладки Чужой блог   
   vkapi.setHash(strngr_num);
   getStrangerName(strngr_num);
   prev_stranger_num = stranger_num;
   
   if (strngr_num == 1){
      utils.log("stranger is ymb"+stranger_num);
      stranger_num = 1;
      var stranger_blog_main_div = $("<div />",{id: "stranger_blog_main_div", class: "content_div_block"});
      var upload_button_div = $("<div />",{id: "upload_button_div", class: "content_div_block"});
      upload_button_div.css({"width": "236px"});
      
      //############################ кнопка загрузки на общую стену приложения
      
      var upload_second_button = $("<button />",{id: "upload_second_button", class: "cupid-green-light"});
      upload_second_span = $("<span />",{id: "upload_second_button_span", class: "post_social_panel_span", text: "Загрузить изображение"});
      upload_second_button.append(upload_second_span);   
      upload_button_div.append(upload_second_button);
      
      var text_button_div = $("<div />",{id: "text_button_div", class: "content_div_block"});
      text_button_div.css({"width": "236px", "float":"right", "margin-right":"186px","margin-top":"-54px"});
      
      var post_text_button = $("<button />",{id: "post_text_button", class: "cupid-green-light"});
      post_text_span = $("<span />",{id: "post_text_button_span", class: "post_social_panel_span", text: "Добавить текст"});
      post_text_button.append(post_text_span);   
      text_button_div.append(post_text_button);
      
      
      post_text_button.click(function(){
         $.post(post_url,{ 
            a: "lTH",
            b: user_num
         }, 
         function (result){
            if (result == 0){
               $('#text_post_input_textarea').val("");
               if ($('#text_post_input_div').is(":visible"))
                  $('#text_post_input_div').hide();
               else $('#text_post_input_div').show();
            }
            else{
               $('#load_message2_div').css("color","rgb(204,118,118)");
            }  
         });
      });
      
      var text_post_input_div = $("<div />",{id: "text_post_input_div"});
      var text_post_input_textarea = $("<textarea />",{id: "text_post_input_textarea", "placeholder":"Введите текст здесь..."});
      var add_text_button = $("<button />",{id: "add_text_button", class: "cupid-green-light"});
      add_text_span = $("<span />",{id: "add_text_button_span", class: "post_social_panel_span", text: "Добавить"});
      add_text_button.append(add_text_span);
      add_text_button.css({"float":"right", "margin-right":"0px", "margin-top":"10px"});
      text_post_input_div.append(text_post_input_textarea);
      text_post_input_div.append(add_text_button);
      
      add_text_button.click(function(){
         $.post(post_url,{ 
            a: "sTP",
            b: user_num,
            c: $('#text_post_input_textarea').val()
         }, 
         function (result){
            $.post(post_url,{ 
               a: "rP",
               b: stranger_num,
               c: user_num,
               d: result,
               e: user_num
            }, 
            function (result){
               showStrangerBlog(1);
            });
         });
      });
      
      var load_message_div = $("<div />",{id: "load_message_div", class: "message_block"});
      var load_message2_div = $("<div />",{id: "load_message2_div", class: "message_block"});
      var load_message3_div = $("<div />",{id: "load_message_div", class: "message_block"});
      load_message_div.html("Принцип работы: Загрузите сюда изображение или напишите что-нибудь, и это увидят все пользователи приложения. Однако если пост не понравится большинству, он пропадёт отсюда.<p>1) Не постите шлак.");
      load_message2_div.html("<p>2) Вы можете запостить не более одного раза в час.");
      load_message_div.css("padding", "20px 86px 0");
      
      $('#content_div').html(load_message_div);
      $('#content_div').append(load_message2_div);
      $('#content_div').append(load_message3_div);
      $('#content_div').append(upload_button_div);
      $('#content_div').append(text_button_div);
      $('#content_div').append(text_post_input_div);
      $('#content_div').append(stranger_blog_main_div);
   
      upload_second_button.css("width", "236px");
      $('#upload_second_button').parent().css({"margin-left":"192px", "cursor":"default"});
      $('#upload_second_button').parent().children("form").children("input").css({"marginLeft":"27px", "marginTop":"-59px"});
      
      $.post(post_url,{ 
         a: "lTH",
         b: user_num
      }, 
      function (result){
         if (result == 0){
            $('#upload_second_button').upload({
            name: 'file',
            method: 'post',
            enctype: 'multipart/form-data',
            action: '../upload.php?user_num='+user_num,
            onSubmit: function(){
               $('#upload_second_button_span').text('Отправка файла...');
               sorted_mode = 0;
            },
            onComplete: function(data){
               $('#upload_second_button_span').text('Загрузить еще изображение'); 
               utils.log("upload.onComplete; "+data);
               $.post(post_url,{ 
                  a: "rP",
                  b: stranger_num,
                  c: user_num,
                  d: data,
                  e: user_num
               }, 
               function (result){
                  showStrangerBlog(1);
               });
            }
            });
         }
         else{
            $('#upload_second_button').click(function(){
               load_message2_div.css("color","rgb(204,118,118)");
            });
         }
      });
      
      //########################################################################
      $.post(post_url,{ 
            a: "gMPN",
            b: stranger_num
         },function(data){
            stranger_max_post_num = utils.nullToZero(data);
            getStrangerPosts();
         }
      );
   }
   else{//##################################### not YMB user #############################################################################################
      utils.log("stranger isnt ymb"+stranger_num);
      stranger_num = strngr_num;
      var stranger_blog_main_div = $("<div />",{id: "stranger_blog_main_div", class: "content_div_block"});
      var buttons_div = $("<div />",{id: "back_button_div", class: "content_div_block", style:"padding: 10px 40px 0;"});
      buttons_div.css({"width": "100%"});
      
      //############################ кнопка загрузки на общую стену приложения
      
      var back_button = $("<button />",{id: "back_button", class: "cupid-green-light"});
      var back_button_span = $("<span />",{id: "back_button_span", class: "post_social_panel_span", text: "Общая лента"});
      back_button.append(back_button_span);   
      buttons_div.append(back_button);  
      
      var vk_link_a = $("<a />",{id: "vk_link_a", href: "", target: "_blank"});
      var vk_link_button = $("<button />",{id: "vk_link_button", class: "cupid-green-light"});
      var vk_link_span = $("<span />",{id: "vk_link_span", class: "post_social_panel_span", text: "Страница ВК"});
      //vk_link_button_span = $("<span />",{id: "vk_link_button_span", class: "post_social_panel_span", text: "Страница ВК Оли"});
      //vk_link_button.append(vk_link_button_span);
      vk_link_button.append(vk_link_span);
      vk_link_a.append(vk_link_button);
      buttons_div.append(vk_link_a);  
      
      $('#content_div').html(buttons_div);
      $('#content_div').append(stranger_blog_main_div);
      
      $('#back_button').click(function(){
         showStrangerBlog(1);
      });
      
      getStrangerLink(strngr_num);
      vkapi.getNameNom(strngr_num);
      
      $.post(post_url,{ 
         a: "gMPN",
         b: stranger_num
      },
      function(data){
         stranger_max_post_num = utils.nullToZero(data);
         getStrangerPosts();
      });
   }
   
   cur_active_tab_id = "stranger_blog_tab_a";
}



function showMyBlog(){ // выводит контент вкладки Мой блог
   vkapi.setHash(user_num);
   var my_blog_main_div = $("<div />",{id: "my_blog_main_div", class: "blog_div_block"});
   $('#content_div').html(my_blog_main_div);
   createNewUser();
   
   cur_active_tab_id = "my_blog_tab_a";
}

function getStrangerPosts(){
   if (sorted_mode){
      $.post(post_url,{ 
            a: "gBIBL",
            b: stranger_num,
            c: stranger_max_post_num
         },
         function (result){
            stranger_max_post_num -= 21;
            showed_blog_on_start = 1;
            var obj = eval("(" + result + ")");
            
            for (var i = 0; i < obj.length; i++)
               if (obj[i].likes >= -1)
                  createPost(obj[i], 1);
            
            stranger_loaded_next_20 = 1;
         });
   }
   else{
      $.post(post_url,{ 
            a: "gBI",
            b: stranger_num,
            c: stranger_max_post_num
         },
         function (result){
            stranger_max_post_num -= 21;
            showed_blog_on_start = 1;
            var obj = eval("(" + result + ")");
            
            for (var i = 0; i < obj.length; i++)
               if (obj[i].likes >= -1)
                  createPost(obj[i], 1);
            
            stranger_loaded_next_20 = 1;
         });
   }
}

function testTextPost(){
   var params = {};
   params.num = 1;
   params.text = "Меня восхищают полные девушки,одевающие короткие юбки и шорты.Я,имея параметры 83-56-91,не всегда,бывает,позволяю одеть что-то короткое.А им похуй,они чувствуют себя самыми шикарными.Вот у кого нужно учиться:)";
   params.img_name = "repost_text_999_1";
   params.img_path = 999;
   params.vk_name = "Username";
   params.vk_sex = 1;
   params.likes = 123;
   params.reposts = 12;
   params.likers = "6|7";
   params.dislikers = "8|9";
   params.timestamp = "1236565456";
   params.deleted = 0;
   
   createPost(params, 1);
}