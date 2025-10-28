import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ValueCards } from "@/components/ValueCards";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";

const Landing = () => {
  return (
    <>
      <Helmet>
        <title>ChartingAI - AI-Powered Medical Charting</title>
        <meta
          name="description"
          content="AI-powered medical charting that cuts clicks, speeds notes, and elevates patient care. Transform your healthcare workflow with intelligent automation."
        />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <ValueCards />
        <HowItWorks />
        <Footer />
      </div>
    </>
  );
};

export default Landing;
