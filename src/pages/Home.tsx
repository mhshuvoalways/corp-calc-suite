import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, Home, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary">
      <Header />

      {/* Hero Section */}
      <section className="relative text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/calculator">
                <Button size="lg" variant="secondary" className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {t('common.startCalculator')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white hover:text-primary/70">
                {t('common.learnMore')}
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
              {t('home.whyUseTitle')}
            </h2>
            <p className="text-lg text-white/70">
              {t('home.whyUseSubtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('home.accurateCalculationsTitle')}</h3>
              <p className="text-white/70">
                {t('home.accurateCalculationsDesc')}
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('home.multipleRegionsTitle')}</h3>
              <p className="text-white/70">
                {t('home.multipleRegionsDesc')}
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition-all">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('home.professionalServiceTitle')}</h3>
              <p className="text-white/70">
                {t('home.professionalServiceDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white/5 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-lg text-white/70 mb-8">
            {t('home.ctaSubtitle')}
          </p>
          <Link to="/calculator">
            <Button size="lg" variant="secondary" className="flex items-center gap-2 mx-auto">
              <Calculator className="w-5 h-5" />
              {t('common.calculateNow')}
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