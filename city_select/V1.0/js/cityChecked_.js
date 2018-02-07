/**
 * CityChecked v 1.0.0
 * Copyright (c) 2017 10 18
 *
 * 插件说明：
 *     在专题概况-添加新的监测专题 
 *     页面中有限定区域的功能选择，
 *     本插件是为该功能专门编写提供服务
 */

!function ($) {
	// 创建 CityChecked 对象
	
	var CityChecked = function(){
		// this.url = "/js/city/city.js"; // 城市数据路径
		// this.url = "subject_addCity.do"; // 城市数据路径
		// this.provinceElem = $("#city"); // 省级菜单
  //       this.proviceHead = $('#m-tle'); // 市级菜单标题
  //       this.cityBox = $('#shi'); // 市级菜单
  //       this.checkedCityBox = $('#xian'); // 选中城市菜单
  //       this.provinces = []; // 省数据
  //       this.citys = []; // 市数据
  //       this.selectBox = $('.m-xin'); // 选项存放盒子
		this.provinceElem = $("#province"); // 省级菜单
        this.proviceHead = $('#protitle'); // 市级菜单标题
        this.cityBox = $('#city'); // 市级菜单
        this.checkedCityBox = $('#checkedList'); // 选中城市菜单
        this.provinces = []; // 省数据
        this.citys = []; // 市数据
        this.selectBox = $('#citybody'); // 选项存放盒子

	}
	CityChecked.prototype = {
		constructor: CityChecked,
		// 执行初始化操作
		"rady" : function(){
			var self = this;
			// if(self.selectBox.is(':visible')){
			// 	self.selectBox.hide();
			// 	return ;
			// }else{
			// 	self.selectBox.show();
			// }
			if(self.provinces.length !== 0){
				return;
			}
			// 获取省份数据
			$.getJSON('./json/province.json',{parentid:0},function(data){
				// console.info(data);
				self.provinces = data;
				self.provinceFill();
				// 默认显示第一个城市的数据
				self.defaultFill(data[0]);


				// 添加城市点击事件
				self.provinceElem.on('click.option.citys','li',function(event){
					self.proEvent = event;
					self.cityDataMade(event,self.provinceClickOper);


					// if(self.cityDataMade(event)){
					// 	self.provinceClickOper(event);
					// }
				});
			});

			// $.ajax({
			// 	url:self.url,
			// 	cache : false, 
			// 	async : false,
			// 	dataType:"json",
			// 	data:{
			// 		provinceid:0,
			// 	},
			// 	success:function(data){
			// 		self.provinces = data;
			// 		self.provinceFill();

			// 		self.provinceElem.on('click.option.citys','li',function(event){
			// 			self.cityDataMade(event);
			// 			self.provinceClickOper(event);
			// 		});
			// 	}
			// });
			self.cityBox.on('click.ciry.oper','li',function(event){
				self.cityClickoper(event);
			});
		},
		// 页面展开默认填充城市数据
		"defaultFill" : function(data){
			// 判断数据类型，如果不是数组直接退出
			if(!self.isArray(data)){
				return;
			}
			var cityData = self.cityDataFind('pro',provinceTitle);
			if(cityData == -1){
				// 如果数据不存在则重新查询
			}else{

			}

		},
		// 判断对象是否为数组
		"isArray": function(obj){
			if(Array.isArray){
				return Array.isArray(obj);
			}else{
				return Object.prototype.toString.call(obj) === "[object Array]";
			}
		},
		// 省份菜单填充
		"provinceFill" : function(){
			var self = this;
			var proData = [].concat(self.provinces),
				len = proData.length,
			    str = "";
			for(var i = 0;i<len;i++){
			    str += '<li id="'+ proData[i]['id'] +'"><i class="m-xuan"></i>' + proData[i]['name']+ '</li>';
			}
			self.provinceElem.html(str);
		},
		// 城市数据获取
		"cityDataMade" : function(event,callback){
			var self = this,
				elm = event.currentTarget,
				$elm = $(elm),
				provinceTitle = $elm.text(),
				provinceId = $elm.attr('id'),
				i = 0,
				len = self.citys.length;
			if(len !== 0){
				for(i;i<len;i++){
					if(provinceTitle === self.citys[i]['pro']){
						return;
					}
				}
			}
			// 获取指定城市下的数据
			$.getJSON('./json/city_'+ provinceId +'.json',function(data){
				self.citys.push({"pro":provinceTitle,"val":data});
				if( typeof callback === "function" ){
					// callback(event);
					callback.call(self,event);
				}
			})
		},
		// 省份菜单点击操作
		"provinceClickOper" : function(event){
			var self = this,
				em =  event.currentTarget,
				selectedNode = event.target,
				$em = $(em),
				$selectedNode = $(selectedNode),
				num = $em.attr('id'),
				provinceTitle = $em.text(),
				cityTran = self.cityDataFind('pro',provinceTitle);
			if(cityTran === -1){self.cityDataMade(event);return;}
			if(selectedNode.nodeName === "I"){
				if($selectedNode.hasClass('city-part')){
					$selectedNode.removeClass('city-part')
				}
				if($selectedNode.hasClass('city-all')){
					// 取消省份选中
					$selectedNode.removeClass('city-all');
					// 取消所有城市选中状态
					$.each(cityTran['val'],function(){
						this['t'] = false;
					});

					self.cancelSelectedCity('sid',num);
				}else{
					// 选中省份
					$selectedNode.addClass('city-all');
					$.each(cityTran['val'],function(){
						this['t'] = true;
					});
					self.addSelectedCity({'id':num,'name':provinceTitle,'pid':0});
					self.cancelSelectedCity('pid',num);
				}
			}
			self.cityFill(num,cityTran);
		},
		// 城市菜单填充
		"cityFill" : function(pid,data){
			var self = this,
				cityArr = data['val'],
				i = 0,
				slen = cityArr.length,
				cityStr="";
				
			self.proviceHead.attr('sid',pid).html(data['pro']);
			for(i;i<slen;i++){
                cityStr += '<li'+ ( cityArr[i]['t'] ? ' class="m-fu"': '') +' data-sid="'+ cityArr[i]['id'] +'">'+ cityArr[i]['name'] +'</li>';
            }
			self.cityBox.html(cityStr);
		},
		// 城市数据查询
		"cityDataFind" : function(key,val){
			var self = this,
				dataObj = self.citys;
				return self.dataFind(dataObj,key,val);
		},
		// 省份数据查询
		"provinceDataFind" : function(key,val){
			var self = this,
				dataObj = self.provinces;
				return self.dataFind(dataObj,key,val);
		},
		"dataFind" : function(obj,key,val){
			var self = this,
				i = 0,
				len = obj.length;
			if(len === 0){return -1;}
			for(i;i<len;i++){
				if(obj[i][key] === val){
					return obj[i];
				}
			}
			return -1;
		},
		// 城市菜单点击操作
		"cityClickoper" : function(event){
			var self = this,
				em = event.currentTarget,
				$em = $(em),
				id = $em.data('sid'),
				cityName = $em.text(),
				pid = self.proviceHead.attr('sid'),
				ciryObj = {'id':id,'name':cityName,'pid':pid};
			if($em.hasClass('m-fu')){
				// 取消选中状态，删除选中数据
				$em.removeClass('m-fu');
				self.citySelected(id,pid,false);
				self.cancelSelectedCity('sid',id);
				self.citySelectedOper(pid);
			}else{
				// 设置选中状态，添加选中数据
				$em.addClass('m-fu');
				self.citySelected(id,pid,true);
				self.addSelectedCity(ciryObj);
				self.citySelectedOper(pid);
			}
		},
		// 城市菜单选中操作
		"citySelectedOper" : function(id){
			var self = this,
				parentName = "",
				listData = [],
				i = 0,
				len = 0,
				provinceDom = self.provinceElem.find('#'+id),
				checkDom ={},
				t1 = false,
				t2 = false,
				res = [];
			if(provinceDom.length === 0){return;}
			parentName = provinceDom.text();
			checkDom = provinceDom.find('i');
			listData = self.cityDataFind('pro',parentName)
			if(listData === -1){return;}
			listData = [].concat(listData['val']);
			for(i,len = listData.length;i<len;i++){
				if(listData[i]['t']){
					t1 = true;
				}else{
					t2 = true;
				}
				if(t1 && t2){break;}
			}
			res = listData.filter(function(obj){
				return obj['t'];
			});
			if(t1 && t2){ // 部分选中
				if(checkDom.hasClass('city-all')){
					checkDom.removeClass('city-all');
					// 删除省添加市
					self.cancelSelectedCity('sid',id);
					self.addSelectedCity(res);
				}
				if(!checkDom.hasClass('city-part')){
					checkDom.addClass('city-part');
				}
			}else if(t1 && !t2){ // 全部选中
				if(checkDom.hasClass('city-part')){
					checkDom.removeClass('city-part');
				}
				if(!checkDom.hasClass('city-all')){
					checkDom.addClass('city-all');
					// 删除市添加省
					self.cancelSelectedCity('pid',id);
					self.addSelectedCity({'id':id,'name':parentName,'pid':0});
				}

			}else if(!t1 && t2){ // 全部未选
				if(checkDom.hasClass('city-all')){
					checkDom.removeClass('city-all');
				}
				if(checkDom.hasClass('city-part')){
					checkDom.removeClass('city-part');
				}
			}
		},
		// 单个城市数据查询
		"selectedCityDataFind" : function(sid,pid){
			var self = this,
				provinceName = self.provinceDataFind('id',pid),
				cityDataList=[],
				selectCity = [];
			if(provinceName === -1){
				return;
			}
			cityDataList = self.cityDataFind('pro',provinceName['name']);
			if(cityDataList === -1){
				return;
			}
			cityDataList = cityDataList['val'];
			selectCity = self.dataFind(cityDataList,'id',sid);
			if(selectCity === -1){
				return;
			}
			return selectCity;
		},
		// 修改城市选中状态
		"citySelected" : function(sid,pid,bl){
			var self = this,
				selectedData = self.selectedCityDataFind(parseInt(sid),parseInt(pid));
				if(selectedData){
					selectedData['t'] = bl;
				}
		},
		// 添加选中城市
		"addSelectedCity" : function(data){
			var self = this,
				cityStr = "",
				dataList = self.isArray(data) ? data : [data],
				selectedData = {},
				i = 0,
				len = dataList.length;
			for(i;i<len;i++){
				cityStr += '<span sid="'+ dataList[i]['id'] +'" pid="'+ (dataList[i]['pid'] ? dataList[i]['pid'] : dataList[i]['parentid'] ? dataList[i]['parentid'] : 0) +'"><i class="dele"></i>'+ dataList[i]['name'] +'</span>';
			}
			self.checkedCityBox.append(cityStr);
		},
		// 点击关闭按钮
		"removeSelectedCity" : function(element){
			var self = this,
				selectedData = [],
				$em = $(element),
				parentDom = $em.parent(),
				sid = parseInt(parentDom.attr('sid')),
				pid = parseInt(parentDom.attr('pid')),
				cityName = parentDom.text(),
				cityList = self.cityBox.find('li[data-sid="'+ sid +'"]'),
				cityStr = "",
				cityArr = [],
				i = 0,
				slen = 0;
			if(pid === 0){ // 选中省份
				selectedData = self.cityDataFind('pro',cityName);
				if(selectedData === -1){
					return;
				}
				cityArr = selectedData['val'];
				slen = cityArr.length;
				$.each(cityArr,function(){
					this['t'] = false;
				});
				self.cancelSelectedCity('sid',sid);
				self.citySelectedOper(sid);
				for(i;i<slen;i++){
	                cityStr += '<li'+ ( cityArr[i]['t'] ? ' class="m-fu"': '') +' data-sid="'+ cityArr[i]['id'] +'">'+ cityArr[i]['name'] +'</li>';
	            }
	            self.cityBox.html(cityStr);
			}else{ // 选中城市
				self.citySelected(sid,pid,false);
				self.cancelSelectedCity('sid',sid);
				self.citySelectedOper(pid);
				if(cityList.length !==0 && cityList.hasClass('m-fu')){
					cityList.removeClass('m-fu');
				}
			}
		},
		// 从选择区域中移除
		"cancelSelectedCity" : function(type,id){
			
			var self = this,
				id = self.isArray(id) ? id : [id],
				i = 0,
				len = id.length,
				$li;
			for(i;i<len;i++){
				$li = self.checkedCityBox.find('span['+ type +'="'+id[i]+'"]');
				if($li.length !== 0){
					$li.remove();
				}
			}
		}
	}
	window.cityChecked = new CityChecked;
}(window.jQuery);