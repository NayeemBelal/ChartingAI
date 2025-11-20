import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import type { Role } from "@/types";

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as Role | "",
    agreeToTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Please select your role";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    localStorage.setItem("chartingai.email", JSON.stringify(formData.email));
    localStorage.setItem("chartingai.role", JSON.stringify(formData.role));
    localStorage.setItem("chartingai.userData", JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    }));
    
    navigate("/marketplace-new");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const isFormValid = 
    formData.firstName.trim() && 
    formData.lastName.trim() && 
    formData.email && 
    isValidEmail(formData.email) && 
    formData.password && 
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword &&
    formData.role &&
    formData.agreeToTerms;

  return (
    <>
      <Helmet>
        <title>Create Account - ChartingAI</title>
        <meta
          name="description"
          content="Create your ChartingAI account and access AI-powered medical charting tools."
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
          className="w-full max-w-lg"
        >
          <div className="p-10 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-3">
                Create Account
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-400 font-light">
                Join ChartingAI and transform your medical charting workflow
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={`h-11 text-base border-neutral-300 dark:border-neutral-800 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600 dark:focus:ring-blue-500 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 ${
                      errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600 dark:text-red-400 font-light">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={`h-11 text-base border-neutral-300 dark:border-neutral-800 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600 dark:focus:ring-blue-500 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 ${
                      errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600 dark:text-red-400 font-light">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`h-11 text-base border-neutral-300 dark:border-neutral-800 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600 dark:focus:ring-blue-500 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 ${
                    errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 font-light">{errors.email}</p>
                )}
              </div>

              {/* Password Fields */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`h-11 text-base border-neutral-300 dark:border-neutral-800 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600 dark:focus:ring-blue-500 pr-12 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 ${
                      errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-neutral-500 dark:text-neutral-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400 font-light">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`h-11 text-base border-neutral-300 dark:border-neutral-800 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600 dark:focus:ring-blue-500 pr-12 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 ${
                      errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-neutral-500 dark:text-neutral-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400 font-light">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Professional Role
                </Label>
                <RadioGroup 
                  value={formData.role} 
                  onValueChange={(value) => handleInputChange("role", value)}
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
                {errors.role && (
                  <p className="text-sm text-red-600 dark:text-red-400 font-light">{errors.role}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    className="mt-0.5 border-neutral-300 dark:border-neutral-800 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer leading-relaxed"
                  >
                    I agree to the{" "}
                    <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-semibold">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-semibold">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600 dark:text-red-400 font-light">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-apple rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid}
              >
                Create Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;
