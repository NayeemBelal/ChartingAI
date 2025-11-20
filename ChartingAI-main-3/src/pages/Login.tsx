import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import type { Role } from "@/types";

const Login = () => {
  const navigate = useNavigate();
  const [existingRole] = useLocalStorage<Role | null>("chartingai.role", null);
  const [existingEmail] = useLocalStorage<string | null>("chartingai.email", null);
  
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !role) return;

    localStorage.setItem("chartingai.email", JSON.stringify(email));
    localStorage.setItem("chartingai.role", JSON.stringify(role));
    if (rememberMe) {
      localStorage.setItem("chartingai.rememberMe", JSON.stringify(true));
    }

    // Update or create userData based on email
    const existingUserData = localStorage.getItem("chartingai.userData");
    let shouldCreateNew = false;
    
    if (existingUserData) {
      try {
        const userData = JSON.parse(existingUserData);
        // If email doesn't exist or email changed, create new userData for new user
        if (!userData.email || userData.email !== email) {
          shouldCreateNew = true;
        } else {
          // Email matches, update email to be safe
          userData.email = email;
          localStorage.setItem("chartingai.userData", JSON.stringify(userData));
        }
      } catch (e) {
        // If parsing fails, create new userData
        shouldCreateNew = true;
      }
    } else {
      // No userData exists, create new
      shouldCreateNew = true;
    }
    
    if (shouldCreateNew) {
      // Create new userData from email
      const userName = email.split('@')[0];
      // Remove dots and split, capitalize first letter of each part
      const nameParts = userName.split('.');
      const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : userName.charAt(0).toUpperCase() + userName.slice(1);
      const lastName = nameParts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
      const newUserData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: '',
        location: '',
        organization: ''
      };
      localStorage.setItem("chartingai.userData", JSON.stringify(newUserData));
    }
    
    navigate("/marketplace-new");
  };

  const handleGuestContinue = () => {
    if (!role) return;
    
    localStorage.setItem("chartingai.role", JSON.stringify(role));
    navigate("/marketplace-new");
  };

  const handleReturnToDashboard = () => {
    navigate("/marketplace-new");
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'twitter') => {
    // In a real app, you'd integrate with OAuth providers
    if (!role) {
      alert(`Please select your role first, then try ${provider} login.`);
      return;
    }

    // For demo purposes, create a mock user from provider
    const mockEmail = `user@${provider}.com`;
    localStorage.setItem("chartingai.email", JSON.stringify(mockEmail));
    localStorage.setItem("chartingai.role", JSON.stringify(role));
    
    // Create userData from provider
    const providerNames: Record<string, { firstName: string; lastName: string }> = {
      google: { firstName: "Google", lastName: "User" },
      apple: { firstName: "Apple", lastName: "User" },
      twitter: { firstName: "Twitter", lastName: "User" }
    };
    
    const userData = {
      firstName: providerNames[provider].firstName,
      lastName: providerNames[provider].lastName,
      email: mockEmail,
      phone: '',
      location: '',
      organization: ''
    };
    localStorage.setItem("chartingai.userData", JSON.stringify(userData));
    
    navigate("/marketplace-new");
  };

  const isFormValid = email && isValidEmail(email) && role;

  return (
    <>
      <Helmet>
        <title>Sign In - ChartingAI</title>
        <meta
          name="description"
          content="Sign in to ChartingAI and access your AI-powered medical charting tools."
        />
      </Helmet>
      
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
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
          className="w-full max-w-md"
        >
          {existingRole && existingEmail ? (
            /* Welcome Back Card */
            <div className="p-8 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200/50 dark:border-blue-900/50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                    {(existingEmail as string).charAt(0).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-base text-neutral-600 dark:text-neutral-400 font-light">
                  You're signed in as a{" "}
                  <span className="font-medium text-neutral-900 dark:text-white">{existingRole}</span>
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleReturnToDashboard} 
                  className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-apple rounded-xl transition-all"
                >
                  Continue to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem("chartingai.role");
                    localStorage.removeItem("chartingai.email");
                    window.location.reload();
                  }}
                  className="w-full h-11 text-base font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <div className="p-10 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg">
              {/* Header */}
              <div className="text-center mb-10">
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-3">
                  Sign In
                </h1>
                <p className="text-base text-neutral-600 dark:text-neutral-400 font-light">
                  Access your AI-powered medical charting tools
                </p>
              </div>

              {/* Social Sign-In Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full h-11 text-base font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 rounded-xl transition-all flex items-center justify-center gap-3 text-neutral-900 dark:text-neutral-100"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('apple')}
                  className="w-full h-11 text-base font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 rounded-xl transition-all flex items-center justify-center gap-3 text-neutral-900 dark:text-neutral-100"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Continue with Apple
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('twitter')}
                  className="w-full h-11 text-base font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 rounded-xl transition-all flex items-center justify-center gap-3 text-neutral-900 dark:text-neutral-100"
                >
                  <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Continue with Twitter
                </Button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-black px-4 text-neutral-500 dark:text-neutral-400 font-light">OR</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    className={`h-11 text-base border-neutral-300 dark:border-neutral-800 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600 dark:focus:ring-blue-500 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 ${
                      emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {emailError && (
                    <p className="text-sm text-red-600 dark:text-red-400 font-light">{emailError}</p>
                  )}
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Professional Role
                  </Label>
                  <RadioGroup 
                    value={role} 
                    onValueChange={(value) => setRole(value as Role)} 
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 transition-all cursor-pointer group">
                      <RadioGroupItem value="MOA" id="moa" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="moa" className="text-base font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer group-hover:text-blue-700 dark:group-hover:text-blue-400">
                          Medical Office Assistant
                        </Label>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-light">
                          Manage scheduling, patient intake, and documentation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 transition-all cursor-pointer group">
                      <RadioGroupItem value="Physician" id="physician" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="physician" className="text-base font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer group-hover:text-blue-700 dark:group-hover:text-blue-400">
                          Physician
                        </Label>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-light">
                          Access clinical tools, charting, and patient care features
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-neutral-300 dark:border-neutral-800 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer"
                  >
                    Keep me signed in
                  </Label>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-apple rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFormValid}
                >
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 text-center space-y-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Login;
