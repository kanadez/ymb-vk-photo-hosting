function VKapi(){
   this.changeHeight = function(){
      VK.callMethod("resizeWindow", 833, $('#content_div').outerHeight()+100);
      //utils.log(2,"vkapi.changeHeight() executed");
   }
   
   this.setHash = function(hash_value){
      hash = hash_value;
      VK.callMethod("setLocation", hash_value, 0);
   }
   
   this.getNameNom = function(stranger_num_value){
      $.post(post_url,{ 
         a: "gSVK",
         b: stranger_num_value
      }, 
      function (result){
         VK.api('getProfiles', { // получаем имя и пол посетителя. и детектим кам ин
            uids: result,
            name_case: "gen"
         },
         function(data){
            if (data.response){
               viewer_name = data.response[0].first_name
               $('#vk_link_span').text("Страница ВК "+viewer_name);//detectComeIn();
            }  
         });
      });
   }
}