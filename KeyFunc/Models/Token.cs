using System;
namespace KeyFunc.Models
{
	public class Token
	{
	
		public string access_token
		{
			get;set;
		}

		public DateTime? exp
		{
			get;set;
		}

		public string refresh_token
		{
			get;set;
		}
		
	}
}

