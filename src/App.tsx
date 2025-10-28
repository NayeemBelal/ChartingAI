import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import ChartingDashboard from "./pages/ChartingDashboard";
import JobStatus from "./pages/JobStatus";
import NotFound from "./pages/NotFound";
// Import friends' components
import MarketPlacePage from "./pages/MarketPlacePage";
import ChartingAIDashboardPage from "./pages/ChartingAIDashboardPage";
import { SuccessPage } from "./pages/SuccessPage";
import { ProfilePage } from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/charting-dashboard" element={<ChartingDashboard />} />
          <Route path="/jobs/:id" element={<JobStatus />} />
          {/* Friends' components routes */}
          <Route path="/marketplace-new" element={<MarketPlacePage />} />
          <Route path="/charting-ai-dashboard" element={<ChartingAIDashboardPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
