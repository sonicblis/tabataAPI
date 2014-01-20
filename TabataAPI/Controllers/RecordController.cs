using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using TabataAPI.Models;

namespace TabataAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RecordController : ApiController
    {
        private TabataAPIDataContext db = new TabataAPIDataContext();

        // GET api/Record
        public List<Models.DTO.Record> GetRecords(Guid userId)
        {
            var records = new List<Models.DTO.Record>();
            var exercises = Enum.GetValues(typeof(Exercise));
            foreach (var exercise in exercises)
            {
                var latestExerciseHistory = db.Records.Where(e => e.User.Id == userId && e.Exercise == (Exercise)exercise).Take(10).OrderByDescending(r => r.When).ToList();
                latestExerciseHistory.ForEach(l =>
                {
                    records.Add(new Models.DTO.Record
                    {
                        Count = l.Count,
                        Exercise = l.Exercise,
                        Id = l.Id,
                        When = l.When.ToShortDateString()
                    });
                });
            }
            records.Reverse();
			return records;//.OrderBy(r => r.When).ToList();
        }

        // GET api/Record/5
        [ResponseType(typeof(Record))]
        public IHttpActionResult GetRecord(Guid id)
        {
            Record record = db.Records.Find(id);
            if (record == null)
            {
                return NotFound();
            }

            return Ok(record);
        }

        // PUT api/Record/5
        public IHttpActionResult PutRecord(Guid id, Record record)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != record.Id)
            {
                return BadRequest();
            }

            db.Entry(record).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RecordExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Record
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [ResponseType(typeof(Record))]
        public IHttpActionResult PostRecord(Record record)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Users.Attach(record.User);
            db.Records.Add(record);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (RecordExists(record.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = record.Id }, record);
        }

        // DELETE api/Record/5
        [ResponseType(typeof(Record))]
        public IHttpActionResult DeleteRecord(Guid id)
        {
            Record record = db.Records.Find(id);
            if (record == null)
            {
                return NotFound();
            }

            db.Records.Remove(record);
            db.SaveChanges();

            return Ok(record);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RecordExists(Guid id)
        {
            return db.Records.Count(e => e.Id == id) > 0;
        }
    }
}