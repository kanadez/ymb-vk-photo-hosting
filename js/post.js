var stranger_text_post_dom = '<div id="post_ID_div" class="post_div"><div id="post_ID_text_div"></div><div id="post_ID_social_panel_div" class="post_social_panel"><button id="post_ID_social_panel_dislike_button" class="cupid-green post_dislike_button" href="javascript:void(0)"><i id="post_ID_social_panel_dislike_i" class="post_social_panel_dislike_i"></i></button><span id="post_ID_social_panel_likes_span" class="stranger_blog_reposts_social_panel_span stranger_post_likes_span"></span><button id="post_ID_social_panel_like_button" class="cupid-green post_like_button" href="javascript:void(0)"><i id="post_ID_social_panel_like_i" class="post_social_panel_like_i"></i></button><span id="post_ID_social_panel_host_name_span" class="stranger_blog_reposts_social_panel_span post_name_span">Загрузил<a id="post_ID_author_a" class="text_link" href="javascript:void(0)"></a></span></div></div>';
var user_text_post_dom = '<div id="post_ID_div" class="post_div"><div id="post_ID_text_div"></div> <!--http://app.youmadbro.ru/users/2/repost_2_33.jpg--><div id="post_ID_social_panel_div" class="post_social_panel"><button id="post_ID_social_panel_delete_button" class="cupid-green post_delete_button" href="javascript:void(0)"><span id="post_ID_social_panel_delete_span" class="post_social_panel_span">Удалить</span><i id="post_ID_social_panel_delete_i" class="post_social_panel_delete_i"></i></button><span id="post_ID_social_panel_likes_span" class="my_blog_reposts_social_panel_span user_post_likes_span"></span></div></div>';
var user_post_dom = '<div id="post_ID_div" class="post_div"><div id="post_ID_img_div"></div> <!--http://app.youmadbro.ru/users/2/repost_2_33.jpg--><div id="post_ID_social_panel_div" class="post_social_panel"><button id="post_ID_social_panel_delete_button" class="cupid-green post_delete_button" href="javascript:void(0)"><span id="post_ID_social_panel_delete_span" class="post_social_panel_span">Удалить</span><i id="post_ID_social_panel_delete_i" class="post_social_panel_delete_i"></i></button><span id="post_ID_social_panel_likes_span" class="my_blog_reposts_social_panel_span user_post_likes_span"></span></div></div>';
var stranger_post_dom = '<div id="post_ID_div" class="post_div"><div id="post_ID_img_div"></div><div id="post_ID_social_panel_div" class="post_social_panel"><button id="post_ID_social_panel_dislike_button" class="cupid-green post_dislike_button" href="javascript:void(0)"><i id="post_ID_social_panel_dislike_i" class="post_social_panel_dislike_i"></i></button><span id="post_ID_social_panel_likes_span" class="stranger_blog_reposts_social_panel_span stranger_post_likes_span"></span><button id="post_ID_social_panel_like_button" class="cupid-green post_like_button" href="javascript:void(0)"><i id="post_ID_social_panel_like_i" class="post_social_panel_like_i"></i></button><span id="post_ID_social_panel_host_name_span" class="stranger_blog_reposts_social_panel_span post_name_span">Загрузил<a id="post_ID_author_a" class="text_link" href="javascript:void(0)"></a></span></div></div>';

var posts = [];

function Post(params, user_type){ // params = post json from serverside, user_type - stranger(1) or local user(2)
   this.num = params.num;
   this.img_name = params.img_name;
   this.img_path = params.img_path;
   this.vk_name = params.vk_name;
   this.vk_sex = params.vk_sex;
   this.sex_text1 = this.vk_sex == 2 ? "Загрузил" : "Загрузила";
   this.likes = params.likes;
   this.reposts = params.reposts;
   this.likers = params.likers;
   this.dislikers = params.dislikers;
   this.timestamp = params.timestamp;
   this.deleted = params.deleted;
   this.dom = null;   
   this.img_id = "stranger_blog_image_"+this.num;
   
   this.onImageLoaded = function(object){
      var img_id = object.currentTarget.attributes.id.value;
      
      if ($('#'+img_id).width() > 590)
        $('#'+img_id).width(590);
      
      utils.log(2, "Image #"+img_id+" loaded successfully");
      vkapi.changeHeight();
   };
   
   this.onImageLoadError = function(){
      utils.log(1, "Image not loaded");
   };
   
   this.convertDom = function(dom_string, post_num_value){
      return dom_string.replace(/\ID/g, post_num_value);
   }
   
   post_image = new Image();
   post_image.id = this.img_id;
   post_image.onload = this.onImageLoaded;
   post_image.onerror = this.onImageLoadError;
   post_image.src = "http://ymb.cherdack.ru/users/"+this.img_path+"/"+this.img_name;
   
   if (user_type === 1){      
      this.dom = this.convertDom(stranger_post_dom, this.num);
      $('#stranger_blog_main_div').append(this.dom);
   }
   else{ 
      this.dom = this.convertDom(user_post_dom, this.num);
      $('#my_blog_main_div').append(this.dom);
   }
   
   $('#post_'+this.num+'_social_panel_host_name_span').html(this.sex_text1+' <a class="text_link" onclick="showStrangerBlog('+this.img_path+')" href="javascript:void(0)">'+this.vk_name+'</a>');
   $('#post_'+this.num+'_social_panel_host_name_span').css("margin-left","0");
   $('#post_'+this.num+'_img_div').html(post_image);
   
   if (user_type === 1)
      $('#post_'+this.num+'_social_panel_likes_span').html(this.likes);
   else
      $('#post_'+this.num+'_social_panel_likes_span').html(this.likes+" лайков");
   
   $('#post_'+this.num+'_social_panel_like_button').click({obj:this},function(e){
      var post_num = e.data.obj.num;
      var post_likes = e.data.obj.likes;
      var post_image_path = e.data.obj.img_path;
      var post_image_name = e.data.obj.img_name;
      
      post_likes++;
      e.data.obj.likes++;
      $("#post_"+post_num+"_social_panel_likes_span").text(post_likes);
      
      $.post(post_url,{ 
         a: "lP",
         b: stranger_num,
         c: user_num,
         d: post_image_path,
         e: post_image_name
      }, 
      function (result){
         if (result != 0){
            post_likes--;
            e.data.obj.likes--;
            $("#post_"+post_num+"_social_panel_likes_span").text(post_likes);
         }
      });
   });
   
   $('#post_'+this.num+'_social_panel_dislike_button').click({obj:this},function(e){
      var post_num = e.data.obj.num;
      var post_likes = e.data.obj.likes;
      var post_image_path = e.data.obj.img_path;
      var post_image_name = e.data.obj.img_name;
      
      post_likes--;
      e.data.obj.likes--;
      $("#post_"+post_num+"_social_panel_likes_span").text(post_likes);
      
      $.post(post_url,{ 
         a: "dlP",
         b: stranger_num,
         c: user_num,
         d: post_image_path,
         e: post_image_name
      }, 
      function (result){
         if (result != 0){
            post_likes++;
            e.data.obj.likes++;
            $("#post_"+post_num+"_social_panel_likes_span").text(post_likes);
         }
      });
   });
   
   $('#post_'+this.num+'_social_panel_delete_button').click({obj:this},function(e){
         $.post(post_url,{ 
            a: "dP",
            b: user_num,
            c: e.data.obj.img_name
         }, 
         function (result){
            var my_blog_main_div = $("<div />",{id: "my_blog_main_div", class: "blog_div_block"});
            $('#content_div').html(my_blog_main_div);
            createNewUser();
         });
   });
   
   /*this.repost_button = $("<button />",{id: "post_"+this.image_num+"_social_panel_repost", class: "cupid-green", href: "javascript:void(0)"});
   this.repost_button.css({"float": "right"});
   this.repost_button_span = $("<span />",{id: "post_"+this.image_num+"_social_panel_repost_span", class: "post_social_panel_span", text: this.reposts});
   this.repost_button_icon = $("<i />",{id: "post_"+this.image_num+"_social_panel_repost_i", class: "post_social_panel_repost_i"});
   this.repost_button.click({obj:this},function(e){
      if (user_num != -1)
      {
         e.data.obj.reposts++;
         $("#post_"+e.data.obj.image_num+"_social_panel_repost_span").text(e.data.obj.reposts);
         $.post(post_url,{ 
            a: "rP",
            b: user_num,
            c: stranger_num,
            d: e.data.obj.image_name,
            e: e.data.obj.image_host
            
         }, 
         function (result){
            if (result != 0){
               e.data.obj.reposts--;
               $("#post_"+e.data.obj.image_num+"_social_panel_repost_span").text(e.data.obj.reposts);
            }
         });
      }
   });*/
   
   //this.host_name_span = $("<span />",{id: "post_"+this.image_num+"_social_panel_host_name_span", class: "stranger_blog_reposts_social_panel_span", style: "float:left"});
   //this.host_name_span.html(this.loaded_sex_text+" <a href='javascript:void(0)' class='text_link' onclick=\"showStrangerBlog("+this.image_host+")\">"+this.image_host_name+"</a>");
}

function textPost(params, user_type){ // params = post json from serverside, user_type - stranger(1) or local user(2)
   this.num = params.num;
   this.img_name = params.img_name;
   this.img_path = params.img_path;
   this.text = params.text;
   this.vk_name = params.vk_name;
   this.vk_sex = params.vk_sex;
   this.sex_text1 = this.vk_sex == 2 ? "Написал" : "Написала";
   this.likes = params.likes;
   this.reposts = params.reposts;
   this.likers = params.likers;
   this.dislikers = params.dislikers;
   this.timestamp = params.timestamp;
   this.deleted = params.deleted;
   this.dom = null;   
   this.img_id = "stranger_blog_text_"+this.num;
   
   this.convertDom = function(dom_string, post_num_value){
      return dom_string.replace(/\ID/g, post_num_value);
   }
   
   if (user_type === 1){      
      this.dom = this.convertDom(stranger_text_post_dom, this.num);
      $('#stranger_blog_main_div').append(this.dom);
   }
   else{ 
      this.dom = this.convertDom(user_text_post_dom, this.num);
      $('#my_blog_main_div').append(this.dom);
   }
   
   $('#post_'+this.num+'_social_panel_host_name_span').html(this.sex_text1+' <a class="text_link" onclick="showStrangerBlog('+this.img_path+')" href="javascript:void(0)">'+this.vk_name+'</a>');
   $('#post_'+this.num+'_social_panel_host_name_span').css("margin-left","0");
   $('#post_'+this.num+'_text_div').html(this.text);
   $('#post_'+this.num+'_text_div').css({"text-align":"left", "color":"#fff", "opacity":"0.8"});
   
   if (user_type === 1)
      $('#post_'+this.num+'_social_panel_likes_span').html(this.likes);
   else
      $('#post_'+this.num+'_social_panel_likes_span').html(this.likes+" лайков");
   
   $('#post_'+this.num+'_social_panel_like_button').click({obj:this},function(e){
      var post_num = e.data.obj.num;
      var post_likes = e.data.obj.likes;
      var post_image_path = e.data.obj.img_path;
      var post_image_name = e.data.obj.img_name;
      
      post_likes++;
      e.data.obj.likes++;
      $("#post_"+post_num+"_social_panel_likes_span").text(post_likes);
      
      $.post(post_url,{ 
         a: "lP",
         b: stranger_num,
         c: user_num,
         d: post_image_path,
         e: post_image_name
      }, 
      function (result){
         if (result != 0){
            post_likes--;
            e.data.obj.likes--;
            $("#post_"+post_num+"_social_panel_likes_span").text(post_likes);
         }
      });
   });
   
   $('#post_'+this.num+'_social_panel_dislike_button').click({obj:this},function(e){
      var post_num = e.data.obj.num;
      var post_likes = e.data.obj.likes;
      var post_image_path = e.data.obj.img_path;
      var post_image_name = e.data.obj.img_name;
      
      post_likes--;
      e.data.obj.likes--;
      $("#post_"+post_num+"_social_panel_likes_span").text(post_likes);
      
      $.post(post_url,{ 
         a: "dlP",
         b: stranger_num,
         c: user_num,
         d: post_image_path,
         e: post_image_name
      }, 
      function (result){
         if (result != 0){
            post_likes++;
            e.data.obj.likes++;
            $("#post_"+post_num+"_social_panel_likes_span").text(post_likes);
         }
      });
   });
   
   $('#post_'+this.num+'_social_panel_delete_button').click({obj:this},function(e){
         $.post(post_url,{ 
            a: "dP",
            b: user_num,
            c: e.data.obj.img_name
         }, 
         function (result){
            var my_blog_main_div = $("<div />",{id: "my_blog_main_div", class: "blog_div_block"});
            $('#content_div').html(my_blog_main_div);
            createNewUser();
         });
   });
   
   /*this.repost_button = $("<button />",{id: "post_"+this.image_num+"_social_panel_repost", class: "cupid-green", href: "javascript:void(0)"});
   this.repost_button.css({"float": "right"});
   this.repost_button_span = $("<span />",{id: "post_"+this.image_num+"_social_panel_repost_span", class: "post_social_panel_span", text: this.reposts});
   this.repost_button_icon = $("<i />",{id: "post_"+this.image_num+"_social_panel_repost_i", class: "post_social_panel_repost_i"});
   this.repost_button.click({obj:this},function(e){
      if (user_num != -1)
      {
         e.data.obj.reposts++;
         $("#post_"+e.data.obj.image_num+"_social_panel_repost_span").text(e.data.obj.reposts);
         $.post(post_url,{ 
            a: "rP",
            b: user_num,
            c: stranger_num,
            d: e.data.obj.image_name,
            e: e.data.obj.image_host
            
         }, 
         function (result){
            if (result != 0){
               e.data.obj.reposts--;
               $("#post_"+e.data.obj.image_num+"_social_panel_repost_span").text(e.data.obj.reposts);
            }
         });
      }
   });*/
   
   //this.host_name_span = $("<span />",{id: "post_"+this.image_num+"_social_panel_host_name_span", class: "stranger_blog_reposts_social_panel_span", style: "float:left"});
   //this.host_name_span.html(this.loaded_sex_text+" <a href='javascript:void(0)' class='text_link' onclick=\"showStrangerBlog("+this.image_host+")\">"+this.image_host_name+"</a>");
}

function createPost(params_obj, user_type_value){ // post type: 0 - image, 1 - text
   if (params_obj.type == 0)
      var new_post = new Post(params_obj, user_type_value);
   else if (params_obj.type == 1)
      var new_post = new textPost(params_obj, user_type_value);
   posts.push(new_post);
   vkapi.changeHeight();
   
   return 0;
}

/*function loadedToday(timestamp){
   var today = new Date();
   var today_date = today.getFullYear()+"/"+today.getMonth()+"/"+today.getDate();
   var post = new Date(timestamp*1000);
   var post_date = post.getFullYear()+"/"+post.getMonth()+"/"+post.getDate();
   
   if (today_date === post_date)
      return 1;
   else return 0;
}*/