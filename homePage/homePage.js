 ecui.esr.onready = function() {
     // 处理index.html的特殊模板
     etpl.config({
         commandOpen: '<<<',
         commandClose: '>>>'
     });
     for (var el = document.getElementById('header').firstChild; el; el = el.nextSibling) {
         if (el.nodeType === 8) {
             etpl.compile(el.textContent || el.nodeValue);
         }
     }
     etpl.config({
         commandOpen: '<!--',
         commandClose: '-->'
     });
     return {
         model: function(options, callback) {
                 ecui.esr.request([
                     'recommendList@/ecircle/ecircle/v1/get_recommend_list?lastCid=0',
                     'userInfo@/ecircle/ecircle/v1/get_user_info'
                 ], function() {
                     callback();
                 });
         },
         main: 'makedown_container',
         view: 'header',
         onbeforerender: function(context) {

         },
         onafterrender: function(context) {

         }
     }
 }