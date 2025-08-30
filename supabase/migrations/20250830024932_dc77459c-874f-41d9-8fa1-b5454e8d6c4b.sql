-- Create table for calculation logs
CREATE TABLE public.calculation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  property_price DECIMAL(12,2) NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('new_build', 'resale')),
  region TEXT NOT NULL,
  include_mortgage BOOLEAN NOT NULL DEFAULT false,
  tax_rate DECIMAL(5,4) NOT NULL,
  purchase_tax DECIMAL(12,2) NOT NULL,
  notary_fees DECIMAL(12,2) NOT NULL,
  registry_fees DECIMAL(12,2) NOT NULL,
  legal_fees DECIMAL(12,2) NOT NULL,
  admin_fees DECIMAL(12,2) NOT NULL,
  commodities_fees DECIMAL(12,2) NOT NULL,
  mortgage_fees DECIMAL(12,2) NOT NULL,
  total_cost DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calculation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for calculation logs
CREATE POLICY "Users can view their own calculation logs" 
ON public.calculation_logs 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create calculation logs" 
ON public.calculation_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create index for better performance
CREATE INDEX idx_calculation_logs_user_id ON public.calculation_logs(user_id);
CREATE INDEX idx_calculation_logs_created_at ON public.calculation_logs(created_at DESC);