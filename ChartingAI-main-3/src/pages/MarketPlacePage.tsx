import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";

type AgentStatus = "production" | "validation";

type Agent = {
  id: string;
  code: string;
  name: string;
  blurb: string;
  bullets: string[];
  status: AgentStatus;
  cta: string;
  disabled?: boolean;
  onClickPath?: string;
};

const AGENTS: Agent[] = [
  {
    id: "charting-ai",
    code: "CAI",
    name: "Charting AI",
    blurb: "Generate structured clinical notes from encounter audio.",
    bullets: [
      "Transcribes physician–patient conversation",
      "Drafts HPI / ROS / PE / A/P",
      "Suggests ICD-10 & CPT codes",
    ],
    status: "production",
    cta: "Open",
    disabled: false,
    onClickPath: "/charting-ai-dashboard",
  },
  {
    id: "billing-intel",
    code: "BI",
    name: "Billing Intelligence",
    blurb: "Pre-builds claims and surfaces payer rules before submission.",
    bullets: [
      "Prepares claim draft",
      "Flags missing documentation",
      "Reduces denial risk",
    ],
    status: "validation",
    cta: "Request access",
    disabled: true,
  },
];

function MarketplacePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-apple">
              <span className="text-white font-semibold text-sm tracking-tight">CA</span>
            </div>
            <div>
              <div className="text-base font-semibold text-neutral-900 dark:text-white tracking-tight">
                ChartingAI Platform
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                Assistants Marketplace
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <button
              onClick={() => navigate("/charting-ai-dashboard")}
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Encounters
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
                DR
              </div>
              Profile
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-16 bg-white dark:bg-black">
        <div className="mx-auto max-w-5xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 mb-6">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 tracking-wide uppercase">
                Clinical AI Suite
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6 text-balance">
              Choose an Assistant
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
              Each assistant takes on one repetitive task in clinic. It drafts the work, shows you, and waits for your approval.
            </p>
          </motion.div>

          {/* Agent Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {AGENTS.map((agent, index) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                index={index}
                onClick={() => {
                  if (!agent.disabled && agent.onClickPath) {
                    navigate(agent.onClickPath);
                  }
                }}
              />
            ))}
          </div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-sm text-neutral-600 dark:text-neutral-400 font-light"
          >
            More assistants are in pilot. Access is controlled to protect patient data.
          </motion.p>
        </div>
      </main>
    </div>
  );
}

/* Agent Card Component */
function AgentCard({
  agent,
  index,
  onClick,
}: {
  agent: Agent;
  index: number;
  onClick: () => void;
}) {
  const isProd = agent.status === "production";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="h-full p-8 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:border-neutral-300/50 dark:hover:border-neutral-700/50 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {/* Code Badge */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold ${
                isProd
                  ? "bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/50 text-blue-700 dark:text-blue-300"
                  : "bg-amber-50 dark:bg-amber-950/50 border border-amber-200/50 dark:border-amber-900/50 text-amber-700 dark:text-amber-300"
              }`}
            >
              {agent.code}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2 tracking-tight">
                {agent.name}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                {agent.blurb}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              isProd
                ? "bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/50 text-blue-700 dark:text-blue-300"
                : "bg-amber-50 dark:bg-amber-950/50 border border-amber-200/50 dark:border-amber-900/50 text-amber-700 dark:text-amber-300"
            }`}
          >
            {isProd ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" />
                Production
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                In Validation
              </span>
            )}
          </div>
        </div>

        {/* Bullets */}
        <ul className="space-y-3 mb-8 flex-1">
          {agent.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-light">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 flex-shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50">
          {agent.disabled ? (
            <button
              disabled
              className="w-full h-11 text-sm font-semibold rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
            >
              {agent.cta}
            </button>
          ) : (
            <button
              onClick={onClick}
              className="w-full h-11 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-apple transition-all flex items-center justify-center gap-2 group"
            >
              {agent.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default MarketplacePage;
