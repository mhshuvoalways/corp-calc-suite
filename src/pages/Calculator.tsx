import { Calculator, Euro, MapPin } from 'lucide-react';
import { useState } from 'react';

const SpanishPropertyCalculator = () => {
  // State
  const [propertyPrice, setPropertyPrice] = useState('');
  const [propertyType, setPropertyType] = useState('resale');
  const [region, setRegion] = useState('valencia');
  const [includeMortgage, setIncludeMortgage] = useState(false);

  // Tax rates
  const getTaxRate = () => {
    if (propertyType === 'newBuild') {
      return { iva: 0.10, ajd: 0.015, total: 0.115, display: '10% IVA + 1.5% AJD' };
    } else {
      const itpRates = {
        valencia: { rate: 0.10, display: '10% ITP' },
        murcia: { rate: 0.08, display: '8% ITP' },
        andalusia: { rate: 0.08, display: '8% ITP' }
      };
      return itpRates[region];
    }
  };

  // Calculate costs
  const calculateCosts = () => {
    const price = parseFloat(propertyPrice) || 0;
    if (price === 0) return null;

    const taxInfo = getTaxRate();
    const purchaseTaxes = propertyType === 'newBuild' 
      ? price * taxInfo.total 
      : price * taxInfo.rate;

    const notaryFees = Math.max(price * 0.003, 600);
    const registryFees = Math.max(price * 0.002, 400);
    const legalFees = price * 0.015;
    const adminFees = 500;
    const commoditiesFees = propertyType === 'newBuild' ? 500 : 0;
    const mortgageFees = includeMortgage ? price * 0.005 : 0;

    const totalProfessionalFees = notaryFees + registryFees + legalFees + adminFees + commoditiesFees + mortgageFees;
    const totalCosts = purchaseTaxes + totalProfessionalFees;
    const totalPurchase = price + totalCosts;

    return {
      price,
      purchaseTaxes,
      notaryFees,
      registryFees,
      legalFees,
      adminFees,
      commoditiesFees,
      mortgageFees,
      totalProfessionalFees,
      totalCosts,
      totalPurchase
    };
  };

  const costs = calculateCosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src="/logo.png" 
              alt="Prime Estate Luxury Homes" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Spanish Property Cost Calculator</h1>
          <div className="flex items-center gap-2 text-secondary">
            <Calculator className="w-5 h-5" />
            <span>Calculate total purchase costs for Spanish properties</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="space-y-4">
              {/* Property Price */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Property Price (€)
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(e.target.value)}
                    placeholder="250000"
                    className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Property Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPropertyType('newBuild')}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      propertyType === 'newBuild'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    New Build
                  </button>
                  <button
                    onClick={() => setPropertyType('resale')}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      propertyType === 'resale'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Resale
                  </button>
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full py-3 px-4 bg-white/10 border border-white/30 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="valencia" className="bg-slate-800">Valencia (Costa Blanca)</option>
                  <option value="murcia" className="bg-slate-800">Murcia (Costa Calida)</option>
                  <option value="andalusia" className="bg-slate-800">Andalusia</option>
                </select>
                <div className="mt-2 p-2 bg-secondary/20 rounded-lg">
                  <p className="text-secondary text-sm">
                    Tax Rate: {getTaxRate().display}
                  </p>
                </div>
              </div>

              {/* Mortgage */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Include Mortgage Fees
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIncludeMortgage(true)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      includeMortgage
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIncludeMortgage(false)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      !includeMortgage
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          {costs && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">
                Cost Breakdown
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Property Price</span>
                    <span className="text-white font-bold">€{costs.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-3">
                  <h4 className="text-secondary font-medium mb-2">Purchase Taxes</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">{getTaxRate().display}</span>
                    <span className="text-white">€{costs.purchaseTaxes.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-3">
                  <h4 className="text-secondary font-medium mb-2">Professional Fees</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Notary Fees</span>
                      <span className="text-white">€{costs.notaryFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Registry Fees</span>
                      <span className="text-white">€{costs.registryFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Legal Fees</span>
                      <span className="text-white">€{costs.legalFees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Administrative Fees</span>
                      <span className="text-white">€{costs.adminFees.toLocaleString()}</span>
                    </div>
                    {propertyType === 'newBuild' && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Connecting Commodities</span>
                        <span className="text-white">€{costs.commoditiesFees.toLocaleString()}</span>
                      </div>
                    )}
                    {includeMortgage && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Mortgage Arrangement Fees</span>
                        <span className="text-white">€{costs.mortgageFees.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-secondary font-medium">Total Additional Costs</span>
                    <span className="text-secondary font-bold">€{costs.totalCosts.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-secondary/20 to-secondary/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">Total Purchase Price</span>
                      <span className="text-secondary font-bold text-xl">€{costs.totalPurchase.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
          <p className="text-white/60 text-sm text-center">
            This calculator provides estimates only. Actual costs may vary. Please consult with a professional for accurate figures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpanishPropertyCalculator;