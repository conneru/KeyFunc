using System;
using KeyFunc.Data;
using KeyFunc.Models;
using Microsoft.EntityFrameworkCore;

namespace KeyFunc.Repos
{
    public class ImageRespository : Repository<Image>, IImageRepository
    {
        KeyFuncContext _context;

        public ImageRespository(KeyFuncContext context)
            : base(context)
        {
            _context = context;
        }
    }
}
