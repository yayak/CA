using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Ext.Net.Utilities;
using Ext.Net;

namespace CrudeAssayEXTNET
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!X.IsAjaxRequest)
            {
                this.ResourceManager1.DirectEventUrl = this.Request.Url.AbsoluteUri;
                this.Session["Ext.Net.Theme"] = Ext.Net.Theme.Default;
                this.TriggerField1.Focus();
            }
        }

        [DirectMethod]
        public string GetThemeUrl(string theme)
        {
            Theme temp = (Theme)Enum.Parse(typeof(Theme), theme);

            this.Session["Ext.Net.Theme"] = temp;

            return this.ResourceManager1.GetThemeUrl(temp);
        }

        [DirectMethod]
        public static int GetHashCode(string s)
        {
            return Math.Abs("/Pages".ConcatWith(s).ToLower().GetHashCode());
        }

       
    }
}