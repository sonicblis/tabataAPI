using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TabataAPI.Models
{
    public class Subscription
    {
        public Guid Id { get; set; }
        public User Watcher { get; set; }
        public Guid UserPublicId { get; set; }
    }
}
