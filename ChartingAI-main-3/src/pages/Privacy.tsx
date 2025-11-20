import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, EyeOff, Database, Lock, FileText } from "lucide-react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import type { Role } from "@/types";

const Privacy = () => {
  const navigate = useNavigate();
  const [email] = useLocalStorage<string | null>("chartingai.email", null);
  const [role] = useLocalStorage<Role | null>("chartingai.role", null);

  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    emailVisible: false,
    analytics: true,
    dataSharing: false,
    marketing: false,
  });

  useEffect(() => {
    // Load privacy settings from localStorage
    const savedPrivacy = localStorage.getItem("chartingai.settings.privacy");
    if (savedPrivacy) {
      try {
        setPrivacySettings(JSON.parse(savedPrivacy));
      } catch (e) {
        console.error("Error parsing privacy settings:", e);
      }
    }

    // Redirect if not authenticated
    if (!email && !role) {
      navigate("/login");
    }
  }, [email, role, navigate]);

  const handlePrivacyChange = (key: keyof typeof privacySettings, value: boolean) => {
    const updated = { ...privacySettings, [key]: value };
    setPrivacySettings(updated);
    localStorage.setItem("chartingai.settings.privacy", JSON.stringify(updated));
  };

  if (!email && !role) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Privacy Settings - ChartingAI</title>
        <meta
          name="description"
          content="Manage your privacy settings and data preferences."
        />
      </Helmet>
      
      <div className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center px-6 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="fixed top-6 left-6 z-50 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 h-9 px-4 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl space-y-6"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-3">
              Privacy Settings
            </h1>
            <p className="text-base text-neutral-600 dark:text-neutral-400 font-light">
              Control your privacy and data sharing preferences
            </p>
          </div>

          {/* Profile Privacy */}
          <Card className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg bg-white dark:bg-black">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Profile Privacy
                </CardTitle>
              </div>
              <CardDescription className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                Control who can see your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profile-visible" className="text-sm font-medium text-neutral-900 dark:text-white">
                    Profile Visible
                  </Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch
                  id="profile-visible"
                  checked={privacySettings.profileVisible}
                  onCheckedChange={(checked) => handlePrivacyChange("profileVisible", checked)}
                />
              </div>
              <Separator className="dark:bg-neutral-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-visible" className="text-sm font-medium text-neutral-900 dark:text-white">
                    Email Visible
                  </Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    Show your email address on your profile
                  </p>
                </div>
                <Switch
                  id="email-visible"
                  checked={privacySettings.emailVisible}
                  onCheckedChange={(checked) => handlePrivacyChange("emailVisible", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data & Analytics */}
          <Card className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg bg-white dark:bg-black">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Data & Analytics
                </CardTitle>
              </div>
              <CardDescription className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                Control how your data is used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics" className="text-sm font-medium text-neutral-900 dark:text-white">
                    Analytics
                  </Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    Share anonymous usage data for analytics
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={privacySettings.analytics}
                  onCheckedChange={(checked) => handlePrivacyChange("analytics", checked)}
                />
              </div>
              <Separator className="dark:bg-neutral-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-sharing" className="text-sm font-medium text-neutral-900 dark:text-white">
                    Data Sharing
                  </Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    Allow data sharing with trusted partners
                  </p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={privacySettings.dataSharing}
                  onCheckedChange={(checked) => handlePrivacyChange("dataSharing", checked)}
                />
              </div>
              <Separator className="dark:bg-neutral-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing" className="text-sm font-medium text-neutral-900 dark:text-white">
                    Marketing
                  </Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    Receive marketing communications
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={privacySettings.marketing}
                  onCheckedChange={(checked) => handlePrivacyChange("marketing", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg bg-white dark:bg-black">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Data Management
                </CardTitle>
              </div>
              <CardDescription className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                Manage your data and account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-11 justify-start border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100"
                onClick={() => alert("Download your data functionality coming soon!")}
              >
                <FileText className="mr-3 h-4 w-4" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">Download Data</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">Export your account data</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 justify-start border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/50 hover:border-red-300 dark:hover:border-red-800 rounded-xl text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                onClick={() => {
                  if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                    alert("Account deletion functionality coming soon!");
                  }
                }}
              >
                <Lock className="mr-3 h-4 w-4" />
                <div className="text-left">
                  <div className="text-sm font-semibold">Delete Account</div>
                  <div className="text-xs font-light opacity-75">Permanently delete your account</div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg bg-blue-50/30 dark:bg-blue-950/50 border-blue-200/50 dark:border-blue-900/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Your Privacy Matters
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
                    We are committed to protecting your privacy. Your data is encrypted and stored securely. 
                    Read our{" "}
                    <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-semibold">
                      Privacy Policy
                    </a>{" "}
                    to learn more about how we handle your data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Privacy;

