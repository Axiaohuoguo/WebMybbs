/// <autosync enabled="true" />
/// <reference path="jquery-3.4.1.js" />
/// <reference path="jquery-3.4.1.slim.js" />
/// <reference path="CommFunction.js" />

//<tr>
//    <td class="Tdcheck" ><input name="chlist" type="checkbox" value="001"/ ></td>
//    <td class="TdTitle" >标题测试</td>
//    <td class="TdTime">2019-11-11</td>
//    <td class="Tdoperate"><a href="#"> 修改 </a></td>
//</tr>

function getAriNumBySuid()
{
    var Suid = getUrlParam("Suid");
    var data = "{ 'Suid': '" + Suid + "' }";
    $.ajax({
        type: "POST",
        url: "../WebSevers/Management.aspx/getUserAriCountBy",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        data: data,
        async:false,
        success: function (data) {
            
            if (data.d == "-1" || data.d == "-2")
            {
                console.log("查询出错");
                alert("查询出错");
                return;
            }
            else
            {
                console.log(data);
                var countNumb = data.d;
                getUserAriListBySuid(countNumb);
            }
        },
        error: function (err) {
            console.log(err)
            console.log("请求错误...");
        }

    });
}

///通过用ID获得用户文章列表getAriListBySuidandPage(string Suid, string page)
function getUserAriListBySuid(countNumb)
{
    var Suid = getUrlParam("Suid");
    var page = getUrlParam("Page");
    var trchec = "<tr> <td class='Tdcheck' ><input name='chlist' type='checkbox' value='";//001"/ ></td>";
    var trtitle = "<td class='TdTitle' >";//标题测试</td>"
    var trtime = "<td class='TdTime'>";//2019-11-11</td>"
    var trcaoz = "<td class='Tdoperate'><a href='publish.html?edit=";//修改'> </a></td></tr>"
    var data = "{ 'Suid': '" + Suid + "', 'page': '" + page + "' }";
    var tabhtml = "";
    $.ajax({
        type: "POST",
        url: "../WebSevers/Management.aspx/getAriListBySuidandPage",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        data: data,
        async:false,
        success: function (data) {
            console.log(data);
            loaderPagination(countNumb)
            var arr = data.d;
            var len = arr.length;
            for (var i = 0; i < len; i++)
            {
                tabhtml += trchec + arr[i].ID + "'/ ></td>"
                    + trtitle + arr[i].wtitle + "</td>"
                    + trtime + getFDateT(arr[i].wpostedtime) + "</td>"
                    + trcaoz + arr[i].ID + "'>修改</a></td></tr>";
            }
            $("#tabMageList").append(tabhtml);
        },
        error: function (err) {
            console.log(err)
        }

    });
}

///加载页码count--数据行数/类别
function loaderPagination(count) {
    $(".pagination").show();
    var ye = Math.ceil(count / 15);
    $("#sumYe").text("共 " + ye.toString() + " 页");
    var thisPage = Number(getUrlParam("Page"));

    $(".next-page").html("<a href='?Suid=" + getUrlParam("Suid") + "&Page="
        + (thisPage + 1).toString() + "'>下一页</a>")
    if (thisPage >= 1) {
        if (thisPage > 1) {
            $(".prev-page").append("<a href='?Suid=" + getUrlParam("Suid")
    + "&Page=" + (thisPage - 1).toString() + "'>上一页</a>");
        }

        if (thisPage >= ye) {
            $(".next-page").html("");
        }
        var strLi = "";
        for (var i = 1; i <= ye; i++) {
            strLi += "<li><a href='?Suid="
            + getUrlParam("Suid") + "&Page="
            + i + "'>" + i + "</a></li>";
        }
        $(".prev-page").after(strLi);

    }

}


function deleteArticle()
{
    $("#ButDel").click(function ()
    {
        
        //var arrCh = $('input:checkbox:checked');
        console.log("--");
        console.log($("input[name='chlist']:checked"));
        var arrCh = $("input[name='chlist']:checked");
        var len = arrCh.length;
        var ArrCh = new Array();
        if (len == 0) {
            alert("未选择任何数据");
            return;
        }
        if (confirm("确定删除选中数据?")) {
            for (var i = 0; i < len; i++) {
                ArrCh.push(arrCh[i].defaultValue.toString());

            }
            var AriDsplit = ArrCh.join(",");
            var data = "{ 'ID': '" + AriDsplit + "' }";
            $.ajax({
                type: "POST",
                url: "../WebSevers/Management.aspx/deleteAriByID",
                contentType: "application/JSON; charset=utf-8",
                dataType: "JSON",
                data: data,
                success: function (data) {
                    console.log(data);
                    if (data.d == "0") {
                        alert("删除失败！");
                        return;
                    }
                    if (data.d == "-2") {
                        alert("失败！未知错误！");
                        return;
                    }
                    else {
                        alert("成功删除" + data.d + "条数据");
                        window.location.reload();
                    }

                },
                error: function (err) {
                    console.log(err)
                }

            });

        }
        else
        {
            return;
        }

    });
}

