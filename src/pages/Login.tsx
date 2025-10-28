import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, ArrowRight, ArrowLeft, User, Shield } from "lucide-react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import type { Role, UserSession } from "@/types";

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

  const handleSocialLogin = (provider: 'google' | 'twitter' | 'facebook') => {
    // For now, we'll just show an alert. In a real app, you'd integrate with OAuth providers
    alert(`${provider} login coming soon! For now, please use email login.`);
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
      
      {/* Back Navigation */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          {existingRole && existingEmail ? (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-semibold text-slate-800">Welcome Back</CardTitle>
                <CardDescription className="text-lg text-slate-600 mt-2">
                  You're signed in as a <span className="font-semibold text-blue-600">{existingRole}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleReturnToDashboard} 
                  className="w-full gap-2 h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  size="lg"
                >
                  Continue to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem("chartingai.role");
                    localStorage.removeItem("chartingai.email");
                    window.location.reload();
                  }}
                  className="w-full h-10 border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-semibold text-slate-800">Sign In</CardTitle>
                <CardDescription className="text-lg text-slate-600 mt-2">
                  Access your AI-powered medical charting tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      className={`h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${emailError ? "border-red-500" : ""}`}
                    />
                    {emailError && (
                      <p className="text-sm text-red-600">{emailError}</p>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-700">Professional Role</Label>
                    <RadioGroup value={role} onValueChange={(value) => setRole(value as Role)} className="space-y-3">
                      <div className="flex items-start space-x-3 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group">
                        <RadioGroupItem value="MOA" id="moa" className="mt-1 text-blue-600" />
                        <div className="flex-1">
                          <Label htmlFor="moa" className="font-semibold text-slate-800 cursor-pointer group-hover:text-blue-700">
                            Medical Office Assistant
                          </Label>
                          <p className="text-sm text-slate-600 mt-1">
                            Manage scheduling, patient intake, and documentation
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group">
                        <RadioGroupItem value="Physician" id="physician" className="mt-1 text-blue-600" />
                        <div className="flex-1">
                          <Label htmlFor="physician" className="font-semibold text-slate-800 cursor-pointer group-hover:text-blue-700">
                            Physician
                          </Label>
                          <p className="text-sm text-slate-600 mt-1">
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
                      className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm font-medium text-slate-700 cursor-pointer"
                    >
                      Keep me signed in
                    </Label>
                  </div>

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                    disabled={!isFormValid}
                  >
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-slate-500 font-medium">OR</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 text-base font-medium border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                      onClick={() => handleSocialLogin('google')}
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 text-base font-medium border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                      onClick={() => handleSocialLogin('twitter')}
                    >
                      <svg className="w-5 h-5 mr-3" fill="#1DA1F2" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Continue with Twitter
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 text-base font-medium border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                      onClick={() => handleSocialLogin('facebook')}
                    >
                      <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Continue with Facebook
                    </Button>
                  </div>

                  {/* Guest Option */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-slate-500 font-medium">OR</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full h-12 text-base font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                    onClick={handleGuestContinue}
                    disabled={!role}
                  >
                    Continue as Guest
                  </Button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-3">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      Create Account
                    </Link>
                  </p>
                  <p className="text-xs text-slate-500">
                    Need to switch roles?{" "}
                    <a href="/settings" className="text-blue-600 hover:text-blue-700 transition-colors">
                      Visit Settings
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Login;
