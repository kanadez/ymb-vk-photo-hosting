<?php
  
class SetData{
   function setTextPost($user_num, $text){
      $query_result = mysql_query("SELECT MAX(`num`) FROM `repost_user_{$user_num}`;");
      $row = mysql_fetch_array($query_result);
      $max_num = $row[0];
      $next_num = $max_num+1;
      $text_name = "repost_".$user_num."_".$next_num;
      
      $sql = sprintf("INSERT INTO `repost_user_{$user_num}` (`type`, `img_name`, `img_path`, `text`, `timestamp`) VALUES (1, '%s', '%s', '%s', %d);",
         mysql_real_escape_string($text_name),
         mysql_real_escape_string($user_num),
         mysql_real_escape_string($text),
         mysql_real_escape_string(time()));
         
      $res1 = db_query($sql, __LINE__, __FILE__);
      return $text_name;
   }
   
   function deletePost($user_num, $image_name){
      $sql = sprintf("UPDATE `repost_user_{$user_num}` SET `deleted` = 1 WHERE `img_name` = '%s';",
         mysql_real_escape_string($image_name));
               
      db_query($sql, __LINE__, __FILE__);
      
      $sql = sprintf("UPDATE `repost_user_1` SET `deleted` = 1 WHERE `img_name` = '%s';",
         mysql_real_escape_string($image_name));
         
      db_query($sql, __LINE__, __FILE__);
   }
   
   function repostPost($user_num, $stranger_num, $image_name, $image_host){ // user_num - мой номер, stranger_num - чужой номер, image_num - номер изображения
      $error = 0;
      
      if ($user_num != $stranger_num){
         $sql = sprintf("SELECT `num` FROM `repost_user_{$user_num}` WHERE `img_name` = '%s';",
            mysql_real_escape_string($image_name));
         
         $result1 = db_fetchone_array($sql, __LINE__, __FILE__);
         
         if ($result1['num'] == ""){
            $sql = sprintf("SELECT `text`, `type` FROM `repost_user_{$stranger_num}` WHERE `img_name` = '%s';",
            mysql_real_escape_string($image_name));
            $result2 = db_fetchone_array($sql, __LINE__, __FILE__);
            
            $sql = sprintf("INSERT INTO `repost_user_{$user_num}` (`img_name`, `img_path`, `type`, `text`, `timestamp`) VALUES ('%s', %d, %d, '%s', %d);",
               mysql_real_escape_string($image_name),
               mysql_real_escape_string($image_host),
               mysql_real_escape_string($result2['type']),
               mysql_real_escape_string($result2['text']),
               mysql_real_escape_string(time()));
            
            db_query($sql, __LINE__, __FILE__);
            
            $sql = sprintf("UPDATE `repost_user_{$image_host}` SET `reposts` = `reposts`+1 WHERE `img_name` = '%s';",
               mysql_real_escape_string($image_name));
               
            db_query($sql, __LINE__, __FILE__);
            
            if ($stranger_num != $image_host){            
               $sql = sprintf("UPDATE `repost_user_{$stranger_num}` SET `reposts` = `reposts`+1 WHERE `img_name` = '%s';",
                  mysql_real_escape_string($image_name));
                  
               db_query($sql, __LINE__, __FILE__);
            }
         }
         else{
            $error--;
         }
      }
      else{ 
         $error--; // -1 means error
      }
      
      return $error;
   }
   
   function dislikePost($stranger_num, $user_num, $image_host, $image_name){
      $error = 0;
      
      $sql = sprintf("SELECT `dislikers` FROM `repost_user_{$stranger_num}` WHERE `img_name` = '%s';",
         mysql_real_escape_string($image_name));
         
      $result1 = db_fetchone_array($sql, __LINE__, __FILE__);
      $likers = explode("|", $result1['dislikers']);
      $was_liked = 0;
         
      for ($i = 0; $i < count($likers); $i++)
         if ($user_num == $likers[$i])
            $was_liked = 1;
            
      if ($was_liked == 0){
         //####################################################for YMB user
         
         $sql = sprintf("UPDATE `repost_user_1` SET `likes` = `likes`-1 WHERE `img_name` = '%s';",
            mysql_real_escape_string($image_name));
            
         db_query($sql, __LINE__, __FILE__);
         
         $likers_new = $result1['likers']."|".$user_num;
         
         $sql = sprintf("UPDATE `repost_user_1` SET `dislikers` = '%s' WHERE `img_name` = '%s';",
            mysql_real_escape_string($likers_new),
            mysql_real_escape_string($image_name));
            
         db_query($sql, __LINE__, __FILE__);
         
         //################################################################
         
         /*$sql = sprintf("UPDATE `repost_user_{$stranger_num}` SET `likes` = `likes`-1 WHERE `img_name` = '%s';",
            //mysql_real_escape_string($image_name));
            
         db_query($sql, __LINE__, __FILE__);
         
         $likers_new = $result1['likers']."|".$user_num;
         
         $sql = sprintf("UPDATE `repost_user_{$stranger_num}` SET `dislikers` = '%s' WHERE `img_name` = '%s';",
            mysql_real_escape_string($likers_new),
            mysql_real_escape_string($image_name));
            
         db_query($sql, __LINE__, __FILE__);*/
         
         if ($stranger_num != $image_host){
            $sql = sprintf("UPDATE `repost_user_{$image_host}` SET `likes` = `likes`-1 WHERE `img_name` = '%s';",
               mysql_real_escape_string($image_name));
            
            db_query($sql, __LINE__, __FILE__);
            
            $likers_new = $result1['likers']."|".$user_num;
         
            $sql = sprintf("UPDATE `repost_user_{$image_host}` SET `dislikers` = '%s' WHERE `img_name` = '%s';",
               mysql_real_escape_string($likers_new),
               mysql_real_escape_string($image_name));
               
            db_query($sql, __LINE__, __FILE__);
         }
      }
      else{
         $error--;
      }
      
      return $error;
   }
   
   function likePost($stranger_num, $user_num, $image_host, $image_name){
      $error = 0;
      
      $sql = sprintf("SELECT `likers` FROM `repost_user_{$stranger_num}` WHERE `img_name` = '%s';",
         mysql_real_escape_string($image_name));
         
      $result1 = db_fetchone_array($sql, __LINE__, __FILE__);
      $likers = explode("|", $result1['likers']);
      $was_liked = 0;
         
      for ($i = 0; $i < count($likers); $i++)
         if ($user_num == $likers[$i])
            $was_liked = 1;
            
      if ($was_liked == 0){
         //######################################################### for YMB user
         $sql = sprintf("UPDATE `repost_user_1` SET `likes` = `likes`+1 WHERE `img_name` = '%s';",
            mysql_real_escape_string($image_name));
            
         db_query($sql, __LINE__, __FILE__);
         
         $likers_new = $result1['likers']."|".$user_num;
         
         $sql = sprintf("UPDATE `repost_user_1` SET `likers` = '%s' WHERE `img_name` = '%s';",
            mysql_real_escape_string($likers_new),
            mysql_real_escape_string($image_name));
            
         db_query($sql, __LINE__, __FILE__);
         //######################################################################
         
         /*$sql = sprintf("UPDATE `repost_user_{$stranger_num}` SET `likes` = `likes`+1 WHERE `img_name` = '%s';",
          //  mysql_real_escape_string($image_name));
            
         db_query($sql, __LINE__, __FILE__);
         
         $likers_new = $result1['likers']."|".$user_num;
         
         $sql = sprintf("UPDATE `repost_user_{$stranger_num}` SET `likers` = '%s' WHERE `img_name` = '%s';",
            mysql_real_escape_string($likers_new),
            mysql_real_escape_string($image_name));
            
         db_query($sql, __LINE__, __FILE__);
         */
         if ($stranger_num != $image_host){
            $sql = sprintf("UPDATE `repost_user_{$image_host}` SET `likes` = `likes`+1 WHERE `img_name` = '%s';",
               mysql_real_escape_string($image_name));
            
            db_query($sql, __LINE__, __FILE__);
            
            $likers_new = $result1['likers']."|".$user_num;
         
            $sql = sprintf("UPDATE `repost_user_{$image_host}` SET `likers` = '%s' WHERE `img_name` = '%s';",
               mysql_real_escape_string($likers_new),
               mysql_real_escape_string($image_name));
               
            db_query($sql, __LINE__, __FILE__);
         }
      }
      else{
         $error--;
      }
      
	   return $error;
   }
   
   function createNewUser($vk_id, $vk_name, $vk_sex){
      global $get_data;
      
      $max_users = $get_data->getMaxUsers();
      $user_num = $max_users+1;
      $table = "repost_user_".$user_num;
   
      $sql = sprintf("INSERT INTO `repost_users` (`user_num`, `table`, `vk_id`, `vk_name`, `vk_sex`) VALUES (%d, '%s', '%s', '%s', %d);",
            mysql_real_escape_string($user_num),
            mysql_real_escape_string($table),
            mysql_real_escape_string($vk_id),
            mysql_real_escape_string($vk_name),
            mysql_real_escape_string($vk_sex));
            
      $res1 = db_query($sql, __LINE__, __FILE__);
      
      $sql = "CREATE TABLE `{$table}` (
         `num` int(10) NOT NULL AUTO_INCREMENT,
         `type` int(2) NOT NULL,
         `img_name` varchar(30) NOT NULL,
         `img_path` varchar(50) NOT NULL,
         `text` text NOT NULL,
         `reposts` int(10) NOT NULL,
         `likes` int(10) NOT NULL,
         `likers` text NOT NULL,
         `dislikers` text NOT NULL,
         `timestamp` varchar(20) NOT NULL,
         `deleted` int(1) NOT NULL,
         PRIMARY KEY (`num`)) ENGINE=MyISAM  DEFAULT CHARSET=cp1251 AUTO_INCREMENT=1;";
         
      $res2 = db_query($sql, __LINE__, __FILE__);
      
      $res3 = ftpCreateDirectory("/cherdack/public_html/ymb/public_html/users/".$user_num);
      
      return $user_num;
   }
}

?>
