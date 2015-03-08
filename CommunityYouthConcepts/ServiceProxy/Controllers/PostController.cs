using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ServiceProxy.Controllers
{
    public class PostController : ApiController
    {
        public JToken GetPosts()
        {

            string url = "http://cyconcepts.org/wp-json/posts?type=volunteer_project" + Request.RequestUri.Query.TrimStart('?');
            string response = "";
            using (var webClient = new WebClient())
            {
                response = webClient.DownloadString(url);
            }
            return JArray.Parse(response);
        }

        public JToken GetCategories(string categoryId)
        {
            string url = String.Format("http://cyconcepts.org/wp-json/taxonomies/{0}/terms", categoryId);
            string response = "";
            using (var webClient = new WebClient())
            {
                response = webClient.DownloadString(url);                
            }
            return JArray.Parse(response);
        }
    }
}
