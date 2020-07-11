/// <autosync enabled="true" />
/// <reference path="jquery-3.4.1.js" />
/// <reference path="jquery-3.4.1.slim.js" />

//获取url传递参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

///时间格式准换--转换成：2016-07-11
function getFDate(date) {
    var d = eval('new ' + date.substr(1, date.length - 2));

    var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];

    for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
    return ar_date.join('-');
}
function dFormat(i) {
    return i < 10 ? "0" + i.toString() : i;
}

//转换成：2016-07-11 15:00:28
function getFDateT(date) {
    var d = eval('new ' + date.substr(1, date.length - 2));

    var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    var ar_time = [d.getHours(), d.getMinutes(), d.getSeconds()];

    for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
    for (var i = 0; i < ar_time.length; i++) ar_time[i] = dFormat(ar_time[i]);

    return ar_date.join('-')+' '+ar_time.join(':');
}
function dFormat(i) {
    return i < 10 ? "0" + i.toString() : i;
}


///获取url 参数值
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++)
    {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
   // return (false);
}

///字符串处理str--待处理串, number--保留前几位, replace--后面替换的内容
function strDispose(str, number, replace)
{
    var str1 = str.substring(0, number);
    var cstr = str1 + replace;
    return cstr;
}
//字符串转16进制
function ConvstrTo16(str)
{    
    var val = "";
    for (var i = 0; i < str.length; i++)
    {
        if (val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += "%" + str.charCodeAt(i).toString(16);
    }
    return val;
}
//16转str
function Conv16Tostr(str)
{
    var val="";
    var arr = str.split("%");
    for (var i = 0; i < arr.length; i++)
    {
        val += String.fromCharCode(parseInt(arr[i], 16));
    }
    return val;
}
