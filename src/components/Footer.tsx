const Footer = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <img
              src="/logo.png"
              alt="Prime Estate Luxury Homes"
              className="h-14 w-auto mb-4"
            />
            <p className="text-white/70 mb-4">
              Your trusted partner in Spanish property investment. Expert
              guidance for Costa Blanca and Costa Calida properties.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-white/70">
              <li>📧 info@primeestate.ai</li>
              <li>📞 +34 691 87 01 15</li>
              <li>📍 Costa Blanca, Spain</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50">
          <p>&copy; 2025 Prime Estate Luxury Homes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
