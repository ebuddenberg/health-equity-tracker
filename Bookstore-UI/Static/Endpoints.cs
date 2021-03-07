namespace Bookstore_UI.Static
{
    public static class Endpoints
    {
        public static string BaseUrl { get; set; } = "https://localhost:44373/";
        public static string AuthorsEndpoint = $"{BaseUrl}api/authors/";
        public static string BooksEndpoint = $"{BaseUrl}api/books/";
        public static string RegisterEndPoint = $"{BaseUrl}api/users/Register";
        public static string LoginEndPoint = $"{BaseUrl}api/users/Login";
    }
}
