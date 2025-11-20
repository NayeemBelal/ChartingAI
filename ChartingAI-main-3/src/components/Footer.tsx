import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-black py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-apple">
                <span className="text-white font-semibold text-sm tracking-tight">CA</span>
              </div>
              <span className="font-semibold text-lg tracking-tight text-neutral-900 dark:text-white">
                ChartingAI
              </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-xs">
              Transforming healthcare documentation with intelligent automation.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 tracking-tight">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/marketplace-new" 
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link 
                  to="/charting-ai-dashboard" 
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
                >
                  Charting Agent
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
                >
                  Dashboard
            </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 tracking-tight">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/about" 
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
                >
                  About
            </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
                >
              Contact
            </Link>
              </li>
              <li>
                <Link 
                  to="/careers" 
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 tracking-tight">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/security" 
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
              © 2025 ChartingAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
              >
                Twitter
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors font-light"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
