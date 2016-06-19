/* spa.js*/

/*jslint    browser:true,   continue:true,
devel:true, indent:true,    maxerr:50,
newcap:true,    nomen:true, plusplus:true,
regexp:true,    sloppy:true,    vars:true,
white:true
*/
/* global $, spa*/
    
var spa=(function(){
    
    var initModule = function( $container){
        spa.shell.initModule( $container);
    };
    
    return { initModule: initModule };
})();