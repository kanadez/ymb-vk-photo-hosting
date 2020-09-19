function detectBrowser(){
   var browser_unsupported_flag = 0;   
   var browser = $.browser;
   var mozilla_unsupported_vers = [1,2,3,4,5,6,7];
   var msie_unsupported_vers = [1,2,3,4,5,6,7,8,9,10];
   var opera_unsupported_vers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
   
   if (browser.mozilla)
      for (var i = 0; i < mozilla_unsupported_vers.length; i++)
         if (browser.version.slice(0,2) == mozilla_unsupported_vers[i])
            browser_unsupported_flag = -1;
   
   if (browser.msie)
      for (var i = 0; i < msie_unsupported_vers.length; i++)
         if (browser.version.slice(0,2) == msie_unsupported_vers[i])
            browser_unsupported_flag = -1;
   
   if (browser.opera)
      for (var i = 0; i < opera_unsupported_vers.length; i++)
         if (browser.version.slice(0,2) == opera_unsupported_vers[i])
            browser_unsupported_flag = -1;
   
   return browser_unsupported_flag;
}

function onBrowserUnsupported(){
   var msg = $("<img />", {
      id: "old_brow_msg_img",
      src: "./img/old_browser.png"
   });
   
   $('#wrapper_div').html(msg);
   $('#wrapper_div').show();
}