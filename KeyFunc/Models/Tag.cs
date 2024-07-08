using System;
namespace KeyFunc.Models
{
	public class Tag
	{
		public string? Id
		{
			get;set;
		}

		public int? ImageId
		{
			get;set;
		}

		public string? Top
		{
			get;set;
		}
		public string? Left
		{
			get;set;
		}
		public string? Username
		{
			get;set;
		}

		public virtual Image? Image
		{		
			get;set;
		}
	}
}

