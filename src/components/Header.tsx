import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-6">
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src="/logo.svg" 
              alt="Prime Estate Luxury Homes" 
              className="h-12 w-auto"
            />
            <div className="text-white">
              <h2 className="text-xl font-bold">Prime Estate</h2>
              <p className="text-sm text-secondary">Luxury Homes</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-secondary transition-colors">
              Home
            </Link>
            <Link to="/calculator" className="text-white hover:text-secondary transition-colors">
              Calculator
            </Link>
            <a href="#" className="text-white hover:text-secondary transition-colors">
              Properties
            </a>
            <a href="#" className="text-white hover:text-secondary transition-colors">
              About
            </a>
            <a href="#" className="text-white hover:text-secondary transition-colors">
              Contact
            </a>
          </nav>
          
          <Link to="/calculator">
            <Button variant="secondary" className="hidden md:inline-flex">
              Get Calculator
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;