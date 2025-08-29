import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, Home, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo.webp" 
                alt="Prime Estate Luxury Homes" 
                className="h-12 w-auto"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-primary-foreground hover:text-secondary transition-colors">
                Home
              </a>
              <a href="#" className="text-primary-foreground hover:text-secondary transition-colors">
                Properties
              </a>
              <a href="#" className="text-primary-foreground hover:text-secondary transition-colors">
                Services
              </a>
              <a href="#" className="text-primary-foreground hover:text-secondary transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/90 text-primary-foreground py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Spanish Property Purchase Calculator
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Calculate all costs involved in purchasing your dream property in Spain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/calculator">
                <Button size="lg" variant="secondary" className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Start Calculator
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Use Our Calculator?
            </h2>
            <p className="text-lg text-muted-foreground">
              Get accurate estimates for all property purchase costs in Spain
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Accurate Calculations</h3>
              <p className="text-muted-foreground">
                Precise calculations based on current Spanish tax rates and fees
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Multiple Regions</h3>
              <p className="text-muted-foreground">
                Support for Valencia, Murcia, and Andalusia regions
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Professional Service</h3>
              <p className="text-muted-foreground">
                Expert guidance throughout your property purchase journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Calculate Your Property Costs?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Use our comprehensive calculator to get accurate estimates for your Spanish property purchase
          </p>
          <Link to="/calculator">
            <Button size="lg" className="flex items-center gap-2 mx-auto">
              <Calculator className="w-5 h-5" />
              Calculate Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <img 
                src="/logo.webp" 
                alt="Prime Estate Luxury Homes" 
                className="h-10 w-auto mb-4"
              />
              <p className="text-primary-foreground/80">
                Your trusted partner for Spanish property investments
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+34 XXX XXX XXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@primeestate.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Property Search</li>
                <li>Legal Support</li>
                <li>Cost Calculation</li>
                <li>Purchase Assistance</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 Prime Estate Luxury Homes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;