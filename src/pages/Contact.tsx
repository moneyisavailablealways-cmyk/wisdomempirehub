<div class="min-h-screen bg-background px-4 py-12">
  <!-- Header -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold font-wisdom text-foreground mb-4">Contact Us</h1>
    <p class="text-lg text-muted-foreground">We'd love to hear from you!</p>
  </div>

  <!-- Contact Information Card -->
  <div class="bg-gray-800 text-indigo-700 p-8 rounded-2xl mb-8">
    <p class="text-muted-foreground mb-6">
      If you have questions, suggestions, or feedback about our proverb collection or features, please reach out using the details below:
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="flex items-start gap-3">
        <svg class="h-5 w-5 text-wisdom-gold mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H8m0 0l4-4m0 0l4 4m-4-4v8" />
        </svg>
        <div class="text-green-800">
          <h3 class="font-semibold text-foreground">Email</h3>
          <p class="text-muted-foreground">support@yourwebsite.com</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <svg class="h-5 w-5 text-wisdom-gold mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h2l3 7-2 2 5 5-2 2 7 3v2h-2l-3-7 2-2-5-5 2-2L3 5z" />
        </svg>
        <div class="text-green-950">
          <h3 class="font-semibold text-foreground">Phone</h3>
          <p class="text-muted-foreground">+1 (XXX) XXX-XXXX</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <svg class="h-5 w-5 text-wisdom-gold mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
        <div class="text-green-800">
          <h3 class="font-semibold text-foreground">Address</h3>
          <p class="text-muted-foreground">
            Wisdom Empire Hub<br />
            Youtube: @wisdomempirehub<br />
            TikTok: @wisdomempirehub<br />
            Telegram: t.me/wisdomempire247
          </p>
        </div>
      </div>
    </div>

    <div class="mt-8 p-4 bg-wisdom-cultural/10 rounded-lg">
      <p class="text-sm text-muted-foreground">We aim to respond to all messages within 48 hours.</p>
    </div>
  </div>

  <!-- Contact Form Card -->
  <div class="bg-gray-800 p-8 rounded-2xl">
    <h2 class="text-2xl font-bold mb-6 text-center text-white">Send Us a Message</h2>

    <form id="contact-form" class="space-y-4">
      <input type="text" name="name" placeholder="Your Name" required
        class="w-full p-3 border rounded-xl focus:ring focus:ring-indigo-200" />
      <input type="email" name="email" placeholder="Your Email" required
        class="w-full p-3 border rounded-xl focus:ring focus:ring-indigo-200" />
      <textarea name="message" placeholder="Your Message" rows="4" required
        class="w-full p-3 border rounded-xl focus:ring focus:ring-indigo-200"></textarea>
      <button type="submit"
        class="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
        Send Message
      </button>
    </form>

    <p id="success-msg" style="display:none; color:green; margin-top:10px; text-align:center;">
      ✅ Thank you! Your message has been sent.
    </p>
  </div>
</div>

<!-- EmailJS Script -->
<script src="https://cdn.emailjs.com/dist/email.min.js"></script>
<script>
  (function(){
    emailjs.init('HvNGbJr-Ylg5ZlRZz'); // Replace with your EmailJS Public Key
  })();

  const form = document.getElementById('contact-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    emailjs.sendForm('service_27nifab', '__ejs-test-mail-service__', this)
      .then(function() {
        document.getElementById('success-msg').style.display = 'block';
        form.reset();
      }, function(error) {
        alert('Oops... ' + JSON.stringify(error));
      });
  });
</script>
