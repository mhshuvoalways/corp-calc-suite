import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface CalculationLog {
  id: string;
  user_id: string | null;
  property_price: number;
  total_cost: number;
  property_type: string;
  region: string;
  tax_rate: number;
  include_mortgage: boolean;
  created_at: string;
  profiles?: {
    email: string;
  } | null;
}

const CalculatorLogs = () => {
  const [logs, setLogs] = useState<CalculationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('calculation_logs')
          .select(`
            *,
            profiles:user_id (
              email
            )
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Error fetching calculation logs:', error);
        } else {
          setLogs(data as any || []);
        }
      } catch (error) {
        console.error('Error fetching calculation logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Calculator Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">Loading calculation logs...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calculator Logs</h1>
        <p className="text-muted-foreground">
          View all calculations performed by users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Calculations ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No calculations found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Property Price</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Property Type</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Tax Rate</TableHead>
                    <TableHead>Mortgage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        {log.profiles?.email ? (
                          <div className="text-sm">{log.profiles.email}</div>
                        ) : (
                          <Badge variant="secondary">Anonymous</Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(log.property_price)}
                      </TableCell>
                      <TableCell className="font-medium text-primary">
                        {formatCurrency(log.total_cost)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.property_type}</Badge>
                      </TableCell>
                      <TableCell>{log.region}</TableCell>
                      <TableCell>{(log.tax_rate * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        {log.include_mortgage ? (
                          <Badge variant="default">Yes</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculatorLogs;