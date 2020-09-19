<?php

require_once dirname(__FILE__)."/src/authData.php";
require_once dirname(__FILE__)."/src/ftpAuthData.php";
require_once dirname(__FILE__)."/src/getData.php";
require_once dirname(__FILE__)."/src/setData.php";

//echo "No syntax errors!!!";

if (!mysqlConnect($host, $user, $pass, $db)){
   mysql_query("SET NAMES 'utf8'");
   mysql_query("SET collation_connection = 'UTF-8_general_ci'");
   mysql_query("SET collation_server = 'UTF-8_general_ci'");
   mysql_query("SET character_set_client = 'UTF-8'");
   mysql_query("SET character_set_connection = 'UTF-8'");
   mysql_query("SET character_set_results = 'UTF-8'");
   mysql_query("SET character_set_server = 'UTF-8'");
   
   $get_data = new GetData;
   $set_data = new SetData;
}

switch ($_POST["a"]){
   case "sTP" :
      echo $set_data->setTextPost($_POST["b"], $_POST["c"]);
   break;
   
   case "gBIBL" :
      echo $get_data->getBlogImagesByLikes($_POST["b"], $_POST["c"]);
   break;
   
   case "gMPN" :
      echo $get_data->getMaxPostNum($_POST["b"]);
   break;
   
   case "gSNM" :
      echo $get_data->getStrangerName($_POST["b"]);
   break;
   
   case "lTH" :
      echo $get_data->lessThanHour($_POST["b"]);
   break;
   
   case "dP" :
      echo $set_data->deletePost($_POST["b"], $_POST["c"]);
   break;
   
   case "gSVK" :
      echo $get_data->getStrangerVKID($_POST["b"]);
   break;
   
   case "gUN" :
      echo $get_data->getUserNum($_POST["b"]);
   break;
   
   case "rP" :
      echo $set_data->repostPost($_POST["b"], $_POST["c"], $_POST["d"], $_POST["e"]);
   break;
   
   case "dlP" :
      echo $set_data->dislikePost($_POST["b"], $_POST["c"], $_POST["d"], $_POST["e"]);
   break;
   
   case "lP" :
      echo $set_data->likePost($_POST["b"], $_POST["c"], $_POST["d"], $_POST["e"]);
   break;
      
   case "cNU" :
      echo $set_data->createNewUser($_POST["b"]);
   break;
   
   case "iTU" :
      echo $get_data->isThereUser($_POST["b"], $_POST["c"], $_POST["d"]);
   break;
   
   case "gBI" :
      echo $get_data->getBlogImages($_POST["b"], $_POST["c"]);
   break;

   default : 
      exit();
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

function ftpConnect(){ //connects to ftp-server. Credentials are in src/ftpAuthData.php file
   global $ftp_server;
   global $ftp_user;
   global $ftp_pass;
      
   $conn_id = ftp_connect($ftp_server) or die("Couldn't connect to $ftp_server"); 

   if (@ftp_login($conn_id, $ftp_user, $ftp_pass)) 
      return $conn_id;
   else
      return "Couldn't connect as $ftp_user\n";
}

function ftpCreateDirectory($directory_name){ //creates directory $directory_name
   $conn_id = ftpConnect();
   $result = 0;
   
   if (ftp_mkdir($conn_id, $directory_name))
      $result = "1";
   else
      $result = "0";
   
   ftp_close($conn_id);
   return $result;
}

?>
