import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group transition-opacity hover:opacity-80"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-apple transition-transform group-hover:scale-105">
            <span className="text-white font-semibold text-sm tracking-tight">CA</span>
          </div>
          <span className="font-semibold text-xl tracking-tight text-neutral-900 dark:text-neutral-100">
            ChartingAI
          </span>
        </Link>
        
        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/" 
                ? "text-neutral-900 dark:text-neutral-100" 
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/marketplace-new" 
            className={`text-sm font-medium transition-colors ${
              location.pathname.includes("marketplace") 
                ? "text-neutral-900 dark:text-neutral-100" 
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            Marketplace
          </Link>
        </div>
        
        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 h-9 px-4"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button 
              size="sm"
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-apple h-9 px-5 rounded-lg transition-all hover:shadow-apple-lg"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
