using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Bookstore_UI.Contracts;
using Bookstore_UI.Models;
using Bookstore_UI.Static;
using Newtonsoft.Json;

namespace Bookstore_UI.Services
{
    public class AuthenticationRepository:IAuthenticationRepository
    {
        private readonly IHttpClientFactory _client;

        public AuthenticationRepository(IHttpClientFactory client)
        {
            _client = client;
        }
        public async Task<bool> Register(RegisterAndLoginModel user)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            try
            {
              
                var request = new HttpRequestMessage(HttpMethod.Post, Endpoints.RegisterEndPoint);
                request.Content = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
                var client = _client.CreateClient();
                 response = await client.SendAsync(request);
               
            }
            catch (Exception e)
            {
                return response.StatusCode == HttpStatusCode.NotAcceptable;
            }
            return response.IsSuccessStatusCode;
        }
    }
}
