<?php

require_once dirname(__FILE__)."/src/authData.php";

//echo "No syntax errors!!!";

if (!mysqlConnect($host, $user, $pass, $db)){
   mysql_query("SET NAMES 'utf8'");
   mysql_query("SET collation_connection = 'UTF-8_general_ci'");
   mysql_query("SET collation_server = 'UTF-8_general_ci'");
   mysql_query("SET character_set_client = 'UTF-8'");
   mysql_query("SET character_set_connection = 'UTF-8'");
   mysql_query("SET character_set_results = 'UTF-8'");
   mysql_query("SET character_set_server = 'UTF-8'");
}

for ($i=1; $i<2921; $i++){
   $sql1 = "SELECT * FROM `information_schema`.`tables` WHERE `table_name` = 'repost_user_{$i}' LIMIT 1";
   $result = db_fetchone_array($sql1, __LINE__, __FILE__);
   if (count($result) != 0){
      $res = "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='nespizdiru' AND TABLE_NAME='repost_user_{$i}' AND COLUMN_NAME='text'";
      $result = db_fetchone_array($res, __LINE__, __FILE__);
      if ($result['COLUMN_NAME'] == "") {
         $sql = "ALTER TABLE `repost_user_{$i}` ADD  `text` TEXT NOT NULL AFTER  `num` ;";
         db_query($sql, __LINE__, __FILE__);
      }
   }
}

mysql_close();

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

function db_fetchone_array($query, $line=0, $file_name='filename'){
   $res = db_query($query, $line, $file_name);
   $row = mysql_fetch_array($res,MYSQL_ASSOC);
   mysql_free_result($res);
   
   return ($row)? $row : array();
}

function db_fetchall_array($query, $line=0, $file_name='filename'){
   $res = db_query($query, $line, $file_name);
   
   while($row = mysql_fetch_array($res,MYSQL_ASSOC))
      $rows[] = $row;
   
   mysql_free_result($res); // îñâîáîæäàåò ïàìÿòü îò ðåçóëüòàòîâ çàïðîñà
   
   return ($rows)? $rows : array();
}

?>
