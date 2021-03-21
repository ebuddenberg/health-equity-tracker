using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Blazored.LocalStorage;
using Bookstore_UI.Contracts;
using Bookstore_UI.Models;
using Bookstore_UI.Pages.Users;
using Bookstore_UI.Providers;
using Bookstore_UI.Static;
using Microsoft.AspNetCore.Components.Authorization;
using Newtonsoft.Json;

namespace Bookstore_UI.Services
{
    public class AuthenticationRepository : IAuthenticationRepository
    {
        private readonly IHttpClientFactory _client;
        private readonly ILocalStorageService _localStorage;
        private readonly AuthenticationStateProvider _authStateProvide;
     


        public AuthenticationRepository(IHttpClientFactory client, 
            ILocalStorageService localStorage, 
            AuthenticationStateProvider authStateProvide)
        {
            _client = client;
            _localStorage = localStorage;
            _authStateProvide = authStateProvide;
            
        }
        public async Task<bool> Register(RegisterModel user)
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

       

        public async Task<bool> Login(LoginModel login)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            try
            {

                var request = new HttpRequestMessage(HttpMethod.Post, Endpoints.LoginEndPoint);
                request.Content = new StringContent(JsonConvert.SerializeObject(login), Encoding.UTF8, "application/json");
                var client = _client.CreateClient();
                response = await client.SendAsync(request);
                if (!response.IsSuccessStatusCode) return false;
                var content = await response.Content.ReadAsStringAsync();
                var token = JsonConvert.DeserializeObject<TokenResponse>(content);
                //store the token
                await _localStorage.SetItemAsync("authToken", token.Token);
                //change auth state of app


                
               await ((ApiAuthenticationStateProvider)_authStateProvide).LoggedIn();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", token.Token);

            }
            catch (Exception e)
            {
                return false;
            }



            return true;


        }

        public async Task Logout()
        {
            await _localStorage.RemoveItemAsync("authToken");
            ((ApiAuthenticationStateProvider)_authStateProvide).LoggedOut();
        }
    }
}
