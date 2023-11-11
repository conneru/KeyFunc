using System;
using KeyFunc.Models;
using KeyFunc.Data;
using Microsoft.EntityFrameworkCore;
namespace KeyFunc.Repos
{
	public class ImageRespository : Repository<Image>, IImageRepository
	{
		KeyFuncContext _context;
		public ImageRespository(KeyFuncContext context):base(context)
		{
			_context = context;
		}
	}
}

