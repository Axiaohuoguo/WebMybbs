document.getElementById("add-fil-btn").addEventListener("change", function () {
    var obj = this,
        length = obj.files.length,
        arrTitle = []; //存标题名
    _html = '';

    for (var i = 0; i < length; i++) {
        var reader = new FileReader();
        if (!reader) {
            console.log('对不起，您的浏览器不支持！请更换浏览器试一下');
            return;
        }
        //存储上传的多张图片名字
        arrTitle.push(obj.files[i].name)

        reader.error = function (e) {
            console.log("读取异常")
        }

        //iffi语法
        ; (function (i) {
            //读取成功
            reader.onload = function (e) {
                //console.log(e)
                var _src = e.target.result;

                //节点
                var divItem = document.createElement('div');
                divItem.setAttribute('class', 'item');
                var divPic = document.createElement('div');
                divPic.setAttribute('class', 'pic-box');
                var img = document.createElement('a');
                img.setAttribute('class', 'a');
                img.setAttribute('src', _src);
                var divTk = document.createElement('div');
                divTk.setAttribute('class', 'tk')
                var spanDel = document.createElement('span');
                spanDel.setAttribute('class', 'del');
                spanDel.setAttribute('title', arrTitle[i]);
                spanDel.innerText = 'x';

                divTk.innerHTML = arrTitle[i];

                divItem.appendChild(divPic);
                divPic.appendChild(img);
                divItem.appendChild(divTk);
                divItem.appendChild(spanDel);

                //增加节点结构
                var OtgroupTu = document.getElementById('OtgroupTu');
                OtgroupTu.insertBefore(divItem, OtgroupTu.firstChild);

                //增加删除节点
                spanDel.onclick = function () {
                    removeItem(this);
                    return false;
                };

            };
        })(i)

        reader.onloadstart = function () {

        }
        reader.onprogress = function (e) {
            if (e.lengthComputable) {
                console.log("正在读取文件")
            }
        };
        reader.readAsDataURL(obj.files[i]);
    }

})

//删除图片
function removeItem(delNode) {
    var itemNode = delNode.parentNode,
        title = delNode.getAttribute('title');
    var flag = confirm("确认要删除名为：" + title + "的文件？");
    if (flag) {
        itemNode.parentNode.removeChild(itemNode);
        console.log('删除成功~')
    }
    return false;
}
