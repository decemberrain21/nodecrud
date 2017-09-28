using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
public partial class Default2 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void Button1_Click(object sender, EventArgs e)
    {
        string name = txtname.Text;
        string email = txtemail.Text;
        SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["testingConnectionString"].ConnectionString);
       
        try
        {

            connection.Open();
            // Create a object of SqlCommand class
            string sql = "INSERT INTO Students(student_name,student_email) VALUES(@name,@email)";
            SqlCommand cmd = new SqlCommand(sql, connection);
            cmd.Parameters.Add("@name", SqlDbType.VarChar, 10).Value = name;
            cmd.Parameters.Add("@email", SqlDbType.VarChar, 50).Value = email;
            cmd.CommandType = CommandType.Text;
            cmd.ExecuteNonQuery();
        }
        catch (Exception ex)
        {

        }
        finally
        {
            connection.Close();

        }
    }
}