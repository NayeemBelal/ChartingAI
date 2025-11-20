import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ShieldCheck, FileText, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: typeof ShieldCheck;
  route: string;
}

const agents: Agent[] = [
  {
    id: "insurance-verifier",
    name: "Insurance Verifier Agent",
    description: "Extracts data from referrals and validates insurance automatically.",
    icon: ShieldCheck,
    route: "/insurance-agent",
  },
  {
    id: "medical-charting",
    name: "Medical Charting Agent",
    description: "Generates draft charts from doctor–patient conversations to reduce click time.",
    icon: FileText,
    route: "/charting-dashboard",
  },
];

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Agent Marketplace - ChartingAI</title>
        <meta name="description" content="Explore and launch AI agents that automate medical charting workflows." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Agent Marketplace
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Explore and launch AI agents that automate medical charting workflows.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex justify-end">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Agent Grid */}
            {filteredAgents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredAgents.map((agent, index) => {
                  const Icon = agent.icon;
                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      whileHover={{ 
                        y: -8, 
                        boxShadow: "var(--shadow-card)",
                        transition: { duration: 0.15 }
                      }}
                    >
                      <Card className="h-full flex flex-col rounded-2xl overflow-hidden">
                        {/* Gradient Header */}
                        <div className="h-32 bg-hero-gradient" />
                        
                        <CardHeader className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl">{agent.name}</CardTitle>
                          </div>
                          <CardDescription className="text-base">
                            {agent.description}
                          </CardDescription>
                        </CardHeader>

                        <CardFooter className="mt-auto pt-6">
                          <Button 
                            onClick={() => navigate(agent.route)}
                            className="w-full"
                            size="lg"
                          >
                            Open Agent
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No agents found for this filter.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Marketplace;
