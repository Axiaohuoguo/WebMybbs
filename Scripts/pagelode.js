/// <autosync enabled="true" />
/// <reference path="jquery-3.4.1.js" />
/// <reference path="jquery-3.4.1.slim.js" />
/// <reference path="CommFunction.js" />


//获得文章list
 function  getArtiList(linenumber, clasID,listtdid)
 {
    var tdid = "#listtd" + listtdid.toString();
    var s = "{ 'linenumber': '" + linenumber + "', 'clasID': '" + clasID + "' }";    
    var ulS = "<ul>";
    var liS = "<li><span class='labtime'>";
    var aS = "</span><a href='show.html?ID=";
    var li = "";
    var ulE = "</ul>";    
    $(document).ready(function () {
        $.ajax({
            type: "POST",
            url: "../WebSevers/reception.aspx/getArtiList",
            contentType: "application/JSON; charset=utf-8",
            dataType: "JSON",
            data: s,
            beforeSend: function () {
                $(".container").hide();
                $("#sk-three-bounce").show();

            },
            complete: function () {

                $("#sk-three-bounce").hide();
                $(".container").show();
            },
            success: function (data) {               
                //console.log(data);
                var tdhtml = "";
                var arr = data.d;
                var len = arr.length;
                for (var i = 0; i < len; i++) {
                    var id = arr[i].ID;
                    var title = strDispose(arr[i].wtitle,8,'...');
                    var time =getFDate(arr[i].wpostedtime) ;
                    li += liS + time+aS+ id + "'>" + title + "</a></li>";
                }  
                tdhtml = ulS + li + ulE;
                //alert(tdhtml.toString());
                $(tdid).html(tdhtml.toString());

            },
            error: function (err) {
                console.log("Err" + err)                
            }
        });
    });
 }
///获取用户Session
 var guserName = "";
 function getUserSession()
 {
     $(document).ready(function () {
         var usa = "<li id='liUser'><a id='_username' href='#' title=个人中心>";
         var qut = " <li id='quit'><img onclick='quit()' title='退出登录' src='images/qut.png' typeof='buton'/></li>";
         $.ajax({
             type: "POST",
             url: "../WebSevers/reception.aspx/useVerifier",
             contentType: "application/JSON; charset=utf-8",
             dataType: "JSON",
             async:false ,
             success: function (data) {
                 //console.log(data);
                 if (data.d != "-1")
                 {
                     // $("#liUser").html(usa + data.d + "</a>" );
                     $("ul.site-nav.topmenu").empty();
                     $("ul.site-nav.topmenu").html(usa + data.d + "</a></li>" + qut);
                     $("#imgEdi").show();
                     guserName = data.d;
                     var Arrusinfo = getUsreinfo(guserName);
                     //console.log(Arrusinfo);
                     
                 }
             },
             error: function (err) {
                 console.log("Err" + err)
                 
             }

         });
     });
 }

///验证用户操作---①
 function isNameorSid(nameorSid)
 {
     var data = "{ 'userUidorUserName': '" + nameorSid + "' }";
     $.ajax({
         type: "POST",
         url: "../WebSevers/Management.aspx/isMatching",
         contentType: "application/JSON; charset=utf-8",
         dataType: "JSON",
         data:data,
         success: function (data) {
             console.log(data);
             if (data.d == "-1"||data.d=="-2")
             {
                 
                 $("bady").empty();
                 console.log("非法操作！");
                 window.location.href = "404.html";
             }
         },
         error: function (err) {
             console.log(err)

         }

     });
 }

///验证用户操作---②isBelong(string User,string AriID)
 function isBelong(User, AriID)
 {
     var data = "{ 'User': '"+User+"', 'AriID': '"+AriID+"' }";
     $.ajax({
         type: "POST",
         url: "../WebSevers/Management.aspx/isBelong",
         contentType: "application/JSON; charset=utf-8",
         dataType: "JSON",
         data: data,
         success: function (data) {
             console.log("是否属于");
             console.log(data);
             if (data.d != "1")
             {
                 if (data.d == "-1")
                 {
                     $("bady").empty();
                     console.log("非法操作！");
                     window.location.href = "404.html";
                     return;
                 }
                 if (data.d == "-2")
                 {
                     alert("服务器错误！")
                     window.location.href = "404.html";
                 }
             }

         },
         error: function (err) {
             console.log(err)

         }

     });
 }

///退出登录
 function quit()
 {
         
         $.ajax({
             type: "POST",
             url: "../WebSevers/reception.aspx/quit",
             contentType: "application/JSON; charset=utf-8",
             dataType: "JSON",
             success: function (data) {
                 //console.log(data);
                 window.location.reload();
             },
             error: function (err) {
                 console.log("Err" + err)

             }

         });
 }

 ///通过文章ID加载文章内容

function getloadConteByid()
 {
      var id = getUrlParam("ID");
     var s = "{ 'artiID': '" + id + "' }";
     $.ajax({        
         type: "POST",
         url: "../WebSevers/reception.aspx/getartiContentByID",
         contentType: "application/JSON; charset=utf-8",
         dataType: "JSON",
         data: s,
         beforeSend: function () {
             $(".container").hide();
             $("#sk-three-bounce").show();
             
         },
         complete: function () {
             
             $("#sk-three-bounce").hide();
             $(".container").show();
         },
         success: function (data) {
             $("body").hide();
            // console.log(data);
             var arr = data.d;
             $("h1.article-title").html("<a href='#' title='"
                 + arr[0].wtitle + " '>" + arr[0].wtitle + "</a>");//标题
             $("time.time").text(getFDate(arr[0].wpostedtime));//时间
             $("span.item.article-meta-source").append(arr[0].wusername);
             $("span.item.article-meta-views").append(arr[0].wpviews);//阅读量
             $("span.item.article-meta-comment").append(arr[0].wcommentsnum);//评论数
             $("p.textpart").text(arr[0].wcontent);// 正文
             $("body").show();
         },
         error: function (err) {
             console.log("Err" + err)             
         }

     });
     getFile(id);
 }

///加载附件divImgS//getFileinfo( string AriID,string type)
function getFile(Aid)
{
    var imgHtml = "<img style='width: 100%; height: 300px;'title='图片附件'src='";//images/201610181557196870.png"/>";
    var s = "{ 'AriID': '"+Aid+"', 'type': 'img' }";
    $.ajax({
        type: "POST",
        url: "../WebSevers/reception.aspx/getFileinfo",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        data: s,
        success: function (data) {
            console.log("请求图片附件。。。");
            console.log(data);
            var arr = data.d;
            var len = arr.length;
            var imghtml = "";
            for (var i = 0; i < len; i++)
            {
                var imgurl = arr[i].url;
                imghtml += imgHtml + imgurl + "'/>";
            }
            $(".divImgS").append(imghtml);
        },
        error: function (err) {
            console.log(err)
        }

    });

    var Othdata = "{ 'AriID': '" + Aid + "', 'type': 'other' }";
    var othfileUlhtml = "";
    $.ajax({
        type: "POST",
        url: "../WebSevers/reception.aspx/getFileinfo",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        data: Othdata,
        success: function (data) {
            console.log("请求其他附件。。。");
            console.log(data);
            var arr = data.d;
            var len = arr.length;
            var indexof = 0;
            var filename = "";
            for (var i = 0; i < len; i++) {
                var othurl = arr[i].url;               
                indexof = othurl.lastIndexOf("\\");
                filename = othurl.substring(indexof+1);

                othfileUlhtml += "<li><a href='.." + othurl + "'>" + filename + "</a></li>";

            }
            $(".divFile").html("其他附件:<ul>" + othfileUlhtml + "</ul>");
        },
        error: function (err) {
            console.log(err)
        }

    });
}
       //其他附件:
       // <ul>
       //     <li><a href="../File/otherFile/文件ceshi.zip">文件ceshi.zip</a></li>
       //     <li><a href="../File/otherFile/文件ceshi.zip">文件ceshi.zip</a></li>
       //     <li><a href="../File/otherFile/文件ceshi.zip">文件ceshi.zip</a></li>
       // </ul>

///搜索
 function search()
 {
     var searchVal = $("#Texsearch").val();
         if (searchVal.length <= 0) {
             alert("请输入关键词");
             return;
         }
         else
         {
             var sval16 = ConvstrTo16(searchVal);
             window.open("list.html?Search="+sval16+"&page=1","_blank"); 
            // window.location.href = "list.html?Search=" + sval16;

         }



 }

///添加评论

 function addComment()
 {
     var ip = returnCitySN["cip"];
     var particleID = getUrlParam("ID").toString();
     var pcontent = $("#comment-textarea").val().toString();
     var s = "{ 'particleID': '" + particleID + "', 'pcontent': '"
         + pcontent + "', 'PIp': '" + ip + "' }";
     if (pcontent.length < 6 ||pcontent.length>150)
     {
         alert("评论内容在6-150个字符");
         return;
     }
     $.ajax({
         type: "POST",
         url: "../WebSevers/reception.aspx/addComment",
         contentType: "application/JSON; charset=utf-8",
         dataType: "JSON",
         data: s,
         success: function (data) {
             console.log(data);
             if (data.d == "0") {
                 alert("你还没有登录！即将跳转到登录界面...");
                 window.location.href = 'logn/logn.html';
                 return;
             }
             else if (data.d == "1") {
                 // alert("评论成功");
                 $("#comment-textarea").val("");
                 lodeComment()
                 return;
             }
             else if (data.d=="-1") {
                 alert("评论失败");
                 return;
             }
             else
             {
                 alert("发送严重错误请联系管理员\n错误信息" + data.d);
                 return;
             }
         },
         error: function (err) {
             console.log("Err" + err)
             alert("网络错误");
             return;
         }

     });
    
 }

//加载评论
 function lodeComment()
 {
     var particleID = getUrlParam("ID").toString();
     var s = "{ 'particleID': '" + particleID + "' }";
     $.ajax({
         type: "POST",
         url: "../WebSevers/reception.aspx/lodeComment",
         contentType: "application/JSON; charset=utf-8",
         dataType: "JSON",
         data: s,
         success: function (data) {
             console.log(data);
             var arr = data.d;
             var len = arr.length;
             if (len <= 0) {
                 return;
             }
             else
             {
                 var liS = "<li class='comment-content'>";
                 var spanL = "<span class='comment-f'>#";//+2楼层</span>";
                 var divcommMainS = "<div class='comment-main'>";
                 var pCom = "<p id='Pid"; //评论id'>";
                 var ReplyCom = "<a style='float:right' class='ReplyComm' >回复</a>";//预备回复的回复按钮
                 var ComUser = "<a class='address' href='#' rel='nofollow' target='_blank'>";//用户名</a>";
                 var ComTime = "<span class='time'>(";//2016/10/28 11:41:03)</span>";
                 var Sip = "<span>IP:";//192.168.0.0.1 </span>";
                 var CommConTex = " <br>";//评论内容+</p></div></li>
                 var Phtml = "";
                 for (var i = 0; i < len; i++)
                 {
                     var ID = arr[i].ID;
                     var PUserName = arr[i].pusername;
                     var Ptime = getFDateT(arr[i].ptime);
                     var Pip = arr[i].pIP;
                     var Pconte = arr[i].pcontent;
                     Phtml += liS + (spanL + (i + 1).toString()) + "</span>"
                         + divcommMainS + pCom + ID + "'>" + ReplyCom + ComUser + PUserName + "</a>"
                         + ComTime + Ptime + ")</span>" + Sip + Pip + "</span>"
                         + CommConTex + Pconte + "</p></div></li>";

                 }
                 $(".commentlist").html(Phtml);

             }
         },
         error: function (err) {
             console.log("Err" + err)
         }

     });

 }

///添加回复的回复

///加载回复的回复

///用户信息查询
 function getUsreinfo(username)
 {
     var s = "{ 'username': '"+username+"' }";
     $.ajax({
         type: "POST",
         url: "../WebSevers/reception.aspx/getUserinfoByName",
         contentType: "application/JSON; charset=utf-8",
         dataType: "JSON",
         data: s,
         async: false ,
         success: function (data) {
             console.log(data);
             var _usinfo =data.d;
             $("#_username").attr('href', 'management.html?Suid='+_usinfo[0].UID+'&Page=1')
             ///Labuser 用户名 、LabSuid uid 、文章数量: LabArNu、LabEmail LabPhone
             $("#Labuser").text(_usinfo[0].username);
             $("#LabSuid").text(_usinfo[0].UID);
             $("#LabEmail").text(_usinfo[0].email);
             $("#LabPhone").text(_usinfo[0].phone);
              getAriLin(username);
         },
         error: function (err) {
             console.log(err)

         }

     });
    
      
 }

////getAriNumb(string username)
 function getAriLin(username)
 {
     var s = "{ 'username': '"+username+"' }";
     $.ajax({
         type: "POST",
         url: "../WebSevers/reception.aspx/getAriNumb",
         contentType: "application/JSON; charset=utf-8",
         dataType: "JSON",
         data: s,
         success: function (data) {
             console.log(data);
             if (data.d != "-1" || data.d != "-2")
             {
                 $("#LabArNu").text(data.d);
             }
             else
             {
                 console.log("更新文章时候出错。。");
             }
         },
         error: function (err) {
             console.log(err);

         }

     });
 }


// <ol id="comment_list" class="commentlist">
 //<li class="comment-content">
 //    <span class="comment-f">#2楼层</span>
 //    <div class="comment-main">
 //        <p id="P--id">
 //            <a style="float:right" href="#" class="ReplyComm">回复</a>
 //            <a class="address" href="#" rel="nofollow" target="_blank">ID测试</a>
 //            <span class="time">(2016/10/28 11:41:03)</span>
 //            <span>IP:192.168.0.0.1 </span>                
 //            <br>评论内容啛啛喳喳开机了撒大声地
                
 //        </p>
//=============================================
 //        <div class="huifu">
 //            <a>IDhi</a>
 //            <span class="time">(2016/10/28 11:41:03)</span>
 //            <br />回复的回复 
 //        </div>
//    </div>
//============================================
 //</li>
 //<article class="excerpt excerpt-1">
 //      <a class="focus" href="#" title="提示文字" target="_blank" >
 //        <img class="thumb" data-original="images/201610181739277776.jpg" src="images/201610181739277776.jpg" alt="火锅分享"  style="display: inline;">
 //       </a>
 //   <header>
 //      <a class="cat" href="#" title="标签测试提示" >标签测试<i></i></a>
 //    <h2><a href="#" title="提示标题" target="_blank" >标题测试</a></h2>
 //  </header>
 //  <p class="meta">
 //    <time class="time"><i class="glyphicon glyphicon-time"></i> 2016-10-14</time>
 //    <span class="views"><i class="glyphicon glyphicon-eye-open"></i> 217</span> 
 //    <a class="comment" href="#" title="评论" ><i class="glyphicon glyphicon-comment"></i> 4</a></p>
 //  <p class="note">内容</p>
//</article>

