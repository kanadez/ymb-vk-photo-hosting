<?php

require_once dirname(__FILE__)."/php/src/authData.php";

if (!mysqlConnect($host, $user, $pass, $db)){
   mysql_query("SET NAMES 'utf8'");
   mysql_query("SET collation_connection = 'UTF-8_general_ci'");
   mysql_query("SET collation_server = 'UTF-8_general_ci'");
   mysql_query("SET character_set_client = 'UTF-8'");
   mysql_query("SET character_set_connection = 'UTF-8'");
   mysql_query("SET character_set_results = 'UTF-8'");
   mysql_query("SET character_set_server = 'UTF-8'");
}
//##########################################################################

$uploaddir = "./users/".$_GET["user_num"]."/";
$image_name = setRepostImage($_GET["user_num"]);
$uploadfile0 = $uploaddir . $image_name;

echo moveUploadedFiles();

function moveUploadedFiles(){
   global $uploadfile0;
   global $image_name;
   $result = true;
   $result *= move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile0);
   
   return $image_name;
}

mysql_close();
//#########################################################################

function setRepostImage($user_num){
   $max_num = getMaxImageNums($user_num);
   $next_num = $max_num+1;
   $img_name = "repost_".$user_num."_".$next_num.".jpg";
   
   $sql = sprintf("INSERT INTO `repost_user_{$user_num}` (`img_name`, `img_path`, `timestamp`) VALUES ('%s', '%s', %d);",
      mysql_real_escape_string($img_name),
      mysql_real_escape_string($user_num),
      mysql_real_escape_string(time()));
      
   $res1 = db_query($sql, __LINE__, __FILE__);
   
   return $img_name;
}

function getMaxImageNums($user_num){
   $query_result = mysql_query("SELECT MAX(`num`) FROM `repost_user_{$user_num}`;");
   $row = mysql_fetch_array($query_result);
   return $row[0];
}

function mysqlConnect($host, $user, $pass, $db){
   if (!mysql_connect($host, $user, $pass)){
      pe('connecting to mysql server');
      exit();
   }
   
   if(!mysql_select_db($db)){
      pe('connecting to db');
      exit();
   }
   
   return 0;   
}

function db_query($query, $line=0, $file_name='filename'){
   $res = mysql_query($query) or die("Error: wrong SQL query #$query#;  ".mysql_error()." in ".$file_name." on line ".$line);
   
   return $res;
}
?>