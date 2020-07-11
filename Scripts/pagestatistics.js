/// <autosync enabled="true" />
/// <reference path="jquery-3.4.1.js" />
/// <reference path="jquery-3.4.1.slim.js" />
/// <reference path="CommFunction.js" />


//通过classID--判断数据行数
function getarticleListCount() {
    //<a target="_blank" href="show.html?ID=9>网络科技不发光8</a></h2></header><p class=" meta'="">
    //获取数据条数
    var clasID = getUrlParam("clasID");
    var ss = "{ 'classID': '" + clasID + "' }";
    $.ajax({
        type: "POST",
        url: "../WebSevers/reception.aspx/getClassCountByClassID",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        data: ss,
        success: function (data) {
            console.log(data);
            if (data.d == "0")
            {
                return 0;
            }
            if (data.d == "-1")
            {
                alert("服务器错误");
                return;
            }
            else
            {
                //Number(data.d);
                var con = Number(data.d);
                getarticleListByClassidT(con);
            }

        },
        error: function (err) {
            console.log("Err" + err)
            alert("请求失败");
        }

    });
}
//通过类别ID 加载文章列表
function getarticleListByClassidT(count)
{
    
    var articleS = "<article class='excerpt excerpt- ";   //第几个标签2">"
    var leftimg = "<a class='focus'href='#' title='图片提示文字' >"
        + "<img class='thumb' data-original='images/201610181739277776.jpg'"
        + " src='images/201610181739277776.jpg' alt='火锅分享'  style='display: inline;'></a>";//左边图片
    var labt = "<header> <a class='cat' href='#' title='火锅分享网' >火锅分享网<i></i></a>";//标签
    var title = "<h2><a target='_blank' href='show.html?ID=";//1>标题测试</a></h2></header>
    var subj1time = "<p class='meta'><time class='time'><i class='glyphicon glyphicon-time'></i> ";//2016-10-14</time>";
    var subjread = "<span class='views'><i class='glyphicon glyphicon-eye-open'></i> ";//217</span> "阅读量
    var subjcomm = "<a class='comment'  title='评论数' ><i class='glyphicon glyphicon-comment'></i>";// 4</a></p>";评论
    var subjcont = "<p class='note'>";//内容</p></article>";
    var clasID = getUrlParam("clasID");
    var page = getUrlParam("page");
    var s = "{ 'clasID': '"+clasID+"', 'page': '"+page+"' }";
    $.ajax({
        type: "POST",
        url: "../WebSevers/reception.aspx/getArtiListandConteT",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        data: s,
        success: function (data) {
            //console.log(data);
            loaderPagination(count);
            var arr = data.d;
            var len = arr.length;
            //alert(arr[0].wtitle);
            var articlehtml = "";
            for (var i = 0; i < len; i++) {
                var arttitle = arr[i].wtitle;
                var time = getFDate(arr[i].wpostedtime);
                var wco = arr[i].wcommentsnum;//评论
                var wvp = arr[i].wpviews;//阅读
                var cont = arr[i].wcontent;//正文
                if (cont.length > 100) {
                    cont = strDispose(cont, 150, '......');
                }
                var artID = arr[i].ID;
                articlehtml += articleS + ((i + 1).toString()) + "'>"
                    + leftimg + labt + title + artID + "'>" + arttitle +
                    "</a></h2></header>" + subj1time + time + "</time>"
                    + subjread + wvp + "</span>" + subjcomm + wco + "</a></p>"
                    + subjcont + cont + "</p></article>";
                   
            }
            $("#titleQ").after(articlehtml);


        },
        error: function (err) {
            console.log("Err" + err)
        }
    });
}

//通过文章标题关键词--判断数据行数
function getarticleListCountBytitle()
{
    //获取数据条数
    var titlekey = getQueryVariable("Search");
    var titleKey = Conv16Tostr(titlekey);
    var ss = "{ 'titleKey': '" + titleKey + "' }";
    $.ajax({
        type: "POST",
        url: "../WebSevers/reception.aspx/getTitileCountByArtiTirle",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        data: ss,
        success: function (data) {
            console.log(data);
            if (data.d == "0") {
                return 0;
            }
            if (data.d == "-1") {
                alert("服务器错误");
                return;
            }
            else {
                //Number(data.d);
                var con = Number(data.d);
                //getarticleListByClassidT(con);
                getarticleListByTitle(con);
            }

        },
        error: function (err) {
            console.log("Err" + err)
            alert("请求失败");
        }

    });
}

///通过标题关键词加载文章列表
function getarticleListByTitle(count) {
    var articleS = "<article class='excerpt excerpt- ";   //第几个标签2">"
    var leftimg = "<a class='focus'href='#' title='图片提示文字' >"
        + "<img class='thumb' data-original='images/201610181739277776.jpg'"
        + " src='images/201610181739277776.jpg' alt='火锅分享'  style='display: inline;'></a>";//左边图片
    var labt = "<header> <a class='cat' href='#' title='火锅分享网' >火锅分享网<i></i></a>";//标签
    var title = "<h2><a target='_blank' href='show.html?ID=";//1>标题测试</a></h2></header>
    var subj1time = "<p class='meta'><time class='time'><i class='glyphicon glyphicon-time'></i> ";//2016-10-14</time>";
    var subjread = "<span class='views'><i class='glyphicon glyphicon-eye-open'></i> ";//217</span> "阅读量
    var subjcomm = "<a class='comment'  title='评论数' ><i class='glyphicon glyphicon-comment'></i>";// 4</a></p>";评论
    var subjcont = "<p class='note'>";//内容</p></article>";

    var Ti = getQueryVariable("Search")
    var strTi = Conv16Tostr(Ti);
    var page = getUrlParam("page")
    //var s = "{ 'title': '" + strTi + "' }";
    var s = "{ 'titleKey': '" + strTi + "', 'page': '" + page + "' }";
    $.ajax({
        type: "POST",
        url: "../WebSevers/reception.aspx/getTitileCountByArtiTirleandPage",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        data: s,
        success: function (data) {
            loaderPaginationT(count);
            console.log(data);
            var arr = data.d;
            var len = arr.length;
            //alert(arr[0].wtitle);
            var articlehtml = "";
            for (var i = 0; i < len; i++) {
                var arttitle = arr[i].wtitle;
                var time = getFDate(arr[i].wpostedtime);
                var wco = arr[i].wcommentsnum;//评论
                var wvp = arr[i].wpviews;//阅读
                var cont = arr[i].wcontent;//正文
                if (cont.length > 100) {
                    cont = strDispose(cont, 150, '......');
                }
                var artID = arr[i].ID;
                articlehtml += articleS + ((i + 1).toString()) + "'>"
                    + leftimg + labt + title + artID + "'>" + arttitle +
                    "</a></h2></header>" + subj1time + time + "</time>"
                    + subjread + wvp + "</span>" + subjcomm + wco + "</a></p>"
                    + subjcont + cont + "</p></article>";

            }
            $("#titleQ").after(articlehtml);
            
        },
        error: function (err) {
            console.log("Err" + err)
        }
    });
}

///加载页码count--数据行数/类别
function loaderPagination(count)
{
    $(".pagination").show();
    var ye = Math.ceil(count / 5);
    $("#sumYe").text("共 " + ye.toString() + " 页");
    var thisPage = Number(getUrlParam("page"));

    $(".next-page").html("<a href='?clasID=" + getUrlParam("clasID") + "&page="
        + (thisPage + 1).toString() + "'>下一页</a>")
    if (thisPage >= 1)
    {
        if (thisPage > 1)
        {
                    $(".prev-page").append("<a href='?clasID=" + getUrlParam("clasID")
            + "&page=" + (thisPage - 1).toString() + "'>上一页</a>");
        }

        if (thisPage >= ye)
        {
            $(".next-page").html("");
        }
        var strLi = "";
        for (var i = 1; i <= ye; i++)
        {
            strLi += "<li><a href='?clasID="
            + getUrlParam("clasID") + "&page="
            + i + "'>" + i + "</a></li>";            
        }
        $(".prev-page").after(strLi);

    }

}

///加载页码count--数据行数/标题
function loaderPaginationT(count) {
    $(".pagination").show();
    var ye = Math.ceil(count / 5);
    $("#sumYe").text("共 " + ye.toString() + " 页");
    var thisPage = Number(getUrlParam("page"));
    //var Search = getQueryVariable("Search")
    $(".next-page").html("<a href='?Search=" + getQueryVariable("Search") + "&page="
        + (thisPage + 1).toString() + "'>下一页</a>")
    if (thisPage >= 1) {
        if (thisPage > 1) {
            $(".prev-page").append("<a href='?Search=" + getQueryVariable("Search")
    + "&page=" + (thisPage - 1).toString() + "'>上一页</a>");
        }

        if (thisPage >= ye) {
            $(".next-page").html("");
        }
        var strLi = "";
        for (var i = 1; i <= ye; i++) {
            strLi += "<li><a href='?Search="
            + getQueryVariable("Search") + "&page="
            + i + "'>" + i + "</a></li>";
        }
        $(".prev-page").after(strLi);

    }

}


//<nav class="pagination" style="display: none;">
//  <ul>
//    <li class="prev-page"></li>
//    <li class="active"><span>1</span></li>
//    <li><a href="?page=2">2</a></li>
//    <li class="next-page"><a href="?page=2">下一页</a></li>
//    <li><span>共 2 页</span></li>
//  </ul>
//</nav>
//================================
//<li class="active"><span>1</span></li>
//     <li><a href="?page=2">2</a></li>
//     <li class="next-page"><a href="?page=2">下一页</a></li>
//     <li><span>共 2 页</span></li>

