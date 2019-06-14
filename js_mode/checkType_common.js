/*
    实现一个工具类，用于检测所有的数据类型
    基本类型包括: String Number Boolean null undefined Symbol
    复杂类型：Object
    数组：Array
    函数： Function
*/

var Type = (function () {
    var typeArr = ['Array', 'Set', 'Object', 'Number', 'String', 'Null', 'Undefined', 'Boolean', 'Function', 'Symbol'];
    var Type = {};
    for (let i = 0, l = typeArr.length; i < l; i++) {
        ((type) => {
            // console.info(type);
            Type['is' + type] = function (value) {
                return Object.prototype.toString.call(value) === '[object ' +
                    type + ']'
            }
        })(typeArr[i]);
    }
    Object.defineProperty(Type, 'typeOf', {
        value: function (value) {
            // var key = Object.keys(Type);
            // console.info(this);
            var _self = this;
            for (let key in _self) {
                if (_self[key](value)) {
                    return key.slice(2);
                }
            }
            return '未知';
        }
    });
    return Type;
})();
var checkType = function (checkObj) {
    return Type.typeof.call(Type, checkObj);
}
module.exports = {
    Type,
    checkType
}