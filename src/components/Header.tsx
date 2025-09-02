import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "./ui/button";

const Header = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

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
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Prime Estate Luxury Homes"
              className="h-14"
            />
            <div className="text-white tracking-widest">
              <h2 className="text-3xl font-semibold">PRIME ESTATE</h2>
              <p>Luxury Homes</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <Link to="/calculator">
              <Button variant="secondary" className="hidden md:inline-flex">
                {t("nav.calculator")}
              </Button>
            </Link>

            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t("nav.logout")}
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t("nav.login")}
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
