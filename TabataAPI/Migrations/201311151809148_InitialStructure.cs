namespace TabataAPI.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialStructure : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Records",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        When = c.DateTime(nullable: false),
                        Count = c.Int(nullable: false),
                        Exercise = c.Int(nullable: false),
                        User_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.User_Id)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        PublicId = c.Guid(nullable: false),
                        Name = c.String(),
                        Email = c.String(),
                        Password = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Subscriptions",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        UserPublicId = c.Guid(nullable: false),
                        Watcher_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.Watcher_Id)
                .Index(t => t.Watcher_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Records", "User_Id", "dbo.Users");
            DropForeignKey("dbo.Subscriptions", "Watcher_Id", "dbo.Users");
            DropIndex("dbo.Records", new[] { "User_Id" });
            DropIndex("dbo.Subscriptions", new[] { "Watcher_Id" });
            DropTable("dbo.Subscriptions");
            DropTable("dbo.Users");
            DropTable("dbo.Records");
        }
    }
}
