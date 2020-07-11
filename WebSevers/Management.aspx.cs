using DbMybbsModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class WebSevers_Management : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    /// <summary>
    /// 验证用户名一致性
    /// </summary>
    /// <param name="userUidorUserName"></param>
    /// <returns></returns>
    [WebMethod]
    public static string isMatching(string userUidorUserName)
    {
        var session = HttpContext.Current.Session["user"];
        if (session == null)
        {
            return "-1";//没有登录
        }
        else
        {
            
            if (userUidorUserName.ToString()== session.ToString())
            {
                return "0";//正常
            }
            string sql = "select username from userinfo where UID='"+ userUidorUserName + "'";
            DbMybbsEntities entit = new DbMybbsEntities();
            List<userinfo> userList = entit.ExecuteStoreQuery<userinfo>(sql).ToList();  
            var  username = userList[0].username;          
            if (session.ToString() != username.ToString())
            {
                return "-2";//非法操作
            }
        }
        return "0";//正常
    }

    /// <summary>
    /// 判断文章是否属于该用户
    /// </summary>
    /// <param name="User"></param>
    /// <param name="AriID"></param>
    /// <returns></returns>
    [WebMethod]
    public static string isBelong(string User,string AriID)
    {
        //select COUNT(*) as line from articleinfo where wusername 
        //= (select username from userinfo where UID='100002') and ID ='1909'

        string sql = "select COUNT(*) as line from articleinfo where wusername = '"
            + User+"' and ID ='"+AriID+"'";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<statisticsinfo> staList = entit.ExecuteStoreQuery<statisticsinfo>(sql).ToList();
            if (staList[0].line == 1)
            {
                return "1";//属于
            }
            else
            {
                return "-1";//NO
            }
        }
        catch (Exception e)
        {
            return "-2";
            throw;
        }
             
    }

    /// <summary>
    ///  通过用户UID查询文章数
    /// </summary>
    /// <param name="Suid"></param>
    /// <returns></returns>
    [WebMethod]
    public static string getUserAriCountBy(string Suid)
    {
        
        //select COUNT (*) line from dbo.articleinfo where dbo.articleinfo.wusername 
        //= (select userinfo.username from dbo.userinfo where dbo.userinfo.UID = '100009')
        string sql = "select COUNT (*) line from dbo.articleinfo where dbo.articleinfo.wusername "+
            "= (select userinfo.username from dbo.userinfo where dbo.userinfo.UID = '"+Suid+"')";

        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<statisticsinfo> staList = entit.ExecuteStoreQuery<statisticsinfo>(sql).ToList();
            int countNu = staList[0].line;
            if (countNu >= 0)
            {
                return countNu.ToString();
            }
            else
            {
                return "-1";//数据出错
            }
        }
        catch (Exception e)
        {
            return "-2";//查询出错
            throw;
        }

    }

    /// <summary>
    /// 通过页码和用户ID获取用户文章列表
    /// </summary>
    /// <param name="Suid"></param>
    /// <param name="page"></param>
    /// <returns></returns>
    [WebMethod]
    public static List<articleinfo> getAriListBySuidandPage(string Suid, string page)
    {
        //select T.*from
        //(
        //    SELECT ID,classID,wtitle,wpostedtime, row_number()
        //    over(order by wpostedtime desc) as row
        //    FROM dbo.articleinfo
        //    WHERE dbo.articleinfo.wusername =
        //    (select userinfo.username from dbo.userinfo where dbo.userinfo.UID = '100009')
        //)T
        //where row between 1 and 5
        int pag = Convert.ToInt32(page);
        int pages = ((pag - 1) * 15) + 1;
        int pagee = (15 * pag);
        string sql = "select T.* from ( SELECT ID,classID,wtitle,wpostedtime, row_number() " +
            "over(order by wpostedtime desc) as row " +
            "FROM dbo.articleinfo  WHERE dbo.articleinfo.wusername =" +
            "(select userinfo.username from dbo.userinfo where dbo.userinfo.UID = '" + Suid + "')" +
            ")T where row between "+pages+" and "+pagee+"";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<articleinfo> artiList = entit.ExecuteStoreQuery<articleinfo>(sql).ToList();
            return artiList;
        }
        catch (Exception)
        {

            throw;
        }

    }

    /// <summary>
    /// 删除文章和文件
    /// </summary>
    /// <param name="ID"></param>
    /// <returns></returns>
    [WebMethod]
    public static string deleteAriByID(string ID)
    {
        string sqlisSeleingFil = "select * from dbo.fileinfo where articleID in (" 
            + ID + ") and fType = 'img'";//查询文章是否有图片附件

        string sqlisSeleothFil = "select * from dbo.fileinfo where articleID in (" 
            + ID + ") and fType = 'other'";//查询文章是否有其他附件

        string sqlSeleFill = "select * from dbo.fileinfo where articleID in (" 
            + ID + ")";//查询是否有附件

        string sqldelFile = "DELETE FROM dbo.fileinfo  WHERE articleID in (" 
            + ID + ")";//删除附件表数据

        string sqlArit = "DELETE FROM dbo.articleinfo WHERE ID in ("
            +ID+")";//删除文章表数据

        try
        {
            int Cou = 0;
            DbMybbsEntities entit = new DbMybbsEntities();
            List<fileinfo> allFileList = entit.ExecuteStoreQuery<fileinfo>(sqlSeleFill).ToList();
            if (allFileList.Count>0)
            {
                List<fileinfo> imgfileList = entit.ExecuteStoreQuery<fileinfo>(sqlisSeleingFil).ToList();
                List<fileinfo> othfileList = entit.ExecuteStoreQuery<fileinfo>(sqlisSeleothFil).ToList();
                if (imgfileList.Count > 0)
                {
                    //删除图片数据及其文件
                    for (int i = 0; i < imgfileList.Count; i++)
                    {
                        string imgurlTemp = imgfileList[i].url;
                        string imgurl = imgurlTemp.Replace(@"\", @"/");
                        var path = HttpContext.Current.Server.MapPath("~" + imgurl);
                        File.Delete(path);
                    }

                }
                if (othfileList.Count > 0)
                {
                    //删除其他文件数据及其文件
                    for (int i = 0; i < othfileList.Count; i++)
                    {
                        string othurl = othfileList[i].url;
                        var path = HttpContext.Current.Server.MapPath("~" + othurl);
                        File.Delete(path);
                    }
                    
                }
                int FilCou = entit.ExecuteStoreCommand(sqldelFile);

                
            }
            int ArCou = entit.ExecuteStoreCommand(sqlArit);
            Cou = ArCou;
            if (ArCou <= 0)
            {
                return "0";//操作数据库失败
            }

            return Cou.ToString(); 

        }
        catch (Exception e)
        {
            return "-2";
            throw;
        }
    }

    [WebMethod]
    public static string setAriEditor(string clasID, string ID, string wTitle, string wContext)
    {
        string wtime = DateTime.Now.ToLocalTime().ToString();
        string sql = "UPDATE articleinfo SET classID = '"+ clasID 
            + "' ,wtitle='"+wTitle+ "',wpostedtime ='"+wtime+ "' ,wcontent='"
            +wContext+"' WHERE ID='" + ID+"'";
        DbMybbsEntities entit = new DbMybbsEntities();
        try
        {
            int Cou = entit.ExecuteStoreCommand(sql);
            if (Cou == 1)
            {
                return "1";//成功
            }
            else
            {
                return "-1";//失败
            }
        }
        catch (Exception e)
        {
            return "-2";//服务器错误
            throw;
        }
        

    }


}