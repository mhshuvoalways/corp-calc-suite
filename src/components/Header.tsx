import { Link } from "react-router-dom";
import { Button } from "./ui/button";

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
          </Link>

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
