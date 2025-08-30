import { Link } from "react-router-dom";
import { Calculator, LogIn, LogOut } from 'lucide-react';
import { Button } from "./ui/button";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    }
  };

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-6">
          <Link to="/" className="flex items-center space-x-4">
            <Calculator className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">Property Calculator</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/calculator">
              <Button variant="secondary" className="hidden md:inline-flex">
                Get Calculator
              </Button>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm hidden sm:inline">
                  {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
