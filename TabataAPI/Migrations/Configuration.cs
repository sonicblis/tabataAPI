namespace TabataAPI.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using TabataAPI.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<TabataAPI.Models.TabataAPIDataContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(TabataAPI.Models.TabataAPIDataContext context)
        {
            string[] strings = new string[]{"hi"};
            context.Users.AddOrUpdate(new User[]
            {
                new User{
                    Id = new Guid("E8F64F2E-ECAD-432B-8D64-65B5719E584E"),
                    Name = "Chris Johnson",
                    Password = "None",
                    PublicId = Guid.NewGuid(),
                    Email = "chris@yourmamma.com"
                },                
                new User{
                    Id = new Guid("B7CB402E-6CEE-4218-A6A6-5531B2CE4865"),
                    Name = "Cameron Tabor",
                    Password = "None",
                    PublicId = Guid.NewGuid(),
                    Email = "cameron@yourmamma.com"
                }
            });
                      
        }
    }
}
