import unicodeToPinyinJson from './unicode_to_pinyin4.js';

class Translate{
    constructor(){
    }

    /**
     * @param {string} name 
     */
    go(name){
        var arrs;
        arrs = this.ToUnicodeWithoutTitle(name);
        if (!arrs) return; //如果传入的name不是中文
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
            item.pop();
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

        return group.map(item => item.split(',').join(''));
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
        return escape(str).replace(/%/g, "\\").toUpperCase();
    }


    UnUnicode(str){
        return unescape(str.replace(/\\/g, "%"));
    }

    ToUnicodeWithoutTitle(str){
        if (!new RegExp("^[\\u4e00-\\u9fa5]+$").test(str)) return false;
        var unicodeArray = this.ToUnicode(str)//.split("\\u"); //取消自动分组
        var unicodeWithoutTitleArray = new Array();
        var i = 0;
        while (i < unicodeArray.length) {
            unicodeWithoutTitleArray.push(unicodeArray.substring(i + 2, i + 6));
            i += 6;
        }
        return unicodeWithoutTitleArray;
    }

    /**
     * 根据Unicode查找拼音，由于多音字的存在，返回数组
     * @param str
     * @returns {*|unicodeToPinyinJson.pinyin}
     */
    findPinyinByUnicode(str){
        for (var unicodeToPinyinObject of unicodeToPinyinJson) {
            if (str == unicodeToPinyinObject.unicode) {
                return unicodeToPinyinObject.pinyin;
            }
        }
    }

}

export default new Translate();
