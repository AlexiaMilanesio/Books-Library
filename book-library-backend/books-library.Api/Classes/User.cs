using System;
namespace books_library.Api.Classes
{
	public class User
	{
		public string Id { get; set; }
        public bool IsSuperAdmin { get; set; }
        public bool IsLoggedIn { get; set; }
        public string Name { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        //public User(string id, bool isSuperAdmin, bool isLoggedIn, string name, string lastname, string email, string password)
        //{
        //    Id = id;
        //    IsSuperAdmin = isSuperAdmin;
        //    IsLoggedIn = isLoggedIn;
        //    Name = name;
        //    Lastname = lastname;
        //    Email = email;
        //    Password = password;
        //}
    }
}

