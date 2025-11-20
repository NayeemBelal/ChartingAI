import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-32 bg-gradient-to-b from-white via-neutral-50/30 to-white dark:from-black dark:via-neutral-950/30 dark:to-black overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 tracking-wide uppercase">
              AI-Powered Medical Charting
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-neutral-900 dark:text-white leading-[1.1] text-balance"
          >
            Transform Healthcare
            <br />
            <span className="text-blue-600 dark:text-blue-400">Documentation</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed text-balance font-light"
          >
            Intelligent medical charting that reduces documentation time by 80%, 
            improves accuracy, and enables healthcare professionals to focus on patient care.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link to="/signup">
              <Button 
                size="lg"
                className="group h-12 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-apple-lg rounded-xl transition-all hover:shadow-xl hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-700 rounded-xl transition-all text-neutral-900 dark:text-neutral-100"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: "80%", label: "Time Reduction" },
              { value: "99%", label: "Accuracy Rate" },
              { value: "24/7", label: "Availability" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                  {stat.label}
                </div>
          </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
