(function() {
	var core = ecui,
		dom = core.dom,
		io = core.io,
		esr = core.esr;
	dom.ready(function() {
		var header = ecui.$('header');
		var _li = header.getElementsByTagName('li');
		var current = _li[0];
		// dom.addEventListener(header, 'click', function(event) {
		// 	var event = event || window.event;
		// 	var target=event.target;
		// 	if(target.nodeName.toLowerCase()==='a'){
		// 		var parent=target.parentNode;
		// 		if(parent!=current){
		// 			dom.addClass(parent,'active');
		// 			dom.removeClass(current,'active');
		// 			current=parent;
		// 		}
		// 	}
		// })
		window.onhashchange = function() {
			current=changeA(_li, current);
		}
		window.onload = function() {
			current=changeA(_li, current);
		}
	});

	function changeA( _li, current) {
		var hash = esr.getLocation();
		var href = '';
		Array.prototype.forEach.call(_li, function(item, index) {
			href = dom.getAttribute(dom.first(item), 'href');
			if (href === '#' + hash) {
				if (item != current) {
					dom.addClass(item, 'active');
					dom.removeClass(current,'active');
		 			current=item;
				}
			}

		});
		return current;
	}

}(ecui))