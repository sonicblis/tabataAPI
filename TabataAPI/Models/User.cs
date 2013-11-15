﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TabataAPI.Models
{
    public class User
    {
        public Guid Id { get; set; }        
        public Guid PublicId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public List<Subscription> Subscriptions { get; set; }
    }
}