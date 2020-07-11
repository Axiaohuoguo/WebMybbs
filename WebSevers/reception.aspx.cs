using DbMybbsModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

/// <summary>
///  方法集
/// </summary>
public partial class WebSevers_WebSevers : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
    }
    [WebMethod]
    public static string Hello()
    {
        return "Hello";
    }

    /// <summary>
    /// 获取类别列表
    /// </summary>
    /// <returns></returns>
    [WebMethod]
    public static List<classinfo> getClassList()
    {
        string sql = "select * from dbo.classinfo ";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<classinfo> clasList = entit.ExecuteStoreQuery<classinfo>(sql).ToList();
            return clasList;
        }
        catch (Exception e)
        {

            throw;
        }
    }    


    /// <summary>
    /// 根据类别id获得文章标题列表
    /// 查询全部用top 100 PERCENT
    /// </summary>
    /// <param name="linenumber"></param>
    /// <param name="clasID"></param>
    /// <returns></returns>
    [WebMethod]
    public static List<articleinfo> getArtiList(string linenumber,string clasID)
    {
        //select top 5  ID,wtitle  from  dbo.articleinfo  where classID = '1'  order by wpostedtime desc 
        //select top 100 PERCENT   wtitle  from  dbo.articleinfo  where classID = '1'  order by wpostedtime desc 
        string sql = "select top "+Convert.ToInt32(linenumber)+
            "wpostedtime,ID,wtitle  from  dbo.articleinfo  where classID = '" +
            clasID+"'  order by wpostedtime desc ";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<articleinfo> artlist = entit.ExecuteStoreQuery<articleinfo>(sql).ToList();
            return artlist;
        }
        catch (Exception e)
        {
            throw;
        }

    }
    

    /// <summary>
    /// 通过类别ID和页码查询文章列表（包含内容）
    /// </summary>
    /// <param name="clasID"></param>
    /// <param name="page"></param>
    /// <returns></returns>
    [WebMethod]
    public static List<articleinfo> getArtiListandConteT(string clasID , string page)
    {
        //---假设每页显示5条--
        //--有row / 5-- 页取整
        // --一页为 1 - 5--1
        //--二页为 6 - 10--2
        //--三页为 11 - 15--3（ ((n - 1) * 5 + 1)  ）
        //--第n页为(n - 1) * 5 + 1) == 5 * n
        //select T.*from
        //(
        // select *, row_number()
        // over(order by wpostedtime desc) as row
        //  from dbo.articleinfo
        //  where dbo.articleinfo.classID = '2'
        //) T
        //where row between 1 and 5

        int pag = Convert.ToInt32(page);
        int pages = ((pag - 1) * 5) + 1;
        int pagee = (5 * pag);
        string sql = "select T.*from (select *, row_number() "
            +"over(order by wpostedtime desc) "
            +"as row from dbo.articleinfo "
            +"where dbo.articleinfo.classID = '"+clasID
            + "' ) T where row between " + pages + " and " + pagee + "";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<articleinfo> ariList = entit.ExecuteStoreQuery<articleinfo>(sql).ToList();
            return ariList;
        }
        catch (Exception e)
        {
            throw;
        }


    }

    /// <summary>
    /// 通过标题关键字和页码获得文章列表
    /// 
    /// </summary>
    /// <param name="titleKey"></param>
    /// <param name="page"></param>
    /// <returns></returns>
    [WebMethod]
    public static List<articleinfo> getTitileCountByArtiTirleandPage(string titleKey,string page)
    {
        //select T.*from
        //(
        //  SELECT *, row_number()

        //   over(order by wpostedtime desc) as row

        //   FROM dbo.articleinfo

        //   WHERE dbo.articleinfo.wtitle Like '%感%' or dbo.articleinfo.wcontent like '%感%'
        //)T
        //where row between 1 and 5
        int pag = Convert.ToInt32(page);
        int pages = ((pag - 1) * 5) + 1;
        int pagee = (5 * pag);
        string sql = "select T.*from ( "
            +"SELECT *, row_number() over(order by "
            + "wpostedtime desc) as row FROM dbo.articleinfo"
            +" WHERE dbo.articleinfo.wtitle Like '%"+ titleKey 
            + "%' )T where row between "+ pages + " and "+ pagee + "";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<articleinfo> artiList = entit.ExecuteStoreQuery<articleinfo>(sql).ToList();
            return artiList;
        }
        catch (Exception e)
        {

            throw;
        }

    }

    /// <summary>
    /// 获取某类别数据行数
    /// </summary>
    /// <param name="classID"></param>
    /// <returns></returns>
    [WebMethod]
    public static string getClassCountByClassID(string classID)
    {
        //select COUNT(*) as line   from dbo.articleinfo where  dbo.articleinfo.classID ='9' 
        string sql = "select COUNT(*) as line  from dbo.articleinfo"
            +" where  dbo.articleinfo.classID ='"+classID+"' ";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<statisticsinfo> counList = entit.ExecuteStoreQuery<statisticsinfo>(sql).ToList();
            
            if (counList.Count <= 0)
            {
                return "0";
            }
            else
            {
                int coun = Convert.ToInt32(counList[0].line);
                return coun.ToString();
            }
        }
        catch (Exception e)
        {
            return "-1";
            throw;
        }
    }

    /// <summary>
    /// 通过标题关键字获取行数
    /// </summary>
    /// <param name="titleKey"></param>
    /// <returns></returns>
    [WebMethod]
    public static string getTitileCountByArtiTirle(string titleKey)
    {
        //select COUNT(*) as line from dbo.articleinfo WHERE dbo.articleinfo.wtitle Like '%文%'
        string sql = "select COUNT(*) as line from dbo.articleinfo WHERE "
            +"dbo.articleinfo.wtitle Like '%"+titleKey+"%'";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<statisticsinfo> statList = entit.ExecuteStoreQuery<statisticsinfo>(sql).ToList();
            if (statList.Count <= 0)
            {
                return "0";
            }
            else
            {
                int coun = Convert.ToInt32(statList[0].line);
                return coun.ToString();
            }
        }
        catch (Exception e)
        {
            return "-1";
            throw;
        }

    }

    /// <summary>
    ///  用户登录
    /// </summary>
    /// <param name="userName">用户名</param>
    /// <param name="pawd"></param>
    /// <returns></returns>
    [WebMethod]
    public static bool userLogn(string userName,string pawd)
    {
        //select * from dbo.userinfo where dbo.userinfo.UID ='100001' and dbo.userinfo.password='123'
        publicFunction publicfunc = new publicFunction();
        string md5pawd =  publicfunc.Md5encryption(pawd).ToString();
        string sql = "select * from dbo.userinfo where dbo.userinfo.username ='" + userName
            + "' and dbo.userinfo.password='" + md5pawd + "'"; ;
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<userinfo> uselist = entit.ExecuteStoreQuery<userinfo>(sql).ToList();
            //List<userinfo> uselist2 = entit.ExecuteStoreQuery<userinfo>(sql2).ToList();
            if (uselist.Count >= 1)
            {
                HttpContext.Current.Session["user"] = userName.ToString();
                return true;
            }
            else
            {
                HttpContext.Current.Session["user"] = null;
                return false;
            }
        }
        catch (Exception e)
        {            
            //return false;
            throw;
        }
  
    }
    /// <summary>
    /// 用户Session验证
    /// </summary>
    /// <returns></returns>
    [WebMethod]
    public static string useVerifier()
    {
        if (HttpContext.Current.Session["user"] == null)
        {
            return "-1";
        }
        string user = HttpContext.Current.Session["user"].ToString();
        return user;
    }

    /// <summary>
    /// 通过用户名或UID查询用户信息
    /// </summary>
    /// <param name="username"></param>
    /// <returns></returns>
    [WebMethod]
    public static List<userinfo> getUserinfoByName(string username)
    {
        //select * from dbo.userinfo where dbo.userinfo.username ='小火锅' or UID='100001' 
        string sql = "";
        Regex regChina = new Regex("^[^\x00-\xFF]");
        Regex rg = new Regex("^[a-zA-Z]$");
        if (regChina.IsMatch(username) || rg.IsMatch(username))
        {
            sql = "select * from dbo.userinfo where dbo.userinfo.username ='" + username + "'";

        }
        else
        {
            sql = "select * from dbo.userinfo where dbo.userinfo.username ='" + username + "' or UID='" + username + "'";
        }
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<userinfo> listuseinfo = entit.ExecuteStoreQuery<userinfo>(sql).ToList();
            return listuseinfo;
        }
        catch (Exception e)
        {

            throw;
        }

    } 

    /// <summary>
    /// 退出登录
    /// </summary>
    [WebMethod]
    public static void quit()
    {
        HttpContext.Current.Session["user"] = null;
    }


    /// <summary>
    /// 根据文章ID查询文章内容
    /// </summary>
    /// <param name="artiID"></param>
    /// <returns></returns>
    [WebMethod]
    public static List<articleinfo> getartiContentByID(string artiID)
    {
        //select * from dbo.articleinfo where dbo.articleinfo.ID='1'
        string sql = "select * from dbo.articleinfo where dbo.articleinfo.ID='"+artiID+"'";//查询文章内容

        DbMybbsEntities entit = new DbMybbsEntities();       
        try
        {
            string Codp = statisticsReplyLine(artiID);//更新评论数
            string Codv = upReading(artiID);//更新阅读量
            List<articleinfo> artilist = entit.ExecuteStoreQuery<articleinfo>(sql).ToList();
            
            return artilist;
        }
        catch (Exception)
        {

            throw;
        }
    }


    /// <summary>
    /// 用户注册
    /// </summary>
    /// <param name="userName"></param>
    /// <param name="email"></param>
    /// <param name="phone"></param>
    /// <param name="password"></param>
    /// <returns></returns>
    [WebMethod]
    public static string UserRegister(string userName,string email,string phone, string password)
    {
        //INSERT INTO dbo.userinfo VALUES ('中火锅', '123', '1111@qq.com', '110011','','')
        if (!isRegister(userName))
        {
            return "-1";//重复
        }
        else
        {
            publicFunction func = new publicFunction();
            string passw = func.Md5encryption(password);
            string sql = "INSERT INTO dbo.userinfo VALUES ('"+userName+"', '"
                + passw+ "', '"+email+"', '"+phone+"','','')";
            DbMybbsEntities entit = new DbMybbsEntities();
            int cont = entit.ExecuteStoreCommand(sql);
            if (cont >= 1)
            {
                return "1";// 成功
            }
            else
            {
                return "0";//失败
            }
        }

        
    }


    /// <summary>
    ///   用户名是否重复
    ///   true 无重复
    /// </summary>
    /// <param name="userName"></param>
    /// <returns></returns>
    [WebMethod]
    public static bool isRegister(string userName)
    {
        //select *  from dbo.userinfo   where username='小火锅' 
        string sql = "select *  from dbo.userinfo   where username='"+userName+"' ";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<userinfo> listUser = entit.ExecuteStoreQuery<userinfo>(sql).ToList();
            if (listUser.Count >= 1)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        catch (Exception)
        {
            //return false;
            throw;
        }

    }


    /// <summary>
    ///  搜索文章
    /// </summary>
    /// <param name="title"></param>
    /// <returns></returns>
    [WebMethod]
    public static List<articleinfo> searchArticleByTitle(string title)
    {
        //select T.*from
        //(
        //  SELECT *, row_number()
        //   over(order by wpostedtime desc) as row
        //   FROM dbo.articleinfo
        //   WHERE dbo.articleinfo.wtitle Like '%文%'
        //)T
        //where row between 1 and 5
        //SELECT * FROM dbo.articleinfo WHERE dbo.articleinfo.wtitle Like '%文%'
        string sql = "SELECT * FROM dbo.articleinfo WHERE dbo.articleinfo.wtitle Like '%"+title+"%'";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<articleinfo> artiList = entit.ExecuteStoreQuery<articleinfo>(sql).ToList();
            return artiList;
        }
        catch (Exception e)
        {
            throw;
        }
        
    }
    

    /// <summary>
    /// 通过用户名查询用户信息
    /// </summary>
    /// <param name="username"></param>
    /// <returns></returns>
    [WebMethod]
    public static List<userinfo> slectUserinfoByusername(string username)
    {
        //select * from dbo.userinfo  where userinfo.username='小火锅'
        string sql = "select * from dbo.userinfo  where userinfo.username='"+username+"'";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<userinfo> listUser = entit.ExecuteStoreQuery<userinfo>(sql).ToList();
            return listUser;
        }
        catch (Exception e)
        {

            throw;
        }
    }

    /// <summary>
    /// 添加评论
    /// </summary>
    /// <param name="particleID">文章ID</param>
    /// <param name="pusername">评论者用户名</param>
    /// <param name="pcontent">评论内容</param>
    /// <param name="ptime">时间</param>
    /// <param name="PIp">ip地址</param>
    /// <returns></returns>
    [WebMethod]
    public static string addComment(string particleID ,  string pcontent,string PIp)
    {
        //insert into dbo.commentinfo VALUES ('da火锅','111111','2','不错不错','2019-05-05 20:56:00','192.168.0.0')
        string sql = "";
        if (useVerifier() != "-1")
        {
            string pusername = useVerifier();
            var puserID = (slectUserinfoByusername(pusername).Select(s => s.UID).ToList())[0].ToString();
           

            string ptime = DateTime.Now.ToLocalTime().ToString();
            sql = "insert into dbo.commentinfo VALUES ('" + pusername + "','"
                + puserID + "','" + particleID + "','" + pcontent + "','" + ptime + "','" + PIp + "')";
        }
        else
        {
            return "0";//没有登录
        }    
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            int s = entit.ExecuteStoreCommand(sql);
            if (s == 1)
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
            return "Err" + e.ToString();
            throw;
        }

    }


    /// <summary>
    /// 文章发布
    /// </summary> 
    /// <param name="ClasID"></param>
    /// <param name="Tite"></param>
    /// <param name="Content"></param>
    /// <returns></returns>
    [WebMethod]
    public static string setPublish(string ClasID,string Tite ,string Content ) 
    {
    //insert into dbo.articleinfo(classID, wusername, wtitle, wcontent, wpostedtime, wpviews, wcommentsnum, wisFile, fID)
    //output inserted.ID values('1', 'admin', '标题001', '内容001', '2019-12-12', '0', '0', '0', '0')
    //insert into dbo.articleinfo VALUES ('1', 'admin', 'title', 'noerong', '2019-05-5', '50', '5', '', '')
    // 类别id，用户名，标题，内容，时间，阅读量，评论数，我，
        string sql = "";
        if (useVerifier() != "-1")
        {
            string pusername = useVerifier();
            string atime = DateTime.Now.ToLocalTime().ToString();
                sql = "insert into dbo.articleinfo(classID, wusername, wtitle, "
                +"wcontent, wpostedtime, wpviews, wcommentsnum, wisFile, fID)"
                + "output inserted.ID as line values('" + ClasID+ "', '"+ pusername 
                + "', '"+Tite+ "', '"+Content+ "', '"+atime+"', "
                + "'0', '0', '0', '0')";


        }
        else
        {
            return "0";//没有登录
        }
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<statisticsinfo> stalis = entit.ExecuteStoreQuery<statisticsinfo>(sql).ToList();
            if (stalis.Count == 1)
            {
                int arID = stalis[0].line;

                return arID.ToString();//刚刚发布的ID
            }
            else
            {
                return "-1";//失败
            }

        }
        catch (Exception e)
        {
            return "Err" + e.ToString();
            throw;
        }

    }

    /// <summary>
    /// 通过文章id查询评论信息
    /// </summary>
    /// <param name="particleID"></param>
    /// <returns></returns>
    [WebMethod]
    public static List<commentinfo> lodeComment(string particleID)
    {
        //select * from dbo.commentinfo  where particleID = '2'//--升序asc
        string sql = "select * from dbo.commentinfo  where particleID = '"+particleID+ "' order by ptime asc ";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<commentinfo> listComm = entit.ExecuteStoreQuery<commentinfo>(sql).ToList();
            return listComm;
        }
        catch (Exception e)
        {

            throw;
        }



    }

    /// <summary>
    /// 通过文章id 更新回复数
    /// </summary>
    /// <param name="articleID"></param>
    /// <returns></returns>
    [WebMethod]
    public static string statisticsReplyLine(string articleID)
    {
        string sql = "select COUNT(*) as line from dbo.commentinfo where dbo.commentinfo.particleID='"+articleID+"'";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<statisticsinfo> listLine = entit.ExecuteStoreQuery<statisticsinfo>(sql).ToList();
            if (listLine.Count <= 0)
            {
                return "N";//没有回复
            }
            else
            {
                int coun = Convert.ToInt32(listLine[0].line);
                string sql2 = "UPDATE dbo.articleinfo SET wcommentsnum = '"+coun+"' WHERE ID = '"+articleID+"' ";
                int yud = entit.ExecuteStoreCommand(sql2);
                if (yud <= 0)
                {
                    return "F";//更新失败
                }
                else
                {
                    return "Y";//更新成功
                }
            }
        }
        catch (Exception e)
        {
            return "E" + e.ToString();//未知错误
            throw;
        }

    }

    /// <summary>
    /// 阅读量更新
    /// </summary>
    /// <param name="articleID"></param>
    /// <returns></returns>
    [WebMethod]
    public static string upReading(string articleID)
    {
        //查询阅量
        string sql = "select  dbo.articleinfo.wpviews as line from dbo.articleinfo  where ID='"+articleID+"' ";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<statisticsinfo> listSt = entit.ExecuteStoreQuery<statisticsinfo>(sql).ToList();
            if (listSt.Count <= 0)
            {
                return "N";//不存在
            }
            else
            {
                int numb = listSt[0].line;//阅读量
                int newNub = numb + 1;
                string sql1 = "UPDATE dbo.articleinfo SET wpviews = '"
                    +newNub.ToString()+"' WHERE ID = '"+articleID+"' ";//更新访问量

                int yxH = entit.ExecuteStoreCommand(sql1);//受影响行数
                if (yxH<=0)
                {
                    return "F";//失败
                }
                else
                {
                    return "Y";//成功
                }
            }
        }
        catch (Exception e)
        {

            throw;
        }

        

    }

    /// <summary>
    /// 通过用户名获取文章数量
    /// </summary>
    /// <param name="username"></param>
    /// <returns></returns>
    [WebMethod]
    public static string getAriNumb(string username)
    {
        string sql = "select COUNT(*) as line from dbo.articleinfo where  wusername ='"+username+"'";
        try
        {
            DbMybbsEntities entit = new DbMybbsEntities();
            List<statisticsinfo> stalist = entit.ExecuteStoreQuery<statisticsinfo>(sql).ToList();
            if (stalist.Count <= 0)
            {
                return "-1";// 错误
            }
            else
            {
                string lin = stalist[0].line.ToString();
                return lin;

            }
        }
        catch (Exception)
        {
            return "-2";//严重错误
            throw;
        }

    }

    /// <summary>
    /// 根据文章ID和文件类型查询附件
    /// </summary>
    /// <param name="AriID"></param>
    /// <param name="type"></param>
    /// <returns></returns>
    [WebMethod]
    public static List<fileinfo> getFileinfo( string AriID,string type)
    {
        // select * from dbo.fileinfo where articleID = '195' and fType = 'img'
        string sql = "";
        DbMybbsEntities entit = new DbMybbsEntities();
        if (type == "img")
        {
            sql = "select * from dbo.fileinfo where articleID = '"+AriID+"' and fType = 'img'";
        }
        else
        {
            sql = "select * from dbo.fileinfo where articleID = '" + AriID + "' and fType = 'other'";
        }
        try
        {
            List<fileinfo> filist = entit.ExecuteStoreQuery<fileinfo>(sql).ToList();
            return filist;
        }
        catch (Exception e)
        {
            throw;
        }
    }

}