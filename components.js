(function renderSharedLayout(){
  if (!document.querySelector('.bg-slideshow')) {
    const slideshow = document.createElement('div');
    slideshow.className = 'bg-slideshow';
    slideshow.setAttribute('aria-hidden', 'true');
    slideshow.innerHTML = `
      <div class="slide"></div>
      <div class="slide"></div>
      <div class="slide"></div>
      <div class="slide"></div>
    `;
    document.body.prepend(slideshow);
  }

  const headerHost = document.getElementById('site-header');
  if (headerHost) {
    headerHost.innerHTML = `
<header>
  <div class="logo">MAXIIMTECH</div>
  <nav>
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="technology.html">Technology</a>
    <a href="product.html">Product</a>
    <div class="dropdown">
      <button id="expertise-toggle" class="dropdown-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="expertise-menu">Expertise</button>
      <div class="dropdown-menu" id="expertise-menu" role="menu" aria-labelledby="expertise-toggle">
        <a href="business-development.html" role="menuitem">Business Development</a>
        <a href="strategic-planning.html" role="menuitem">Strategic Planning</a>
        <a href="aviation-aerospace.html" role="menuitem">Aviation &amp; Aerospace</a>
        <a href="process-optimisation.html" role="menuitem">Process Optimisation</a>
        <a href="facilities-management.html" role="menuitem">Facilities Management</a>
        <a href="hr-management.html" role="menuitem">HR Management</a>
      </div>
    </div>
    <a href="contact.html">Contact Us</a>
  </nav>
</header>`;
  }

  const footerHost = document.getElementById('site-footer');
  if (footerHost) {
    footerHost.innerHTML = `
<footer class="site-footer">
  <div class="footer-grid">
    <div class="footer-brand">
      <strong>MAXIIM</strong>
      <p>Maxiimtech delivers trusted consulting and technology expertise for high-growth organizations.</p>
    </div>
    <div class="footer-links">
      <h4>Quick Links</h4>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="technology.html">Technology</a>
      <a href="product.html">Product</a>
      <a href="contact.html">Contact Us</a>
    </div>
    <div class="footer-contact">
      <h4>Get in Touch</h4>
      <p>Address: 1200 Innovation Avenue, Houston, TX 77058</p>
      <p>Email: ceomd@maxiimtech.com</p>
      <p>Phone: +1 (832) 555-0190</p>
    </div>
  </div>
</footer>`;
  }
})();
