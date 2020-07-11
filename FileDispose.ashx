<%@ WebHandler Language="C#" Class="FileDispose" %>

using System;
using System.Web;
using DbMybbsModel;

public class FileDispose : IHttpHandler
{

    DbMybbsEntities entit = new DbMybbsEntities();
    public void ProcessRequest (HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        var type = context.Request.Form["type"];
        if (type == "img")
        {
            var imgCode = imgFile(context);
            if (imgCode =="1")
            {
                context.Response.Write("(img)状态码:1 上传成功");
                return;
            }
            if (imgCode =="-1")
            {
                context.Response.Write("(img)状态码:-1 上传失败数据库更新失败");
                return;
            }
            if (imgCode =="1")
            {
                context.Response.Write("(img)状态码:1 上传失败");
                return;
            }

        }
        else
        {
            var othCode=otherFile(context);
            if (othCode =="1")
            {
                context.Response.Write("(oth)状态码:1 上传成功");
                return;
            }
            if (othCode =="-1")
            {
                context.Response.Write("(oth)状态码:-1 上传失败数据库更新失败");
                return;
            }
            if (othCode =="1")
            {
                context.Response.Write("(oth)状态码:1 上传失败");
                return;
            }
        }

        // context.Response.ContentType = "text/plain";
        //context.Response.Write("Hello World");

    }
    /// <summary>
    /// 图片文件处理；
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public string imgFile(HttpContext context)
    {
        //insert into dbo.fileinfo VALUES ('1','\kk\kk','img','大火国')
        var imgUrl = "";
        var arID = context.Request.Form["arID"];
        var Username = context.Request.Form["Username"];
        var imgfile = context.Request.Files;
        var pah = context.Server.MapPath("~")+"/File/imgFile";
        var i = 0;
        foreach (var item in imgfile.AllKeys)
        {
            i += 1;
            var File = imgfile[item];
            var name =File.FileName ;
            var newName = arID + "_" +Username+"_"+ i.ToString() + name;
            File.SaveAs(pah+"/"+newName);
            imgUrl = pah + "/" + newName;
            var indexOf = imgUrl.IndexOf(@"/");
            var Tempimgurl = imgUrl.Substring(indexOf);

            var sql = "insert into dbo.fileinfo VALUES ('"+arID+"','"+Tempimgurl+"','img','"+Username+"')";
            int coun = entit.ExecuteStoreCommand(sql);
            if (coun <= 0)
            {
                return "-1";//数据库更新失败
            }

        }

        if (imgUrl != null||imgUrl!="")
        {
            return "1";//上传成功
        }
        else
        {
            return "-2";//上传失败
        }
    }

    /// <summary>
    /// 其他文件处理
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    private string otherFile(HttpContext context)
    {
        var othFliUrl = "";
        var arID = context.Request.Form["arID"];
        var Username = context.Request.Form["Username"];
        var othFile = context.Request.Files;
        var path = context.Server.MapPath("~") + "/File/otherFile";
        var i = 0;
        foreach (var item in othFile.AllKeys)
        {
            i += 1;
            var File = othFile[item];
            var name = File.FileName;
            var newName = arID + "_" + Username + "_" + i.ToString() + name;
            File.SaveAs(path + "/" + newName);
            othFliUrl = path + "/" + newName;
            var indexOf = othFliUrl.IndexOf(@"/");
            var TempOthFileurl = othFliUrl.Substring(indexOf);
            var OthFileurl = TempOthFileurl.Replace(@"/",@"\");
            var sql = "insert into dbo.fileinfo VALUES ('"+arID+"','"+OthFileurl+"','other','"+Username+"')";
            int coun = entit.ExecuteStoreCommand(sql);
            if (coun <= 0)
            {
                return "-1";//数据库更新失败
            }
            //var newName = arID + "_" +Username+"_"+ i.ToString() + name;
            //File.SaveAs(pah+"/"+newName);
        }
        if (othFliUrl != null||othFliUrl!="")
        {
            return "1";//上传成功
        }
        else
        {
            return "-2";//上传失败
        }
    }


    public bool IsReusable {
        get {
            return false;
        }
    }

}