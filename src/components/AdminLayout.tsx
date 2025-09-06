import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LayoutDashboard, 
  Calculator, 
  Users, 
  LogOut,
  Loader2,
  Menu
} from 'lucide-react';

const AdminLayout = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const { toast } = useToast();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const navItems = [
    { 
      path: '/admin', 
      label: 'Overview', 
      icon: LayoutDashboard,
      exact: true 
    },
    { 
      path: '/admin/calculator', 
      label: 'Calculator Logs', 
      icon: Calculator 
    },
    { 
      path: '/admin/users', 
      label: 'Users', 
      icon: Users 
    },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = ({ className = "" }: { className?: string }) => (
    <div className={`bg-card border-r h-screen flex flex-col ${className}`}>
      <div className="p-6 border-b flex-shrink-0">
        <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Prime Estate Calculator
        </p>
      </div>
      
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path, item.exact)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 flex-shrink-0">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground mb-2">
              Logged in as:
            </div>
            <div className="text-sm font-medium truncate mb-3">
              {user.email}
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="flex h-full">
        {/* Desktop Sidebar - Fixed */}
        {!isMobile && (
          <div className="w-64 flex-shrink-0">
            <SidebarContent />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Fixed Header */}
          <header className="bg-card border-b px-4 py-4 lg:px-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                      <SidebarContent />
                    </SheetContent>
                  </Sheet>
                )}
                <h2 className="text-lg font-semibold">
                  {navItems.find(item => isActive(item.path, item.exact))?.label || 'Admin'}
                </h2>
              </div>
              <div className="text-sm text-muted-foreground hidden sm:block">
                Welcome back, Admin
              </div>
            </div>
          </header>
          
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;