using DbMybbsModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

/// <summary>
/// publicFunction 的摘要说明
/// </summary>
public  class publicFunction
{
    public publicFunction()
    {
        //
        // TODO: 在此处添加构造函数逻辑
        //
    }
    /// <summary>
    /// md5加密
    /// </summary>
    /// <param name="cleartext"></param>
    /// <returns></returns>
    public string Md5encryption(string cleartext)
    {
        byte[] result = Encoding.Default.GetBytes(cleartext);
        MD5 md5 = new MD5CryptoServiceProvider();
        byte[] output = md5.ComputeHash(result);
        return BitConverter.ToString(output).Replace("-", "");
    }
}