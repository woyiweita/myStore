/**
 * CityChecked v 1.0.0
 * Copyright (c) 2017 10 18
 * 
 * 插件说明：
 *     在专题概况-添加新的监测专题 
 *     页面中有限定区域的功能选择，
 *     本插件是为该功能专门编写提供服务
 *     城市加载数据引用了JSON文件，直接访问无法正常查看结果
 *     在支持JSON读取的环境下查看
 */

!function ($) {
	// 创建 CityChecked 对象
	
	var CityChecked = function(){
		this.provinceElem = $("#province"); // 省级菜单
        this.proviceHead = $('#protitle'); // 市级菜单标题
        this.cityBox = $('#city'); // 市级菜单
        this.checkedCityBox = $('#checkedList'); // 存放选中城市队列
        this.provinces = []; // 省数据
        this.citys = []; // 市数据
        this.cityCheckedClassName = "active"; // 城市选中状态样式
        this.showPro = ""; // 当前显示省份ID
        this.eventLists = []; // 添加事件队列
	}
	CityChecked.prototype = {
		constructor: CityChecked,
		"init":function(data){
			var self = this;
			if(this.eventLists.length === 0 || this.eventLists.indexOf('click.open') !== -1){
				self.eventLists.push('click.open');
				// 没有添加事件
				self.checkedCityBox.on('click.open',function(event){
					var $self = $(self),
						status = $self.attr('dome-status'),
						showDom = $('#citybody'),
						targetName = event.target.nodeName;  // 获取事件触发元素
					if(targetName === "I"){
						// 执行删除选项操作
						cityChecked.removeSelectedCity(event.target);
						return;
					}else if(targetName === "SPAN"){
						// 什么都不执行，直接跳出
						return;
					}
					if(!showDom || !showDom.length){return;}
					if(showDom.is(':hidden')){
						showDom.removeClass('hide');	
						showDom.addClass('show');
						if(status){
							$self.attr('dome-status','on');
						}
					}else{
						showDom.removeClass('show');	
						showDom.addClass('hide');
						if(status){
							$self.attr('dome-status','off');
						}
					}
					if(data !== undefined){
						// 数据回填
						
					}else{
						// 初始化加载
						self.rady();
					}
				});
			}
			

		},
			// 执行初始化操作
		"rady" : function(){
			var self = this;
				// 如果省份数据已保存，则不再查询获取
				// 保证所有事件仅添加一次
			if(self.provinces.length !== 0){
				return;
			}
				// 获取省份数据
			$.getJSON('./json/province.json',{parentid:0},function(data){
				self.provinces = data; // 保存省份数据
				self.provinceFill(data);
					// 默认显示第一个城市的数据
				self.defaultFill(data[0]);

					// 添加省份点击事件
				self.provinceElem.on('click.option.citys','li',function(event){
					var extractOptionsData = self.getEventObjData(event);
					self.cityDataMade(extractOptionsData,self.provinceClickOper);
				});
			});
				// 城市添加点击事件
			self.cityBox.on('click.ciry.oper','li',function(event){
				var extractOptionsData = self.getEventObjData(event);
				self.cityClickoper(extractOptionsData);
			});
				// 选中城市添加删除事件
			self.checkedCityBox.on('cilik.remove','span',function(event){
				var em = event.target;
				if(em.nodeName === "I"){
					// 触发删除操作
					// 对父级元素的操作
					self.getEventObjData(event.parentNode);
					self.removeSelectedCity(em);
				}
			});
		},
		/**功能模块**/
			// 页面展开默认填充城市数据
		"defaultFill" : function(data){
			var self = this;
				// 判断数据类型
			if(typeof data !== "object"){
				return;
			}
			// 查询数据进行数据填充 
			self.cityDataMade(data,function(backdata){
				self.cityFill(backdata);
			})
		},

			// 省份菜单填充
		"provinceFill" : function(data){
			var self = this;
			var proData = [].concat(data),
				len = proData.length,
			    str = "";
			for(var i = 0;i<len;i++){
			    str += '<li sid="'+ proData[i]['id'] +'" pid="' + proData[i]['parentid'] + '"><i class="m-xuan"></i>' + self.trim(proData[i]['name'])+ '</li>';
			}
			self.provinceElem.html(str);
		},


			// 省份菜单点击操作
		"provinceClickOper" : function(data,options){
			var self = this,
				selectedNode = options['tg'],
				$selectedNode = $(selectedNode),
				num = options['id'];
			if(selectedNode.nodeName === "I"){
				if($selectedNode.hasClass('city-part')){
					$selectedNode.removeClass('city-part')
				}
				if($selectedNode.hasClass('city-all')){
					// 取消省份选中
					$selectedNode.removeClass('city-all');
					// 取消所有城市选中状态
					self.citySelected(num,0,false)
					self.cancelSelectedCity('sid',num);
				}else{
					// 选中省份
					$selectedNode.addClass('city-all');
					self.citySelected(num,0,true)
					self.addSelectedCity(options);
					self.cancelSelectedCity('pid',num);
				}
			}
			// 城市填充
			self.cityFill(data);
		},

			// 城市菜单填充
		"cityFill" : function(data){
			var self = this,
				cityArr = data['val'],
				i = 0,
				slen = cityArr.length,
				cityStr="",
				className = self.cityCheckedClassName;;
				
			self.proviceHead.html(data['pro']);
			for(i;i<slen;i++){
                cityStr += '<li'+ ( cityArr[i]['t'] ? ' class="'+className+'"': '') +' sid="'+ cityArr[i]['id'] +'" pid="'+ cityArr[i]['parentid'] +'">'+ self.trim(cityArr[i]['name']) +'</li>';
            }
			self.cityBox.html(cityStr);
			self.showPro = data['pro'];
		},
			// 城市菜单点击操作
		"cityClickoper" : function(options){
			var self = this,
				em = options['ctg'],
				$em = $(em),
				id = options['id'],
				cityName = options['name'],
				pid = options['parentid'],
				className = self.cityCheckedClassName;
				// ciryObj = {'id':id,'name':cityName,'pid':pid};
			if($em.hasClass(className)){
				// 取消选中状态，删除选中数据
				$em.removeClass(className); // 取消选中状态样式
				self.citySelected(id,pid,false);// 取消数据中的选中标识
				self.cancelSelectedCity('sid',id);// 取消选中栏中的当前项
				self.citySelectedOper(pid);
			}else{
				// 设置选中状态，添加选中数据
				$em.addClass(className);
				self.citySelected(id,pid,true);
				self.addSelectedCity(options);
				self.citySelectedOper(pid);
			}
		},
			// 省份选中状态改变
		"citySelectedOper" : function(id){
			var self = this,
				parentName = "",
				listData = [],
				i = 0,
				len = 0,
				provinceDom = self.provinceElem.find('[sid="'+id+'"]'), 
				checkDom ={},
				t1 = false, // 选中状态确认
				t2 = false, // 未选中状态确认
				res = [];
			if(provinceDom.length === 0){return;}
			parentName = provinceDom.text();
			checkDom = provinceDom.find('i');
			listData = self.cityDataFind('pro',parentName)
			if(listData === -1){return;}
			listData = [].concat(listData['val']);
			// 根据保存的数据判断选中状态,并提取选中数据
			for(i,len = listData.length;i<len;i++){
				if(listData[i]['t']){
					t1 = true;
					res.push(listData[i]);
				}else{
					t2 = true;
				}
			}
			// // 提取选中数据
			// res = listData.filter(function(obj){
			// 	return obj['t'];
			// });
				// 现在为部分选中状态
			if(t1 && t2){ 
				if(checkDom.hasClass('city-all')){
					checkDom.removeClass('city-all');
					// 删除省添加市
					self.cancelSelectedCity('sid',id);
					self.addSelectedCity(res);
				}
				if(!checkDom.hasClass('city-part')){
					checkDom.addClass('city-part');
				}
			}
				// 现在为全部选中状态
			else if(t1 && !t2){
				if(checkDom.hasClass('city-part')){
					checkDom.removeClass('city-part');
				}
				if(!checkDom.hasClass('city-all')){
					checkDom.addClass('city-all');
					// 删除市添加省
					self.cancelSelectedCity('pid',id);
					self.addSelectedCity({'id':id,'name':parentName,'pid':0});
				}

			}
				// 现在为全部未选中状态
			else if(!t1 && t2){
				if(checkDom.hasClass('city-all')){
					checkDom.removeClass('city-all');
				}
				if(checkDom.hasClass('city-part')){
					checkDom.removeClass('city-part');
				}
			}
		},
			// 
			/**
			 * * 修改城市选中状态
			 * @param  {number} sid [选中省份|城市的编号]
			 * @param  {number} pid [父级单位编号]
			 * @param  {booler} bl  [true:选中|false:未选中]
			 */
		"citySelected" : function(sid,pid,bl){
			var self = this,
					// 获取保存的数据，在保存的数据中修改，达到数据统一
				selectedData;
			if(pid === 0){
				// 改变省份下的城市
				selectedData = self.cityDataFind('pro',self.provinceDataFind('id',sid)['name']);
				$.each(selectedData['val'],function(){
					this['t'] = bl;
				});
			}else{
				selectedData = self.selectedCityDataFind(sid,pid);
				if(selectedData){
					selectedData['t'] = bl;
				}
			}
		},
			// 添加选中城市
		"addSelectedCity" : function(options){
			var self = this,
				cityStr = "",
				dataList = self.isArray(options) ? options : [options],
				i = 0,
				len = dataList.length;
			for(i;i<len;i++){
				cityStr += '<span sid="'+ dataList[i]['id'] +'" pid="'+ dataList[i]['parentid'] +'"><i class="dele"></i>'+ self.trim(dataList[i]['name']) +'</span>';
			}
			self.checkedCityBox.append(cityStr);
		},
			// 选中项删除
		"removeSelectedCity" : function(element){
			var self = this,
				options = self.getEventObjData(element.parentNode),
				selectedData = [],
				sid = options['id'],
				pid = options['parentid'],
				cityName = options['name'],
				cityList = self.cityBox.find('li[sid="'+ sid +'"]'),
				cityStr = "",
				cityArr = [],
				i = 0,
				slen = 0;
			if(pid === 0){ // 删除省份
					// 查询该省份下的所有城市数据
				selectedData = self.cityDataFind('pro',cityName);
				if(selectedData === -1){
					return;
				}
					// 将城市设置为未选中状态
				self.citySelected(sid,pid,false);
					// 将选项从选中队列中删除
				self.cancelSelectedCity('sid',sid);
					// 改变省份下城市选中状态
				self.citySelectedOper(sid);
				if(self.showPro === cityName){
					// 当前选中列表在城市选择框中显示
					// 重新填充城市选项
					self.cityFill(selectedData);
				}
			}else{ // 选中城市
					// 修改当前城市的选中状态
				self.citySelected(sid,pid,false);
					// 将选项从选中队列中删除
				self.cancelSelectedCity('sid',sid);
					// 判断省份选中状态是否改变
				self.citySelectedOper(pid);
				if(cityList.length !==0 && cityList.hasClass(self.cityCheckedClassName)){
					cityList.removeClass(self.cityCheckedClassName);
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
		},
		/**数据处理模块**/
			// 从事件对象|DOM对象中提取数据信息
			// 传入事件对象
			// 返回最终提取结果
			// object = {
			//     id:[number] 该条记录的ID值,
			//     name: [string] 该条记录的名字,
			//     parentid: [number] 父级数据记录的ID值,
			//     ctg: [object html] 事件监听器,
			//     tg: [object] 事件触发器
			// }
		"getEventObjData" : function(ops){
			var obj = {},em,$em;
			if(ops.currentTarget){ // 事件对象
				em = ops.currentTarget;
				obj['tg'] = ops.target;
				obj['ctg'] = em;
			}else if(ops.nodeType){ // DOM对象
				em = ops;
			}else{return obj;}
			$em = $(em);
			obj['id'] = parseInt($em.attr('sid'));
			obj['parentid'] = parseInt($em.attr('pid'));
			obj['name'] = $em.text();
			return obj;
		},
			// 城市数据获取
			// obj: 需要查询的省份信息 {id: 1, name: "北京市", parentid: 0}
			// callback: 回调函数，传入两个参数[查询到的数据,传入的obj对象]
		"cityDataMade" : function(obj,callback){
			var self = this,
				cityFindOf = self.cityDataFind("pro",obj['name']); // 查找数据是否已经保存在本地
			if(cityFindOf === -1){
				$.getJSON('./json/city_'+ obj['id'] +'.json',function(data){
					var dataPro = {"pro":obj['name'],"val":data};
					self.citys.push(dataPro);
					if( typeof callback === "function" ){
						// callback(event);
						callback.call(self,dataPro,obj);
					}
				})
			}else{
				callback.call(self,cityFindOf,obj);
			}
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
			// 省市分类数据查询
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

		/**工具类模块**/
			// 判断对象是否为数组
		"isArray": function(obj){
			if(Array.isArray){
				return Array.isArray(obj);
			}else{
				return Object.prototype.toString.call(obj) === "[object Array]";
			}
		},
		"trim": function(string){
			if(String.prototype.trim){
				return string.trim();
			}else{
				return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
			}
		}
	}
	window.cityChecked = new CityChecked;
}(window.jQuery);