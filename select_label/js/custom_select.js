/*自定义下拉框*/
(function(win,$,undefined){
	if (!$) {console.error('没有jquery.js插件！');return false;}
	var $selectInput = $('[data-type="select-input"]'),
		$selectBox = $('[data-type="select"]');

	/**
	 * 显示下拉框并添加失去焦点的闭合事件
	 * @return {[type]} [description]
	 */
	function showOptionList() {
		$selectInput.data('toggle','open');
		$selectInput.attr('data-toggle','open');
		// 添加闭合事件
		$(document).on('click.select.focus',':not([data-type="select-box"])',blurCloseSelect);
	}

	/**
	 * 关闭下拉框并删除失去焦点的闭合事件
	 * @return {[type]} [description]
	 */
	function hideOptionList() {
		$selectInput.data('toggle','close');
		$selectInput.attr('data-toggle','close');
		// 删除事件
		$(document).off('click.select.focus',':not([data-type="select-box"])',blurCloseSelect);
	}


	/**
	 * 失去焦点时的闭合操作
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	function blurCloseSelect(event){
		event.stopPropagation();
		var $self = $(this),
			$parent = $self.parents('[data-type="select-box"]');
		if($parent.length === 0) {
			event.preventDefault();
			hideOptionList();
		}
	}

	/**
	 * 下拉框被点击
	 * @param  {[type]} 
	 * @return {[type]} 
	 */
	$selectInput.on('click.input',function(event){
		event.stopPropagation();
		event.preventDefault();
		var self = this,
			$self = $(self),
			status = $self.data('toggle');
		if (status === 'close') {
			// 展开下拉菜单
			showOptionList();
			
		} else {
			// 关闭下拉菜单
			hideOptionList();
			
		}
	});

	/**
	 * 选项被点击
	 * @param  {[type]} 
	 * @return {[type]} 
	 */
	$selectBox.on('click','label',function(event){
		event.stopPropagation();
		event.preventDefault();
		var self = this,
			$self = $(self),
			inputRadio = $self.find('input[type="radio"]')[0],
			text = $self.text().trim(),
			value = inputRadio.value;
		if(!inputRadio.checked){
			$selectInput.data('value',value).attr('data-value',value).val(text);
			inputRadio.checked = !inputRadio.checked;
		}
		hideOptionList();
	});
})(window,jQuery);
