function Utils(){
   this.undfnd = function(variable){ // detects undefined variable
      if (variable === undefined || variable === "")
         return 1
      else return 0;
   }

   this.nullToZero = function(variable){ // converts null or emty data to 0
      if (variable === undefined || variable === "")
         return 0;
      else return variable;
   }

   this.log = function(msg_type, string){ // log to test textarea; 1 = error, 2 = notification
      if (test_mode){
         $('#console_area').show();
         
         if (msg_type === 1)
            $('#console_area').append("Error: "+string+";\n");
         else if (msg_type === 2)
            $('#console_area').append("Notification: "+string+";\n");
      }
   }
}