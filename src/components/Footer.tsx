import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <img
              src="/logo.png"
              alt={t('footer.companyName')}
              className="h-14 w-auto mb-4"
            />
            <p className="text-white/70 mb-4">
              {t('footer.companyDescription')}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  {t('footer.aboutUs')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.contactInfo')}</h4>
            <ul className="space-y-2 text-white/70">
              <li>📧 info@primeestate.ai</li>
              <li>📞 +34 691 87 01 15</li>
              <li>📍 Costa Blanca, Spain</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50">
          <p>&copy; 2025 {t('footer.companyName')}. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
