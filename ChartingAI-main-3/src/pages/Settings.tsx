import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Shield, Lock, Moon, Sun, Monitor, Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "sonner";
import type { Role } from "@/types";

const Settings = () => {
  const navigate = useNavigate();
  const [email] = useLocalStorage<string | null>("chartingai.email", null);
  const [role] = useLocalStorage<Role | null>("chartingai.role", null);
  const themeContext = useTheme();

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    analytics: true,
  });

  // Change Password Dialog State
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [hasExistingPassword, setHasExistingPassword] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedNotifications = localStorage.getItem("chartingai.settings.notifications");
    const savedPrivacy = localStorage.getItem("chartingai.settings.privacy");

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error("Error parsing notifications:", e);
      }
    }

    if (savedPrivacy) {
      try {
        setPrivacy(JSON.parse(savedPrivacy));
      } catch (e) {
        console.error("Error parsing privacy:", e);
      }
    }

    // Check if user has an existing password
    const storedPassword = localStorage.getItem("chartingai.password");
    setHasExistingPassword(!!storedPassword);

    // Redirect if not authenticated
    if (!email && !role) {
      navigate("/login");
    }
  }, [email, role, navigate]);

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    localStorage.setItem("chartingai.settings.notifications", JSON.stringify(updated));
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: boolean) => {
    const updated = { ...privacy, [key]: value };
    setPrivacy(updated);
    localStorage.setItem("chartingai.settings.privacy", JSON.stringify(updated));
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    themeContext.setTheme(newTheme);
  };

  // Password Change Functions
  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};

    // Only require current password if user has an existing password
    if (hasExistingPassword && !passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Only check if new password is different from current if user has existing password
    if (hasExistingPassword && passwordForm.currentPassword && passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsChangingPassword(true);

    try {
      // In a real app, you would call your backend API here
      // For now, we'll simulate an API call and store in localStorage
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store the new password (in a real app, this would be handled by the backend)
      const storedPassword = localStorage.getItem("chartingai.password");
      
      // Verify current password matches only if user has an existing password
      if (storedPassword) {
        if (!passwordForm.currentPassword || storedPassword !== passwordForm.currentPassword) {
          setPasswordErrors({ currentPassword: "Current password is incorrect" });
          setIsChangingPassword(false);
          return;
        }
      }

      // Save new password
      const wasFirstTime = !hasExistingPassword;
      localStorage.setItem("chartingai.password", passwordForm.newPassword);
      
      // Update state to reflect that user now has a password
      setHasExistingPassword(true);

      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setIsPasswordDialogOpen(false);

      toast.success(wasFirstTime ? "Password set successfully!" : "Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordInputChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const openPasswordDialog = () => {
    setIsPasswordDialogOpen(true);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
  };

  if (!email && !role) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Account Settings - ChartingAI</title>
        <meta
          name="description"
          content="Manage your account settings and preferences."
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
              Account Settings
            </h1>
            <p className="text-base text-neutral-600 dark:text-neutral-400 font-light">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Notifications */}
          <Card className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg bg-white dark:bg-black">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Notifications
                </CardTitle>
              </div>
              <CardDescription className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="text-sm font-medium text-neutral-900 dark:text-white">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                />
              </div>
              <Separator className="dark:bg-neutral-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications" className="text-sm font-medium text-neutral-900 dark:text-white">
                    Push Notifications
                  </Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                />
              </div>
              <Separator className="dark:bg-neutral-800" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications" className="text-sm font-medium text-neutral-900 dark:text-white">
                    SMS Notifications
                  </Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg bg-white dark:bg-black">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Privacy
                </CardTitle>
              </div>
              <CardDescription className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                Control your privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profile-visible" className="text-sm font-medium text-neutral-900 dark:text-white">
                    Profile Visible
                  </Label>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    Make your profile visible to others
                  </p>
                </div>
                <Switch
                  id="profile-visible"
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => handlePrivacyChange("profileVisible", checked)}
                />
              </div>
              <Separator className="dark:bg-neutral-800" />
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
                  checked={privacy.analytics}
                  onCheckedChange={(checked) => handlePrivacyChange("analytics", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg bg-white dark:bg-black">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Appearance
                </CardTitle>
              </div>
              <CardDescription className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                Choose your preferred theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant={themeContext.theme === "light" ? "default" : "outline"}
                  onClick={() => handleThemeChange("light")}
                  className="h-20 flex flex-col items-center justify-center gap-2 rounded-xl border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-sm font-medium">Light</span>
                </Button>
                <Button
                  type="button"
                  variant={themeContext.theme === "dark" ? "default" : "outline"}
                  onClick={() => handleThemeChange("dark")}
                  className="h-20 flex flex-col items-center justify-center gap-2 rounded-xl border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-sm font-medium">Dark</span>
                </Button>
                <Button
                  type="button"
                  variant={themeContext.theme === "system" ? "default" : "outline"}
                  onClick={() => handleThemeChange("system")}
                  className="h-20 flex flex-col items-center justify-center gap-2 rounded-xl border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-sm font-medium">System</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg bg-white dark:bg-black">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Security
                </CardTitle>
              </div>
              <CardDescription className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-11 justify-start border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100"
                onClick={openPasswordDialog}
              >
                <Lock className="mr-3 h-4 w-4" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">Change Password</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">Update your password</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 justify-start border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100"
                onClick={() => alert("Two-factor authentication coming soon!")}
              >
                <Shield className="mr-3 h-4 w-4" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">Two-Factor Authentication</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 font-light">Add an extra layer of security</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-neutral-900 dark:text-white">
              {hasExistingPassword ? "Change Password" : "Set Password"}
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
              {hasExistingPassword 
                ? "Enter your current password and choose a new one"
                : "Set a password for your account"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password - Only show if user has an existing password */}
            {hasExistingPassword && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-neutral-900 dark:text-white">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
                    className={`pr-10 dark:bg-black dark:text-white dark:border-neutral-800 ${
                      passwordErrors.currentPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    placeholder="Enter your current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-neutral-500 dark:text-neutral-400"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400 font-light">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium text-neutral-900 dark:text-white">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
                  className={`pr-10 dark:bg-black dark:text-white dark:border-neutral-800 ${
                    passwordErrors.newPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="Enter your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-neutral-500 dark:text-neutral-400"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-600 dark:text-red-400 font-light">
                  {passwordErrors.newPassword}
                </p>
              )}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-900 dark:text-white">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
                  className={`pr-10 dark:bg-black dark:text-white dark:border-neutral-800 ${
                    passwordErrors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="Confirm your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-neutral-500 dark:text-neutral-400"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400 font-light">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
                className="border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                disabled={isChangingPassword}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isChangingPassword}
              >
                {isChangingPassword 
                  ? (hasExistingPassword ? "Changing..." : "Setting...") 
                  : (hasExistingPassword ? "Change Password" : "Set Password")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Settings;

