/*
 * 基于jQuery开发的模态框插件
 * 
 * 需要保存的数据 为后期的完善做准备
 * options = {
 *     type: {0:'加载层',1:'提示框',2:'询问框',3:'tip层',4:'页面层',5:'iframe层'}
 * }
 *  
 */

;!function(win,$,undefined){
 // 第一步，各自为政
var modal = {}
// 加载层
    modal.load = function(type){
        type = type || '';
        var mask = '<div class="modal-mask"></div>';
        var loadUi = '<div class="modal-box modal-load'+ type +'-box"><div class="modal-load"></div></div>';
        $('body').append(mask).append(loadUi);
        tool.dom = $('.modal-box');
        tool.setCloseBtn(['.modal-mask','.moadl-colse','.btn-close']);
    }
// 提示框
    modal.alert = function(content){
        content = content || 'This is alert!!!';
        var mask = '<div class="modal-mask"></div>';
        var loadUi = '<div class="modal-box modal-borderd modal-alert-box modal-box-shadow modal-border-radius"><div class="modal-title">信息</div><div class="moadl-content">'+ content +'</div><div class="modal-footer"><a class="btn btn-blue btn-close">确定</a></div><span class="moadl-colse">&times;</span></div>';
        $('body').append(mask).append(loadUi);
        tool.dom = $('.modal-box');
        tool.position();
    }

// 确认框
    modal.confirm = function(content){
        content = content || 'This is confirm?';
        var mask = '<div class="modal-mask"></div>';
        var loadUi = '<div class="modal-box modal-borderd modal-alert-box modal-box-shadow modal-border-radius"><div class="modal-title">信息</div><div class="moadl-content">'+ content +'</div><div class="modal-footer"><a class="btn btn-blue btn-close">确定</a><a class="btn btn-orange btn-close">取消</a></div><span class="moadl-colse">&times;</span></div>';
        $('body').append(mask).append(loadUi);
        tool.dom = $('.modal-box');
        tool.position();
    }
/* 工具 */
    var tool = {
        dom : null
    };
    
    tool.position = function(){
        var dom = this.dom;
        //console.info(dom);
        //console.info(win.innerHeight);
        var offsetTop = (win.innerHeight - dom.outerHeight())/2,
            offsetLeft = (win.innerWidth - dom.outerWidth())/2;
        dom.css({top:offsetTop,left:offsetLeft});
    };
    tool.close = function(){
        // 遮罩
        var mask = $('.modal-mask'),
            dom = this.dom;
            mask.remove();
            dom.remove();
    };
    tool.setCloseBtn = function(setings){
        var type = setings && typeof setings === 'object',that = this;
        $(type?setings.join():setings).on('click.close',function(){
            that.close();
        })
    };
    win.modal = modal;
}(window,jQuery);