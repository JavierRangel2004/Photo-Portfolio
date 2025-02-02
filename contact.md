---
layout: page
title: Contact
---

<div class="d-flex flex-column flex-md-row align-items-start mb-4">
  <img src="/assets/images/yo.jpg" alt="Javier Rangel Headshot" class="about-photo me-md-4 mb-3" loading="lazy">
  <div>
    <h2>Get in Touch</h2>
    <p>Whether you're looking to book a photoshoot, discuss a collaboration, or simply want to say hello, I'm here to help. I specialize in capturing unique moments and telling stories through photography. Let’s talk about how we can work together to bring your vision to life.</p>
  </div>
</div>

<form id="form" class="mb-5">
  <div class="mb-3">
    <label for="name" class="form-label">Name *</label>
    <input type="text" class="form-control" id="name" placeholder="Your Name" />
  </div>
  <div class="mb-3">
    <label for="email" class="form-label">Email *</label>
    <input type="email" class="form-control" id="email" placeholder="name@example.com" />
  </div>
  <div class="mb-3">
    <label for="inquiry-type" class="form-label">Type of Inquiry *</label>
    <select id="inquiry-type" class="form-select">
      <option value="booking">Booking</option>
      <option value="collaboration">Collaboration</option>
      <option value="general">General Inquiry</option>
    </select>
  </div>
  <div class="mb-3">
    <label for="message" class="form-label">Message *</label>
    <textarea class="form-control" id="message" rows="3" placeholder="How can I help you?"></textarea>
  </div>
  <button type="submit" class="btn btn-outline-light rounded-pill">Send</button>
</form>

<div id="contact-confirmation" class="alert alert-success" style="display:none;">
  Thank you for contacting us! Your message has been received. We will get back to you shortly.
</div>

<h2 class="mt-5 mb-3">Contact Information</h2>
<p><strong>Email:</strong> <a href="mailto:inspecjrm@gmail.com">inspecjrm@gmail.com</a></p>

<h2 class="mt-5 mb-3">Our Location</h2>
<div class="ratio ratio-16x9">
  <iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.008135890624!2d-99.13320858459223!3d19.43260738688643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f92aa8c0f8fb%3A0x2a6ea4ecf9d3bf!2sMexico%20City!5e0!3m2!1sen!2smx!4v1699999999999!5m2!1sen!2smx"
    style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</div>

<h2 class="mt-5 mb-3">Why us?</h2>
<div class="accordion my-4" id="faqAccordion">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingWhyChooseMe">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWhyChooseMe"
        aria-expanded="false" aria-controls="collapseWhyChooseMe">
        Why Choose JRMGraphy?
      </button>
    </h2>
    <div id="collapseWhyChooseMe" class="accordion-collapse collapse show" aria-labelledby="headingWhyChooseMe"
      data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        With a keen eye for capturing the essence of the moment, my photography is about creating art, not just snapshots. My dedication to quality and creativity sets me apart.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingServicesOffered">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapseServicesOffered" aria-expanded="false" aria-controls="collapseServicesOffered">
        What Services Do I Offer?
      </button>
    </h2>
    <div id="collapseServicesOffered" class="accordion-collapse collapse" aria-labelledby="headingServicesOffered"
      data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        I offer a range of photography services including portraits, landscapes, event coverage, and bespoke projects tailored to your specific needs.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingBookingProcess">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapseBookingProcess" aria-expanded="false" aria-controls="collapseBookingProcess">
        How Does the Booking Process Work?
      </button>
    </h2>
    <div id="collapseBookingProcess" class="accordion-collapse collapse" aria-labelledby="headingBookingProcess"
      data-bs-parent="#faqAccordion">
      <div class="accordion-body">
        Booking is simple. Contact me through any listed method, discuss your project or event, and we'll set a date and time. A deposit may be required for larger projects.
      </div>
    </div>
  </div>
</div>
