using System;

namespace KeyFunc.Models
{
    public class Image
    {
        public int Id { get; set; }

        public int? PostId { get; set; }

        public int? OrderNum { get; set; }

        public string URL { get; set; }

        public virtual Post? Post { get; set; }

        public virtual List<Tag>? Tags
        {
            get;set;
        }

    }
}
