<?php
  
class GetData
{
   function getStrangerName($stranger_num){
      $sql = "SELECT `vk_name` FROM `repost_users` WHERE `user_num` = {$stranger_num};";
      $result = db_fetchone_array($sql, __LINE__, __FILE__);
      
      return $result['vk_name'];
   }
   
   function getStrangerVKID($stranger_num){
      $sql = "SELECT `vk_id` FROM `repost_users` WHERE `user_num` = {$stranger_num};";
      $result = db_fetchone_array($sql, __LINE__, __FILE__);
      
      return $result['vk_id'];
   }
   
   function getUserNum($vk_id){
      $sql = "SELECT `user_num` FROM `repost_users` WHERE `vk_id` = '{$vk_id}';";
      $result = db_fetchone_array($sql, __LINE__, __FILE__);
      
      if ($result['user_num'] != "")
         return $result['user_num'];
      else return -1;
   }
   
   function getBlogImages($user_num, $top_post_num){
      $bottom_post_num = $top_post_num - 20;
      $sql = "SELECT * FROM `repost_user_{$user_num}` WHERE `deleted` = 0 AND `num` BETWEEN {$bottom_post_num} AND {$top_post_num} ORDER BY `num` DESC;";
      $result = db_fetchall_array($sql, __LINE__, __FILE__);
      
      for ($i = 0; $i < count($result); $i++)
      {
         $sql2 = "SELECT `vk_name`, `vk_sex` FROM `repost_users` WHERE `user_num` = ".$result[$i]["img_path"];
         $result2 = db_fetchone_array($sql2, __LINE__, __FILE__);
         $result[$i]["vk_name"] = $result2["vk_name"];
         $result[$i]["vk_sex"] = $result2["vk_sex"];
      }
      
      return json_encode($result);
   }
   
   function getBlogImagesByLikes($user_num, $top_post_num){
      $sql = mysql_query("SELECT MAX(`likes`) FROM `repost_user_$user_num` WHERE `deleted` = 0;");
      $row = mysql_fetch_array($sql);
      $max_likes = $row[0];
      $min_likes = $max_likes - 20;
      
      $sql = "SELECT * FROM `repost_user_{$user_num}` WHERE `deleted` = 0 AND `likes` BETWEEN $min_likes AND $max_likes ORDER BY `likes` DESC;";
      $result = db_fetchall_array($sql, __LINE__, __FILE__);
      
      for ($i = 0; $i < count($result); $i++)
      {
         $sql2 = "SELECT `vk_name`, `vk_sex` FROM `repost_users` WHERE `user_num` = ".$result[$i]["img_path"];
         $result2 = db_fetchone_array($sql2, __LINE__, __FILE__);
         $result[$i]["vk_name"] = $result2["vk_name"];
         $result[$i]["vk_sex"] = $result2["vk_sex"];
      }
      
      return json_encode($result);
   }
   
   function lessThanHour($user_num){
      $sql = mysql_query("SELECT MAX(`timestamp`) FROM `repost_user_{$user_num}` WHERE `deleted` = 0;");
      $row = mysql_fetch_array($sql);
      if ((time()-$row[0]) < 3600)
         return 1;
      else return 0;
   }
   
   function isThereUser($vk_id, $vk_name, $vk_sex){
      global $set_data;
   
      $sql = "SELECT `user_num` FROM `repost_users` WHERE `vk_id` = '{$vk_id}';";
      $result = db_fetchone_array($sql, __LINE__, __FILE__);
      
      if ($result['user_num'] == ""){
         $user_num = $set_data->createNewUser($vk_id, $vk_name, $vk_sex);
         return $user_num."_0";
      }
      else{
         return $result['user_num']."_1";
      }
   }

   function getMaxUsers(){
      $query_result = mysql_query("SELECT MAX(`user_num`) FROM `repost_users`;");
      $row = mysql_fetch_array($query_result);
      return $row[0];
   }
   
   function getMaxPostNum($user_num){
      $query_result = mysql_query("SELECT MAX(`num`) FROM `repost_user_{$user_num}`;");
      $row = mysql_fetch_array($query_result);
      return $row[0];
   }

   function test(){
      return "test_return";
   }
}

?>