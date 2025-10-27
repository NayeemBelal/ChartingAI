// import { useNavigate } from "react-router-dom";

// type AgentStatus = "production" | "validation";

// type Agent = {
//   id: string;
//   code: string; // short badge like "CAI", "BI"
//   name: string;
//   blurb: string;
//   bullets: string[];
//   status: AgentStatus;
//   cta: string;
//   disabled?: boolean;
//   onClickPath?: string;
// };

// const AGENTS: Agent[] = [
//   {
//     id: "charting-ai",
//     code: "CAI",
//     name: "Charting AI",
//     blurb: "Generate structured clinical notes from encounter audio.",
//     bullets: [
//       "Transcribes physician–patient conversation",
//       "Drafts HPI / ROS / PE / A/P",
//       "Suggests ICD-10 & CPT codes",
//     ],
//     status: "production",
//     cta: "Open",
//     disabled: false,
//     onClickPath: "/charting-ai-dashboard",
//   },
//   {
//     id: "billing-intel",
//     code: "BI",
//     name: "Billing Intelligence",
//     blurb:
//       "Pre-builds claims and surfaces payer rules before submission.",
//     bullets: [
//       "Prepares claim draft",
//       "Flags missing documentation",
//       "Reduces denial risk",
//     ],
//     status: "validation",
//     cta: "Request access",
//     disabled: true,
//   },
// ];

// export function MarketplacePage() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-neutral-900 flex flex-col">
//       {/* Header */}
//       <header className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur">
//         <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between flex-wrap gap-4">
//           {/* Brand */}
//           <div className="flex items-start gap-2">
//             <div
//               className="h-8 w-8 rounded-md text-[11px] font-medium grid place-items-center shadow-sm border"
//               style={{
//                 backgroundColor: "#e9f1ff",
//                 color: "#2f59b0",
//                 borderColor: "#a3c4ff",
//               }}
//             >
//               AI
//             </div>

//             <div className="leading-tight">
//               <div className="text-[14px] font-semibold text-neutral-900">
//                 ChartingAI Platform
//               </div>
//               <div className="text-[12px] text-neutral-500">
//                 Assistants Marketplace
//               </div>
//             </div>
//           </div>

//           {/* Nav */}
//           <nav className="flex items-center gap-6 text-[13px] text-neutral-700">
//             <button
//               className="hover:text-neutral-900 transition"
//               onClick={() => navigate("/success")}
//             >
//               Encounters
//             </button>

//             <button
//               className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition"
//               onClick={() => navigate("/profile")}
//             >
//               <div className="h-7 w-7 rounded-full bg-neutral-100 border border-neutral-300 text-[11px] text-neutral-600 grid place-items-center">
//                 DR
//               </div>
//               <span className="text-[13px] font-medium">Profile</span>
//             </button>
//           </nav>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex-1 flex flex-col items-center px-4 py-12">
//         {/* Hero */}
//         <section className="w-full max-w-3xl text-center mb-10">
//           <div
//             className="inline-flex items-center justify-center rounded-md text-[11px] font-medium leading-none px-2 py-1 shadow-sm mb-4 border"
//             style={{
//               backgroundColor: "#e9f1ff",
//               color: "#2f59b0",
//               borderColor: "#a3c4ff",
//             }}
//           >
//             Clinical AI Suite
//           </div>

//           <h1 className="text-[1.5rem] font-semibold tracking-tight text-neutral-900 leading-tight">
//             Choose an assistant
//           </h1>

//           <p className="text-[14px] text-neutral-600 leading-relaxed mt-3 max-w-xl mx-auto">
//             Each assistant takes on one repetitive task in clinic. It drafts
//             the work, shows you, and waits for your approval.
//           </p>
//         </section>

//         {/* Assistants grid (centered) */}
//         <section className="w-full flex justify-center mt-6 mb-2">
//           {/* key change:
//              - max-w-[720px] keeps row tight and centered with 2 cards
//              - md:grid-cols-2 so they sit side by side
//           */}
//           <div className="grid w-full max-w-[720px] gap-7 md:grid-cols-2">
//             {AGENTS.map((agent) => (
//               <AgentCard
//                 key={agent.id}
//                 agent={agent}
//                 onClick={() => {
//                   if (!agent.disabled && agent.onClickPath) {
//                     navigate(agent.onClickPath);
//                   }
//                 }}
//               />
//             ))}
//           </div>
//         </section>

//         {/* Note */}
//         <p className="text-[12px] text-neutral-500 leading-relaxed mt-10 text-center">
//           More assistants are in pilot. Access is controlled to protect patient
//           data.
//         </p>
//       </main>

//       {/* Footer */}
//       <footer className="w-full border-t border-neutral-200 bg-white/80 backdrop-blur">
//         <div className="mx-auto max-w-6xl px-4 py-6 text-center">
//           <p className="text-[12px] text-neutral-500 leading-normal">
//             Marketplace Clinical Assistants © 2025
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// /* ------------------------------------------------------------------
//  * AgentCard
//  * ------------------------------------------------------------------ */

// function AgentCard({
//   agent,
//   onClick,
// }: {
//   agent: Agent;
//   onClick: () => void;
// }) {
//   const isProd = agent.status === "production";

//   // palette
//   const cardBorderColor = isProd ? "#a3c4ff" : "#ffd889";
//   const codeBg = isProd ? "#f5f9ff" : "#fff9ed";
//   const codeText = isProd ? "#2f59b0" : "#f6a800";
//   const codeBorder = isProd ? "#a3c4ff" : "#ffd889";

//   const badgeBg = codeBg;
//   const badgeText = codeText;
//   const badgeBorder = codeBorder;

//   const cardShadow = isProd
//     ? "0 16px 40px -8px rgba(0,0,0,0.08)"
//     : "0 16px 40px -8px rgba(0,0,0,0.06)";

//   return (
//     <div
//       className="rounded-xl bg-white flex flex-col"
//       style={{
//         borderWidth: "1px",
//         borderColor: cardBorderColor,
//         boxShadow: cardShadow,
//       }}
//     >
//       {/* header area */}
//       <div className="flex items-start justify-between p-5 pb-4">
//         <div className="flex items-start gap-3">
//           {/* icon circle */}
//           <div
//             className="h-10 w-10 rounded-full grid place-items-center text-[12px] font-medium"
//             style={{
//               backgroundColor: codeBg,
//               color: codeText,
//               border: `1px solid ${codeBorder}`,
//             }}
//           >
//             {agent.code}
//           </div>

//           <div>
//             <div className="text-[15px] font-semibold text-neutral-900 leading-snug">
//               {agent.name}
//             </div>
//             <div className="text-[13px] text-neutral-700 leading-relaxed">
//               {agent.blurb}
//             </div>
//           </div>
//         </div>

//         {/* status pill */}
//         <div
//           className="rounded-md text-[11px] font-medium leading-none px-2 py-1 whitespace-nowrap"
//           style={{
//             backgroundColor: badgeBg,
//             color: badgeText,
//             border: `1px solid ${badgeBorder}`,
//           }}
//         >
//           {isProd ? "Production" : "In validation"}
//         </div>
//       </div>

//       {/* bullets (NOW REAL BULLETS) */}
//       <ul className="px-5 pb-5 text-[13px] text-neutral-800 leading-relaxed list-disc pl-5 space-y-2">
//         {agent.bullets.map((line) => (
//           <li key={line}>{line}</li>
//         ))}
//       </ul>

//       {/* footer / CTA */}
//       <div className="px-5 py-4 bg-neutral-50 rounded-b-xl border-t border-neutral-200">
//         {agent.disabled ? (
//           <button
//             disabled
//             className="w-full text-[13px] font-medium rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-500 py-2 cursor-not-allowed"
//           >
//             {agent.cta}
//           </button>
//         ) : (
//           <button
//             onClick={onClick}
//             className="w-full text-[13px] font-medium rounded-lg bg-neutral-900 text-white py-2 hover:bg-neutral-800 transition"
//           >
//             {agent.cta}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }



import { useNavigate } from "react-router-dom";

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
    blurb:
      "Pre-builds claims and surfaces payer rules before submission.",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-neutral-900 flex flex-col">
      {/* HEADER */}
      <header className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between flex-wrap gap-4">
          {/* Brand */}
          <div className="flex items-start gap-2">
            <div
              className="h-8 w-8 rounded-md text-[11px] font-medium grid place-items-center shadow-sm border"
              style={{
                backgroundColor: "#e9f1ff",
                color: "#2f59b0",
                borderColor: "#a3c4ff",
              }}
            >
              AI
            </div>

            <div className="leading-tight">
              <div className="text-[14px] font-semibold text-neutral-900">
                ChartingAI Platform
              </div>
              <div className="text-[12px] text-neutral-500">
                Assistants Marketplace
              </div>
            </div>
          </div>

          {/* Nav / profile */}
          <nav className="flex items-center gap-6 text-[13px] text-neutral-700">
            <button
              className="hover:text-neutral-900 transition"
              onClick={() => navigate("/charting-ai-dashboard")}
            >
              Encounters
            </button>

            <button
              className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900 transition"
              onClick={() => navigate("/profile")}
            >
              <div className="h-7 w-7 rounded-full bg-neutral-100 border border-neutral-300 text-[11px] text-neutral-600 grid place-items-center">
                DR
              </div>
              <span className="text-[13px] font-medium">Profile</span>
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 flex flex-col items-center px-4 py-12">
        {/* Hero text */}
        <section className="w-full max-w-3xl text-center mb-10">
          <div
            className="inline-flex items-center justify-center rounded-md text-[11px] font-medium leading-none px-2 py-1 shadow-sm mb-4 border"
            style={{
              backgroundColor: "#e9f1ff",
              color: "#2f59b0",
              borderColor: "#a3c4ff",
            }}
          >
            Clinical AI Suite
          </div>

          <h1 className="text-[1.5rem] font-semibold tracking-tight text-neutral-900 leading-tight">
            Choose an assistant
          </h1>

          <p className="text-[14px] text-neutral-600 leading-relaxed mt-3 max-w-xl mx-auto">
            Each assistant takes on one repetitive task in clinic. It drafts
            the work, shows you, and waits for your approval.
          </p>
        </section>

        {/* Cards grid */}
        <section className="w-full flex justify-center mt-6 mb-2">
          <div className="grid w-full max-w-[720px] gap-7 md:grid-cols-2">
            {AGENTS.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onClick={() => {
                  if (!agent.disabled && agent.onClickPath) {
                    navigate(agent.onClickPath);
                  }
                }}
              />
            ))}
          </div>
        </section>

        <p className="text-[12px] text-neutral-500 leading-relaxed mt-10 text-center">
          More assistants are in pilot. Access is controlled to protect patient
          data.
        </p>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center">
          <p className="text-[12px] text-neutral-500 leading-normal">
            Marketplace Clinical Assistants © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

// This is CRITICAL ↓
export default MarketplacePage;

/* ------------ Card component for each agent ------------ */

function AgentCard({
  agent,
  onClick,
}: {
  agent: Agent;
  onClick: () => void;
}) {
  const isProd = agent.status === "production";

  const cardBorderColor = isProd ? "#a3c4ff" : "#ffd889";
  const badgeBg = isProd ? "#f5f9ff" : "#fff9ed";
  const badgeText = isProd ? "#2f59b0" : "#f6a800";
  const badgeBorder = isProd ? "#a3c4ff" : "#ffd889";

  return (
    <div
      className="rounded-xl bg-white flex flex-col"
      style={{
        borderWidth: "1px",
        borderColor: cardBorderColor,
        boxShadow: isProd
          ? "0 16px 40px -8px rgba(0,0,0,0.08)"
          : "0 16px 40px -8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start justify-between p-5 pb-4">
        <div className="flex items-start gap-3">
          {/* Agent code circle */}
          <div
            className="h-10 w-10 rounded-full grid place-items-center text-[12px] font-medium"
            style={{
              backgroundColor: badgeBg,
              color: badgeText,
              border: `1px solid ${badgeBorder}`,
            }}
          >
            {agent.code}
          </div>

          <div>
            <div className="text-[15px] font-semibold text-neutral-900 leading-snug">
              {agent.name}
            </div>
            <div className="text-[13px] text-neutral-700 leading-relaxed">
              {agent.blurb}
            </div>
          </div>
        </div>

        {/* status badge */}
        <div
          className="rounded-md text-[11px] font-medium leading-none px-2 py-1 whitespace-nowrap"
          style={{
            backgroundColor: badgeBg,
            color: badgeText,
            border: `1px solid ${badgeBorder}`,
          }}
        >
          {isProd ? "Production" : "In validation"}
        </div>
      </div>

      <ul className="px-5 pb-5 text-[13px] text-neutral-800 leading-relaxed list-disc pl-5 space-y-2">
        {agent.bullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <div className="px-5 py-4 bg-neutral-50 rounded-b-xl border-t border-neutral-200">
        {agent.disabled ? (
          <button
            disabled
            className="w-full text-[13px] font-medium rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-500 py-2 cursor-not-allowed"
          >
            {agent.cta}
          </button>
        ) : (
          <button
            onClick={onClick}
            className="w-full text-[13px] font-medium rounded-lg bg-neutral-900 text-white py-2 hover:bg-neutral-800 transition"
          >
            {agent.cta}
          </button>
        )}
      </div>
    </div>
  );
}
