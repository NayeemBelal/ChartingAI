import { motion } from "framer-motion";
import { Upload, Sparkles, FileText, CheckCircle, ArrowRight } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Audio",
      description: "Simply upload your consultation audio files or connect your recording device.",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "AI Processing",
      description: "Our advanced AI analyzes and transcribes conversations with medical accuracy.",
    },
    {
      number: "03",
      icon: FileText,
      title: "Generate Charts",
      description: "Automatically generate structured clinical notes and documentation in seconds.",
    },
    {
      number: "04",
      icon: CheckCircle,
      title: "Review & Approve",
      description: "Review the generated charts, make adjustments, and approve with confidence.",
    },
  ];

  return (
    <section className="py-32 px-6 bg-neutral-50/50 dark:bg-black/50">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6 text-balance">
            How It Works
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            A streamlined process that transforms your workflow in four simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="flex gap-8 items-start pb-16 last:pb-0">
                  {/* Left: Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {/* Step Number */}
                      <div className="text-6xl font-semibold text-neutral-200/50 dark:text-neutral-800/50 leading-none mb-2">
                        {step.number}
                      </div>
                      {/* Icon Container */}
                      <div className="absolute top-8 left-0 w-16 h-16 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 shadow-apple flex items-center justify-center">
                        <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                      </div>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 pt-6">
                    <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light max-w-xl">
                      {step.description}
                    </p>
                  </div>

                  {/* Connector Line */}
                  {!isLast && (
                    <div className="absolute left-8 top-24 w-0.5 h-full bg-gradient-to-b from-neutral-200 dark:from-neutral-800 to-transparent" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="/signup"
            className="inline-flex items-center gap-2 text-base font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
          >
            Get Started
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
