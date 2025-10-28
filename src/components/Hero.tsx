import { motion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-hero-gradient pt-16">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            ChartingAI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            AI-powered medical charting that cuts clicks, speeds notes, and elevates patient care.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2 group">
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2">
                Sign In
              </Button>
            </Link>
            <Link to="/marketplace-new">
              <Button size="lg" variant="outline" className="gap-2">
                <Store className="w-4 h-4" />
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
