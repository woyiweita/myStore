// 模态框操作
(function (win,$,undefined) {
		/**
		 * 显示弹出层
		 * @return {[type]} [description]
		 */
		function showModalLayer() {
			var $layerBox = $('.modal-layer'),
				$modalLayer = $layerBox.find('.modal-layer-box'),
				mlWdith =0;
			$layerBox.fadeIn(200);
			mlWdith = $modalLayer.width();
			$modalLayer.css({'position':'absolute','left':'100%','float':'none'}).animate({'marginLeft':'-'+mlWdith+'px'},500,'',function(){
				$modalLayer.removeAttr('style');
			});
		}
		/**
		 * 隐藏弹出层
		 * @return {[type]} [description]
		 */
		function hideModalLayer() {
			var $layerBox = $('.modal-layer'),
				$modalLayer = $layerBox.find('.modal-layer-box'),
				mlWdith =$modalLayer.width();
			$modalLayer.css({'position':'absolute','left':'100%','float':'none','marginLeft':'-'+mlWdith+'px'}).animate({'marginLeft':'0px'},300,'',function(){
				$modalLayer.removeAttr('style');
			});
			$layerBox.fadeOut(300);
		}

		/**
		 * 显示提示层
		 * @return {[type]} [description]
		 */
		function showPromptLayer(html){
			var $layerBox = $('.prompt-layer'),
				$promptLayer = $layerBox.find('.prompt-layer-box'),
				$layerBody = $promptLayer.find('.prompt-layer-body');
			$layerBody.html(html);
			$layerBox.fadeIn(200);
			$promptLayer.css('marginTop','-100%').animate({'marginTop':'0px'},300,'',function(){
				$promptLayer.removeAttr('style');
			});
			return $layerBox;
		}

		/**
		 * 隐藏提示层
		 * @return {[type]} [description]
		 */
		function hidePromptLayer(){
			var $layerBox = $('.prompt-layer'),
				$promptLayer = $layerBox.find('.prompt-layer-box'),
				$layerBody = $layerBox.find('.prompt-layer-body');
			$promptLayer.animate({'marginTop':'-100%'},200,'',function(){
				$promptLayer.removeAttr('style');
				$layerBody.html("");
			});
			$layerBox.fadeOut(200);
		}

		/**
		 * 提示确认信息
		 * @param  {[type]} str [description]
		 * @return {[type]}     [description]
		 */
		function confirmDelInfo(str,fn) {
			var html = '<div class="prompt-info"><i class="font-icon gray glyphicon glyphicon-trash fz3 ver-middle"></i><span class="prompt-content fz2 ver-middle">'+ str +'</span></div><div class="prompt-confirm"><a class="btn-del-cancel btn btn-width-extend btn-my-default" href="javascript:;" prompt-toggle="close" data-confirm="false">取 消</a><a class="btn-del-confirm btn btn-width-extend btn-primary ml20" href="javascript:;" prompt-toggle="close" data-confirm="true">确 认</a></div>';
			var $dom = showPromptLayer(html);
			if(typeof fn === "function"){
				var confirmFn = function(event) {
					fn($(this).data('confirm'));
					$dom.off('click.confirm');
				}
				$dom.on('click.confirm','[data-confirm]',confirmFn);
			}
		}
		
		/**
		 * 完成信息回显
		 * @param  {String} str [显示的信息]
		 * @param  {Boolean} res [true:成功 false:失败]
		 * @return {[type]}     [description]
		 */
		(function promptRes(str,res){
			var className = res ? 'glyphicon-ok-circle success' : 'glyphicon-remove-circle wine-red';
			var html = '<div class="prompt-info"><i class="font-icon glyphicon '+ className +' fz3 ver-middle"></i><span class="prompt-content fz2 ver-middle">'+ str +'</span></div><div class="prompt-confirm"><a class="btn-del-confirm btn btn-width-extend btn-primary ml20" href="javascript:;" prompt-toggle="close">确 认</a></div>';
			showPromptLayer(html);
		// })('专题删除成功！',true);
		})('专题删除失败！',false);

		// 模态层显示按钮
		$('[modal-toggle="open"]').on('click',showModalLayer);
		// 模态层隐藏
		$('[modal-toggle="close"]').on('click',hideModalLayer);
		// 提示层显示按钮 获得删除判定
		$('[prompt-toggle="open"]').on('click',function(){
			confirmDelInfo('确认删除该专题？',function(res){
				// 接收确认结果
				res ? console.info('确认删除') : console.info('取消删除');

			});
		});
		// 提示层隐藏
		$('.prompt-layer').on('click','[prompt-toggle="close"]',hidePromptLayer);
		


})(window,jQuery);