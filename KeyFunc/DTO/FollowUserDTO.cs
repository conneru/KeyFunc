using System;
using KeyFunc.Models;

namespace KeyFunc.DTO
{
	public class FollowUserDTO
	{
        public int? Id
        {
            get; set;
        }

        public string? Username
        {
            get; set;
        }

        public string? ProfilePic
        {
            get; set;
        }

        public FollowUserDTO(User? user)
        {
            Id = user.Id;
            Username = user.Username;
            ProfilePic = user.ProfilePic;
        }
    }
}

