import unicodeToPinyinJson from './unicode_to_pinyin4.js';

class Translate{
    constructor(){
    }

    /**
     * @param {string} name 
     */
    go(name){
        if (!name) return; 
        var arrs;
        arrs = this.ToUnicodeWithoutTitle(name);
        arrs = this.ToPinYin(arrs);
        arrs = this.removeTone(arrs);
        arrs = this.permutation(arrs);
        return arrs;
    }

    /**
     * 去除音调，再去重
     * @param {array} arrs 
     */
    removeTone(arrs){
        return arrs.map(item => {
            item = item.join('').split(/\d/);
            if(!(item.length == 1)) item.pop();
            return Array.from(new Set(item));
        })
    }

    /**
     * 排列组合
     * @param {array} arrs
     */
    permutation(arrs){
        var arrL = arrs.length;
        var group = [];
        /**
         * 循环体
         * @param {array} item 
         * @param {number} i 
         * @param {string} str 
         * @return {array} {{所有可能的排列}}
         */
        var loop = (item, i, str) => {
            var arr;
            if (!str) {
                arr = [];
            } else {
                arr = str.split(',')
            }
            for(var k = 0, l = item.length; k < l; k++){
                if (!str) {
                    arr = [];
                } else {
                    arr = str.split(',')
                }   //重置arr 避免push多个值
                arr.push(item[k]);
                var temp = arr.join(',');
                var t = i;
                if(i == arrL-1)
                    group.push(arr.join(','));
                if(i < arrL-1)
                    loop(arrs[++t], t, temp);
            }
        };
        loop(arrs[0], 0);

        return group.map(item => item.split(',').join('').toLowerCase());
    }

    /**
     *根据传入的汉字的Unicode编码数组，查找拼音
     * @param Array
     */
    ToPinYin(array){
        var pinyinArray = new Array();
        for (var index in array) {
            pinyinArray.push(this.findPinyinByUnicode(array[index])); 
        }
        return pinyinArray;
    }

    /**
     * 把汉字转换为Unicode字符，初始版本使用了escape()函数，后续修改
     * @param str
     * @returns {string}
     */
    ToUnicode(str){
        return escape(str).replace('%u', '').toUpperCase();
    }


    UnUnicode(str){
        return unescape(str.replace(/\\/g, "%"));
    }

    ToUnicodeWithoutTitle(str){
        var result = []; // 用于保存结果
        // var pre = ''; // 用于保存连续非汉字
        var i, l, item;
        for(i = 0, l = str.length; i < l; i++){
            if(str[i] === ' ') {
                continue;
            }
            item = this.ToUnicode(str[i]);
            result.push(item)
        }
        return result;
    }

    /**
     * 根据Unicode查找拼音，由于多音字的存在，返回数组
     * @param str
     * @returns {*|unicodeToPinyinJson.pinyin}
     */
    findPinyinByUnicode(str){
        for (var i in unicodeToPinyinJson) {
            if (str == unicodeToPinyinJson[i].unicode) {
                return unicodeToPinyinJson[i].pinyin;
            }
        }
        return [str];
    }

}

export default new Translate();
