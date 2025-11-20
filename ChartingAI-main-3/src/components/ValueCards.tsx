import { motion } from "framer-motion";
import { Clock, Zap, TrendingUp, Users } from "lucide-react";

export const ValueCards = () => {
  const values = [
    {
      icon: Clock,
      value: "80%",
      metric: "Time Reduction",
      title: "Save Time",
      description: "Reduce documentation time by up to 80% with AI-powered charting, allowing healthcare professionals to focus on patient care.",
    },
    {
      icon: Zap,
      value: "70%",
      metric: "Fewer Clicks",
      title: "Streamline Workflows",
      description: "Cut down on repetitive tasks and streamline workflows with intelligent automation that learns from your patterns.",
    },
    {
      icon: TrendingUp,
      value: "99%",
      metric: "Accuracy Rate",
      title: "Better Outcomes",
      description: "Improve patient care with more accurate and timely documentation, reducing errors and enhancing clinical decision-making.",
    },
    {
      icon: Users,
      value: "100%",
      metric: "Collaboration",
      title: "Team Integration",
      description: "Enable seamless communication across your healthcare team with real-time updates and shared documentation.",
    },
  ];

  return (
    <section className="py-32 px-6 bg-white dark:bg-black">
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
            Why Healthcare Professionals
            <br />
            Choose ChartingAI
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Data-driven insights that transform clinical documentation workflows
          </p>
        </motion.div>

        {/* Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <div className="h-full p-8 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:border-neutral-300/50 dark:hover:border-neutral-700/50">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Metric */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                        {value.value}
                      </span>
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        {value.metric}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 tracking-tight">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
