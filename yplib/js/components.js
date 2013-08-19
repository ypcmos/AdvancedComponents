/*======================================================================
//        filename :components.js
//        description :高级组件, 需要引入jquery库，并且引入../css/components.css;
//
//        author: 姚鹏
//        date: 2013.7
//        mail:yaopengdn@126.com
//        http://weibo.com/u/2151926144
//======================================================================*/

/*	
	class VariableTab
	description: 可变的Tab类
	params: div string, 包含菜单的div id, 该div下需要具有供菜单绑定的a元素;
			target string, 生成对象容器div id;
			arg object array, 其中object形如{url: 'string', title: 'string'}, url为tab对应的超链接,title为tab显示的名字,title不能重复，
								object array需要具有和参数一包含的a元素一样的个数;
	return object;
*/
function VariableTab(div, target, arg) {
	var self = this;
	var tabs = {};
	var urls = {};
	var target = target;
	var i ;
	for (i = 0 ; i < arg.length; i++) {
		var id = "variableTab_" + i;
		tabs[id] = arg[i].title;
		urls[id] = arg[i].url;
	}

	var createBasic = function() {
		var div1 = document.createElement('div');
		div1.setAttribute('id', 'tabdiv');
		var div2 = document.createElement('div');
		div2.setAttribute('id', 'tabcontext');
		var tarObj = document.getElementById(target);
		tarObj.appendChild(div1);
		tarObj.appendChild(div2);
	}
	createBasic();
	var tabDiv = $('#tabdiv');
	var frameDiv = $('#tabcontext');
	
	var buttons = $('#' + div).find('a');
	buttons.click(function() {
		var index;
		for (var i = 0; i < buttons.length; i++) {
			if (buttons.eq(i)[0] == this) 
			{
				index = i;
				break;
			}
		}
		if (index >= 0) {
			self.addTab(tabs['variableTab_' + index]);
		}
	});
	
	var isTabExist = function(tabstr) {
		for(var tab in tabs) {
			if (tabstr == tabs[tab] && $('#' + tab).length != 0) {
				return true;
			}
		}
		return false;
	}

	

	/*
		method addTab
		description: 添加Tab，支持可关闭的tab与不可关闭的tab
		params: string, 待生成的tab显示的文字;
				string, 可选，如果为false则生成不可关闭的tab;
		return object;
	*/
	this.addTab = function() {
		var isVariable = true;
		
		if (arguments.length == 2) {
			isVariable = arguments[1];
		} else if (arguments.length > 2) {
			throw "too many arguments.";
		} else if (arguments.length < 1) {
			throw "too few arguments.";
		}

		var tabstr = arguments[0];
		var tabId = self.getTabIdByTitle(tabstr) || undefined;
		self.hideAll();
		if (tabId != undefined && !isTabExist(tabstr)) {
			var tabObj = document.createElement('div');
			tabObj.setAttribute('id', tabId);
			tabObj.setAttribute('class', 'tabbasic');
			var html = '<span>' + tabstr + '</span>';

			if (isVariable) {
				html += '<li title="关闭"/>';
			}
			tabObj.innerHTML = html;
			$(tabObj).click(function() {
				self.hideAll();
				self.show(tabId);
			});
			tabDiv[0].appendChild(tabObj);
			$(tabObj).find('li').click(function() {
				var parent = $(this).parent('div');
				var thisId = parent.attr('id');		
				var isShow = self.isShow(thisId);
				var next = parent.next('div');
				var prev = parent.prev('div');
				self.deleteTabById(thisId);

				if (isShow) {
					if (next.length != 0) {					
						next.click();
					} else if (prev != 0) {
						prev.click();
					}
				}
			});
			createFrame(tabId);
		} else if (tabId != undefined) {


		}
		self.show(tabId);
		return self;
	}

	this.getTabIdByTitle = function(title) {
		for(var tab in tabs) {
			if (title == tabs[tab]) {
				return tab;
			}
		}
		return false;
	}

	this.hideAll = function() {
		for(var tab in tabs) {
			self.hide(tab);
		}
	}

	this.getExistTabNum = function() {
		var ret = 0;
		for(var tab in tabs) {
			if ($(tab).length != 0) {
				ret++;
			}
		}
		return ret;
	}

	this.show = function(tid) {
		var obj = $('#' + tid);
		obj.removeClass('hide');
		obj.addClass('show');
		obj.attr('yphide', 'show');
		showFrame(tid);
	}

	this.hide = function(tid) {
		var obj = $('#' + tid);
		obj.removeClass('show');
		obj.addClass('hide');
		obj.attr('yphide', 'hide');
		hideFrame(tid);
	}

	this.isHide = function(tid) {
		var obj = $('#' + tid);
		if (obj.attr('yphide') == 'hide' || obj.attr('yphide') == undefined) {
			return true;
		}
		return false;
	}

	this.isShow  = function(tid) {
		var obj = $('#' + tid);
		if (obj.attr('yphide') == 'show') {
			return true;
		}
		return false;
	}

	var createFrame = function(tid) {
		var id = tid + '_frame';
		var frame = document.createElement('iframe');
		frame.setAttribute('id', id);
		frame.setAttribute('src', urls[tid]);
    	frame.setAttribute('frameborder', 'no');
		frame.setAttribute('border', 0);
		frame.setAttribute('marginwidth', 0);
		frame.setAttribute('marginheight', 0);
		//frame.setAttribute('scrolling', 'no');
		frame.setAttribute('allowtransparency', 'yes');
		frame.style.width = (frameDiv[0].offsetWidth) + 'px';
		frame.style.height = (frameDiv[0].offsetHeight) + 'px';

		frameDiv[0].appendChild(frame);
	}

	var showFrame = function(tid) {
		var id = tid + '_frame';
		frame = document.getElementById(id) || false;
		if (frame) {
			frame.style.display = 'block';
		}
	}

	var hideFrame = function(tid) {
		var id = tid + '_frame';
		frame = document.getElementById(id) || false;
		if (frame) {
			frame.style.display = 'none';
		}
	}

	var destroyFrame = function(tid) {
		var id = tid + '_frame';
		$('#' + id).remove();
	}

	this.deleteTabById = function(tid) {
		var obj = $('#' + tid);
		obj.remove();
		destroyFrame(tid);
	}
	/*
		method destroy
		description: 销毁所有该类生成的控件;
		return undefined;
	*/
	this.destroy = function() {
		tabDiv.remove();
		frameDiv.remove();
		buttons.unbind('click');
		tabs = null;
		urls = null;
		target = null;
	}
}
