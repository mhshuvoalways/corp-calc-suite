import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Calculator, Euro, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SpanishPropertyCalculator = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // State
  const [propertyPrice, setPropertyPrice] = useState("");
  const [propertyType, setPropertyType] = useState("resale");
  const [region, setRegion] = useState("valencia");
  const [includeMortgage, setIncludeMortgage] = useState(false);
  const [calculatedCosts, setCalculatedCosts] = useState(null);

  // Tax rates
  const getTaxRate = (currentPropertyType, currentRegion) => {
    if (currentPropertyType === "newBuild") {
      return {
        iva: 0.1,
        ajd: 0.015,
        total: 0.115,
        display: "10% IVA + 1.5% AJD",
      };
    } else {
      const itpRates = {
        valencia: { rate: 0.1, display: "10% ITP" },
        murcia: { rate: 0.08, display: "8% ITP" },
        andalusia: { rate: 0.08, display: "8% ITP" },
      };
      return itpRates[currentRegion];
    }
  };

  // Calculate costs
  const calculateCosts = (price, propType, currentRegion, includeMort) => {
    const numPrice = parseFloat(price) || 0;
    if (numPrice === 0) return null;

    const taxInfo = getTaxRate(propType, currentRegion);
    const purchaseTaxes =
      propType === "newBuild"
        ? numPrice * taxInfo.total
        : numPrice * taxInfo.rate;

    const notaryFees = Math.max(numPrice * 0.003, 600);
    const registryFees = Math.max(numPrice * 0.002, 400);
    const legalFees = numPrice * 0.015;
    const adminFees = 500;
    const commoditiesFees = propType === "newBuild" ? 500 : 0;
    const mortgageFees = includeMort ? numPrice * 0.005 : 0;

    const totalProfessionalFees =
      notaryFees +
      registryFees +
      legalFees +
      adminFees +
      commoditiesFees +
      mortgageFees;
    const totalCosts = purchaseTaxes + totalProfessionalFees;
    const totalPurchase = numPrice + totalCosts;

    return {
      price: numPrice,
      purchaseTaxes,
      notaryFees,
      registryFees,
      legalFees,
      adminFees,
      commoditiesFees,
      mortgageFees,
      totalProfessionalFees,
      totalCosts,
      totalPurchase,
      taxRate: taxInfo.rate || taxInfo.total,
      taxDisplay: taxInfo.display,
    };
  };

  // Save calculation to database
  const saveCalculation = async (calculationData) => {
    try {
      await supabase.from("calculation_logs").insert({
        user_id: user?.id || null,
        property_price: calculationData.price,
        property_type: propertyType === "newBuild" ? "new_build" : "resale",
        region: region,
        include_mortgage: includeMortgage,
        tax_rate: calculationData.taxRate,
        purchase_tax: calculationData.purchaseTaxes,
        notary_fees: calculationData.notaryFees,
        registry_fees: calculationData.registryFees,
        legal_fees: calculationData.legalFees,
        admin_fees: calculationData.adminFees,
        commodities_fees: calculationData.commoditiesFees,
        mortgage_fees: calculationData.mortgageFees,
        total_cost: calculationData.totalCosts,
      });
      return true;
    } catch (error) {
      console.error("Error saving calculation:", error);
      return false;
    }
  };

  // Send email with calculation details
  const sendCalculationEmail = async (calculationData) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "send-calculation-email",
        {
          body: {
            userEmail: user?.email || "Unknown",
            userId: user?.id || "Unknown",
            calculationData: {
              ...calculationData,
              propertyType,
              region,
              includeMortgage,
            },
          },
        }
      );

      if (error) {
        console.error("Error sending email:", error);
        toast({
          title: "Email Error",
          description:
            "Calculation saved but failed to send email notification",
          variant: "destructive",
        });
      } else {
        console.log("Email sent successfully:", data);
      }
    } catch (error) {
      console.error("Error sending calculation email:", error);
    }
  };

  // Handle calculate button click
  const handleCalculate = async () => {
    const costs = calculateCosts(
      propertyPrice,
      propertyType,
      region,
      includeMortgage
    );
    if (!costs) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid property price",
        variant: "destructive",
      });
      return;
    }

    // Save to database and send email
    const saved = await saveCalculation(costs);
    if (saved) {
      await sendCalculationEmail(costs);
    } else {
      toast({
        title: "Save Error",
        description: "Failed to save calculation",
        variant: "destructive",
      });
    }

    // Set the calculated costs to display on the right side
    setCalculatedCosts(costs);
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">
            Spanish Property Cost Calculator
          </h1>
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
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary z-10" />
                  <Input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(e.target.value)}
                    placeholder="250000"
                    className="pl-10 bg-white/10 border-white/30 text-white placeholder-white/50 focus:border-secondary"
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
                    onClick={() => setPropertyType("newBuild")}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      propertyType === "newBuild"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    New Build
                  </button>
                  <button
                    onClick={() => setPropertyType("resale")}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      propertyType === "resale"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-white/10 text-white hover:bg-white/20"
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
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/30">
                    <SelectItem
                      value="valencia"
                      className="text-white hover:bg-white/10"
                    >
                      Valencia (Costa Blanca)
                    </SelectItem>
                    <SelectItem
                      value="murcia"
                      className="text-white hover:bg-white/10"
                    >
                      Murcia (Costa Calida)
                    </SelectItem>
                    <SelectItem
                      value="andalusia"
                      className="text-white hover:bg-white/10"
                    >
                      Andalusia
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIncludeMortgage(false)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      !includeMortgage
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Calculate Button */}
              <div className="pt-4">
                <button
                  onClick={handleCalculate}
                  disabled={!propertyPrice || parseFloat(propertyPrice) <= 0}
                  className="w-full py-3 px-6 bg-secondary text-secondary-foreground font-bold rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Calculate & Save
                </button>
              </div>
            </div>
          </div>

          {/* Cost Breakdown - Only shows after calculation */}
          {calculatedCosts && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">
                Cost Breakdown
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Property Price</span>
                    <span className="text-white font-bold">
                      €{calculatedCosts.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-3">
                  <h4 className="text-secondary font-medium mb-2">
                    Purchase Taxes
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">
                      {calculatedCosts.taxDisplay}
                    </span>
                    <span className="text-white">
                      €{calculatedCosts.purchaseTaxes.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-3">
                  <h4 className="text-secondary font-medium mb-2">
                    Professional Fees
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Notary Fees</span>
                      <span className="text-white">
                        €{calculatedCosts.notaryFees.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Registry Fees</span>
                      <span className="text-white">
                        €{calculatedCosts.registryFees.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Legal Fees</span>
                      <span className="text-white">
                        €{calculatedCosts.legalFees.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Administrative Fees</span>
                      <span className="text-white">
                        €{calculatedCosts.adminFees.toLocaleString()}
                      </span>
                    </div>
                    {calculatedCosts.commoditiesFees > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">
                          Connecting Commodities
                        </span>
                        <span className="text-white">
                          €{calculatedCosts.commoditiesFees.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {calculatedCosts.mortgageFees > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">
                          Mortgage Arrangement Fees
                        </span>
                        <span className="text-white">
                          €{calculatedCosts.mortgageFees.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-secondary font-medium">
                      Total Additional Costs
                    </span>
                    <span className="text-secondary font-bold">
                      €{calculatedCosts.totalCosts.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-secondary/20 to-secondary/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">
                        Total Purchase Price
                      </span>
                      <span className="text-secondary font-bold text-xl">
                        €{calculatedCosts.totalPurchase.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
          <p className="text-white/60 text-sm text-center">
            This calculator provides estimates only. Actual costs may vary.
            Please consult with a professional for accurate figures.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SpanishPropertyCalculator;
