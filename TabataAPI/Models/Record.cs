using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TabataAPI.Models
{
    public enum Exercise
    {
        Pushups,
        Pullups,
        Squats,
        Situps
    }
    public class Record
    {
        public Guid Id { get; set; }
        public DateTime When { get; set; }
        public int Count { get; set; }
        public Exercise Exercise { get; set; }
        public User User { get; set; }
    }
}