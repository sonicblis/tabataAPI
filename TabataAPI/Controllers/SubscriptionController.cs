using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using TabataAPI.Models;

namespace TabataAPI.Controllers
{
    public class SubscriptionController : ApiController
    {
        private TabataAPIDataContext db = new TabataAPIDataContext();

        // GET api/Subscription
        public IQueryable<Subscription> GetSubscriptions()
        {
            return db.Subscriptions;
        }

        // GET api/Subscription/5
        [ResponseType(typeof(Subscription))]
        public IHttpActionResult GetSubscription(Guid id)
        {
            Subscription subscription = db.Subscriptions.Find(id);
            if (subscription == null)
            {
                return NotFound();
            }

            return Ok(subscription);
        }

        // PUT api/Subscription/5
        public IHttpActionResult PutSubscription(Guid id, Subscription subscription)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != subscription.Id)
            {
                return BadRequest();
            }

            db.Entry(subscription).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubscriptionExists(id))
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

        // POST api/Subscription
        [ResponseType(typeof(Subscription))]
        public IHttpActionResult PostSubscription(Subscription subscription)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Subscriptions.Add(subscription);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (SubscriptionExists(subscription.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = subscription.Id }, subscription);
        }

        // DELETE api/Subscription/5
        [ResponseType(typeof(Subscription))]
        public IHttpActionResult DeleteSubscription(Guid id)
        {
            Subscription subscription = db.Subscriptions.Find(id);
            if (subscription == null)
            {
                return NotFound();
            }

            db.Subscriptions.Remove(subscription);
            db.SaveChanges();

            return Ok(subscription);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SubscriptionExists(Guid id)
        {
            return db.Subscriptions.Count(e => e.Id == id) > 0;
        }
    }
}