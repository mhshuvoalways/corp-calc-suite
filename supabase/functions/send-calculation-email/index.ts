import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CalculationEmailRequest {
  userEmail: string;
  userId: string;
  calculationData: {
    price: number;
    propertyType: string;
    region: string;
    includeMortgage: boolean;
    purchaseTaxes: number;
    notaryFees: number;
    registryFees: number;
    legalFees: number;
    adminFees: number;
    commoditiesFees: number;
    mortgageFees: number;
    totalCosts: number;
    totalPurchase: number;
    taxRate: number;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userId, calculationData }: CalculationEmailRequest = await req.json();

    console.log("Sending calculation email for user:", userEmail);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .section { margin-bottom: 20px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
            .section-header { background: #f5f5f5; padding: 15px; font-weight: bold; border-bottom: 1px solid #e0e0e0; }
            .section-content { padding: 15px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
            .row:last-child { border-bottom: none; }
            .total-row { background: #e8f5e8; font-weight: bold; padding: 12px; }
            .highlight { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏡 Spanish Property Calculation Report</h1>
            <p>New calculation submitted from your property calculator</p>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-header">👤 Client Information</div>
              <div class="section-content">
                <div class="row">
                  <span>Email:</span>
                  <span>${userEmail}</span>
                </div>
                <div class="row">
                  <span>User ID:</span>
                  <span>${userId}</span>
                </div>
                <div class="row">
                  <span>Calculation Date:</span>
                  <span>${new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-header">🏠 Property Details</div>
              <div class="section-content">
                <div class="row">
                  <span>Property Price:</span>
                  <span>${formatCurrency(calculationData.price)}</span>
                </div>
                <div class="row">
                  <span>Property Type:</span>
                  <span>${calculationData.propertyType === 'newBuild' ? 'New Build' : 'Resale'}</span>
                </div>
                <div class="row">
                  <span>Region:</span>
                  <span>${calculationData.region.charAt(0).toUpperCase() + calculationData.region.slice(1)}</span>
                </div>
                <div class="row">
                  <span>Include Mortgage:</span>
                  <span>${calculationData.includeMortgage ? 'Yes' : 'No'}</span>
                </div>
                <div class="row">
                  <span>Tax Rate:</span>
                  <span>${(calculationData.taxRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-header">💰 Cost Breakdown</div>
              <div class="section-content">
                <div class="row">
                  <span>Purchase Taxes:</span>
                  <span>${formatCurrency(calculationData.purchaseTaxes)}</span>
                </div>
                <div class="row">
                  <span>Notary Fees:</span>
                  <span>${formatCurrency(calculationData.notaryFees)}</span>
                </div>
                <div class="row">
                  <span>Registry Fees:</span>
                  <span>${formatCurrency(calculationData.registryFees)}</span>
                </div>
                <div class="row">
                  <span>Legal Fees:</span>
                  <span>${formatCurrency(calculationData.legalFees)}</span>
                </div>
                <div class="row">
                  <span>Administrative Fees:</span>
                  <span>${formatCurrency(calculationData.adminFees)}</span>
                </div>
                ${calculationData.commoditiesFees > 0 ? `
                <div class="row">
                  <span>Connecting Commodities:</span>
                  <span>${formatCurrency(calculationData.commoditiesFees)}</span>
                </div>
                ` : ''}
                ${calculationData.mortgageFees > 0 ? `
                <div class="row">
                  <span>Mortgage Arrangement Fees:</span>
                  <span>${formatCurrency(calculationData.mortgageFees)}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <div class="section">
              <div class="section-header">📊 Summary</div>
              <div class="section-content">
                <div class="row">
                  <span>Property Price:</span>
                  <span>${formatCurrency(calculationData.price)}</span>
                </div>
                <div class="row">
                  <span>Total Additional Costs:</span>
                  <span>${formatCurrency(calculationData.totalCosts)}</span>
                </div>
                <div class="total-row">
                  <div class="row" style="border: none;">
                    <span>Total Purchase Price:</span>
                    <span>${formatCurrency(calculationData.totalPurchase)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="highlight">
              Additional costs represent ${((calculationData.totalCosts / calculationData.price) * 100).toFixed(1)}% of the property price
            </div>

            <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
              This email was automatically generated from your Spanish Property Calculator<br>
              Generated on ${new Date().toLocaleString()}
            </p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Property Calculator <onboarding@resend.dev>",
      to: ["mhshuvoalways@gmail.com"],
      subject: `🏡 New Property Calculation - ${formatCurrency(calculationData.price)} (${userEmail})`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-calculation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);