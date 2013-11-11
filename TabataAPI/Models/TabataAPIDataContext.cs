using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace TabataAPI.Models
{
    public class TabataAPIDataContext : DbContext
    {
        public DbSet<Record> Records { get; set; }

        public System.Data.Entity.DbSet<TabataAPI.Models.User> Users { get; set; }
    }
}