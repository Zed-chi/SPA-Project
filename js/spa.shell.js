/*spa.shell.js*/

/* Shell module for an SPA */


/*jslint    browser:true,   continue:true,
devel:true, indent:true,    maxerr:50,
newcap:true,    nomen:true, plusplus:true,
regexp:true,    sloppy:true,    vars:true,
white:true
*/

/*global $, spa*/

spa.shell=(function(){
/* Начало  переменных в области видимости модуля*/	
	var configMap={
		main_html: String()+
            '<div class="spa-shell-head">'+
                '<div class="spa-shell-head-logo"></div>'+
                '<div class="spa-shell-head-acct"></div>'+
                '<div class="spa-shell-head-search"></div>'+
            '</div>'

           + '<div class="spa-shell-main">'+
                '<div class="spa-shell-main-nav"></div>'+
                '<div class="spa-shell-main-content"></div>'+
            '</div>'+

            '<div class="spa-shell-foot"></div>'+
            '<div class="spa-shell-chat"></div>'+
            '<div class="spa-shell-modal"></div>',
        chat_extend_time:1000,
        chat_retract_time:300,
        chat_extend_height:450,
        chat_retract_height:15,
        chat_extended_title:"Щелкни чтобы свернуть",
        chat_retracted_title:"Щелкни чтобы развернуть",
        anchor_schema_map:{
        	chat:{open:true, closed: true}
        }    
        },
        stateMap={
        	anchor_map:{},
        	$container: null,
        	is_chat_retracted:true
        },
        jqueryMap={},

        setJqueryMap,
        onClickChat,
        toggleChat,
        initModule,
        copyAnchorMap,
        changeAnchorPart,
        onHashChange;
//-----------------------


//**начало служебных методов
	//возвращает копию сохраненного хеша якорей
	copyAnchorMap=function(){
		return $.extend(true, {}, stateMap.anchor_map );
	};
//--------------------------

//--Начало методов DOM
	//method setjquerymap
	setJqueryMap=function(){
		var $container= stateMap.$container;
		jqueryMap={
			$container:$container,
			$chat:$container.find('.spa-shell-chat')
		};
	};

	//method togglechat
	//состояние steMap.is_chat_retracted
	// true - свернуто
	// false - открыто

	toggleChat=function( do_extend, callback){
		var
			px_chat_ht= jqueryMap.$chat.height(),
			is_open=px_chat_ht===configMap.chat_extend_height,
			is_closed=px_chat_ht===configMap.chat_retract_height,
			is_sliding=! is_open&& !is_closed;

		//во избежания гонки
		if(is_sliding){return false;}

		//начало раскрытия окна чата
		if (do_extend) {
			jqueryMap.$chat.animate(
				{height:configMap.chat_extend_height},
				configMap.chat_extend_time, 
				function(){
					jqueryMap.$chat.attr("title", configMap.chat_extended_title);
					stateMap.is_chat_retracted=false;	
					if (callback) {callback( jqueryMap.$chat);}
			}
			);
			return true;
		}
		//конец раскрытия чата

		//начало сворачивания чата

		jqueryMap.$chat.animate({height:configMap.chat_retract_height}, 
			configMap.chat_retract_time,
			function(){
				jqueryMap.$chat.attr("title", configMap.chat_retracted_title);
					stateMap.is_chat_retracted=true;	
				if(callback){ callback(jqueryMap.$chat);}
			});
		return true;
		//конец сворачивания окна
	};
	// конец метода ДОМ toggleChat

	//начало метода дом changeAnchorPart
		 changeAnchorPart=function(arg_map){
		 	var anchor_map_revise = copyAnchorMap(),
		 		bool_return= true,
		 		key_name, key_name_dep;
		 	//Начало обьединения изменений в хеше якорей
		 	KEYVAL:
		 	for (key_name in arg_map) {
		 		if (arg_map.hasOwnProperty(key_name)) {
		 			//пропустить зависимыые ключи
		 			if (key_name.indexOf("_")===0) {continue KEYVAL;}

		 			//обновить значение независимого ключа
		 			anchor_map_revise[key_name]=arg_map[key_name];

		 			//обновить соответствующ зависимый ключ
		 			key_name_dep="_"+key_name;
		 			if (arg_map[key_name_dep]) {
		 				anchor_map_revise[key_name_dep]=arg_map[key_name_dep];
		 			}
		 			else{
		 				delete anchor_map_revise[key_name_dep];
		 				delete anchor_map_revise['_s'+key_name_dep];
		 			}
		 		}
		 	}
		 	//конец обьединения изменений в хеше якорей

		 	//начало попытки обновлениея uri, в случае ошибки восстановить исх  состояние
		 	try{
		 		$.uriAnchor.setAnchor(anchor_map_revise);
		 	}
		 	catch(error){
		 		$.uriAnchor.setAnchor(stateMap.anchor_map,null,true);
		 		bool_return=false;
		 	}
		 	//конец попытки обновления uri
		 	return bool_return;
		 };
	//конец метода  changeAnchorPart
//КОНЕЦ МЕТОДОВ ДОМ

	


//----------------------------------

//--Начало обработчиков событий
	onClickChat= function(event){
		if(toggleChat(stateMap.is_chat_retracted)){
			$.uriAnchor.setAnchor({
				chat:(stateMap.is_chat_retracted?"open":"closed")
			});
		}
		return false;
	};
//-----------------------------

//--Начало открытых методов
	// начало  initModule
	initModule=function( $container ){
		//загрузить  html и кешировать коллекции jquery
		stateMap.$container=$container;
		$container.html( configMap.main_html);
		setJqueryMap();
	// инициализировать окно и привязать обработчик
		stateMap.is_chat_retracted=true;
		jqueryMap.$chat.attr("title", configMap.chat_retracted_title).click( onClickChat);
	
	};
//конец открытого  метода 
	return { initModule: initModule};
//*************************


})();

