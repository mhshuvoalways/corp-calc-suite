import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, Home, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary">
      <Header />

      {/* Hero Section */}
      <section className="relative text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Spanish Property Purchase Calculator
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
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
              <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white hover:text-primary/70">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/10 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Use Our Calculator?
            </h2>
            <p className="text-lg text-white/70">
              Get accurate estimates for all property purchase costs in Spain
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Accurate Calculations</h3>
              <p className="text-white/70">
                Precise calculations based on current Spanish tax rates and fees
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Multiple Regions</h3>
              <p className="text-white/70">
                Support for Valencia, Murcia, and Andalusia regions
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Professional Service</h3>
              <p className="text-white/70">
                Expert guidance throughout your property purchase journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white/5 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Calculate Your Property Costs?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Use our comprehensive calculator to get accurate estimates for your Spanish property purchase
          </p>
          <Link to="/calculator">
            <Button size="lg" variant="secondary" className="flex items-center gap-2 mx-auto">
              <Calculator className="w-5 h-5" />
              Calculate Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;