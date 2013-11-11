using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TabataAPI.Models.DTO
{
    public class Record
    {
        public Guid Id { get; set; }
		public int Count { get; set; }
		public string When { get; set; }
		public Exercise Exercise { get; set; }
    }
}