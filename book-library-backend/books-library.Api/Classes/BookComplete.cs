using System;

namespace books_library.Api.Wrappers
{
	public class BookComplete
	{
        public string isbn { get; set; }
        public string title { get; set; }
        public int year { get; set; }
        public string publisher { get; set; }
        public string image_url { get; set; }
        //public string library { get; set; }
        public int libraryId { get; set; }
        public string author { get; set; }
        //public int authorId { get; set; }
    }
}

