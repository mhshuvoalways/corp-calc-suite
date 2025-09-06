import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [exporting, setExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [allLogs, setAllLogs] = useState<CalculationLog[]>([]);
  const { toast } = useToast();
  const pageSize = 20;

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      // Get paginated data
      const { data, error, count } = await supabase
        .from('calculation_logs')
        .select(`
          *,
          profiles:user_id (
            email
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('Error fetching calculation logs:', error);
        toast({
          title: "Error",
          description: "Failed to fetch calculation logs. Please try again.",
          variant: "destructive",
        });
      } else {
        setLogs(data as any || []);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error('Error fetching calculation logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch calculation logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLogsForExport = async () => {
    try {
      const { data, error } = await supabase
        .from('calculation_logs')
        .select(`
          *,
          profiles:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any || [];
    } catch (error) {
      console.error('Error fetching all logs:', error);
      throw error;
    }
  };

  const exportToCSV = async () => {
    setExporting(true);
    try {
      const allLogs = await fetchAllLogsForExport();
      
      // Prepare CSV data
      const csvHeaders = [
        'Date', 'User Email', 'Property Price', 'Total Cost', 'Property Type', 
        'Region', 'Tax Rate', 'Include Mortgage', 'Purchase Tax', 'Notary Fees',
        'Registry Fees', 'Legal Fees', 'Admin Fees', 'Commodities Fees', 'Mortgage Fees'
      ];
      
      const csvData = allLogs.map((log: any) => [
        format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
        log.profiles?.email || 'Anonymous',
        log.property_price,
        log.total_cost,
        log.property_type,
        log.region,
        (log.tax_rate * 100).toFixed(1) + '%',
        log.include_mortgage ? 'Yes' : 'No',
        log.purchase_tax || 0,
        log.notary_fees || 0,
        log.registry_fees || 0,
        log.legal_fees || 0,
        log.admin_fees || 0,
        log.commodities_fees || 0,
        log.mortgage_fees || 0,
      ]);

      // Create CSV content
      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => 
          row.map(field => 
            typeof field === 'string' && (field.includes(',') || field.includes('"'))
              ? `"${field.replace(/"/g, '""')}"` 
              : field
          ).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `calculator_logs_export_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Exported ${allLogs.length} calculation logs to CSV file.`,
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export calculation logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calculator Logs</h1>
          <p className="text-muted-foreground">
            View all calculations performed by users
          </p>
        </div>
        <Button onClick={exportToCSV} disabled={exporting || totalCount === 0} className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Exporting...' : 'Export Logs'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Calculations ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground p-6">
              Loading calculation logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground p-6">
              No calculations found
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <div className="overflow-x-auto max-w-full">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Date</TableHead>
                      <TableHead className="min-w-[150px]">User</TableHead>
                      <TableHead className="min-w-[120px]">Property Price</TableHead>
                      <TableHead className="min-w-[120px]">Total Cost</TableHead>
                      <TableHead className="min-w-[120px]">Property Type</TableHead>
                      <TableHead className="min-w-[100px]">Region</TableHead>
                      <TableHead className="min-w-[80px]">Tax Rate</TableHead>
                      <TableHead className="min-w-[80px]">Mortgage</TableHead>
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
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 p-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="text-sm text-muted-foreground ml-4">
              Page {currentPage} of {totalPages} ({totalCount} total)
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CalculatorLogs;