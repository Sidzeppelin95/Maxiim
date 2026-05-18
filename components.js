(function renderSharedLayout(){
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
      <button class="dropdown-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="expertise-menu">Expertise</button>
      <div class="dropdown-menu" id="expertise-menu">
        <a href="business-development.html">Business Development</a>
        <a href="strategic-planning.html">Strategic Planning</a>
        <a href="aviation-aerospace.html">Aviation &amp; Aerospace</a>
        <a href="process-optimisation.html">Process Optimisation</a>
        <a href="facilities-management.html">Facilities Management</a>
        <a href="hr-management.html">HR Management</a>
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
      <p>Address: XYZ ABC</p>
      <p>Email: ceomd@maxiimtech.com / rdsharma01@gmail.com</p>
      <p>Phone: 9654760000</p>
    </div>
  </div>
</footer>`;
  }
})();
