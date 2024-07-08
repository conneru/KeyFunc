using System;
using KeyFunc.Models;

namespace KeyFunc.DTO
{
	public class CreatePostDTO
	{
        public int? UserId
        {
            get; set;
        }

        public string? Description
        {
            get; set;
        }

        public List<string>? ContentTypes
        {
            get; set;
        }

        public List<List<Tag>>? Tags
        {
            get;set;
        }
    }
}

