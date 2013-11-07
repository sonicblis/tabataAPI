using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TabataAPI.Models.DTO
{
    public class Record
    {        
		public int Count { get; set; }
		public DateTime When { get; set; }
		public string Exercise { get; set; }
    }
}