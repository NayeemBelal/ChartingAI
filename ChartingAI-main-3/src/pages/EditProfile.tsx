import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Helmet } from "react-helmet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import type { Role } from "@/types";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  organization: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [email] = useLocalStorage<string | null>("chartingai.email", null);
  const [role] = useLocalStorage<Role | null>("chartingai.role", null);
  
  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    organization: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("chartingai.userData");
    const storedEmail = localStorage.getItem("chartingai.email");
    
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || storedEmail ? JSON.parse(storedEmail) : "",
          phone: userData.phone || "",
          location: userData.location || "",
          organization: userData.organization || "",
        });
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    } else if (storedEmail) {
      // Create default userData from email
      const emailValue = JSON.parse(storedEmail);
      const userName = emailValue.split('@')[0];
      const nameParts = userName.split('.');
      setFormData({
        firstName: nameParts[0] || userName,
        lastName: nameParts.slice(1).join(' ') || "",
        email: emailValue,
        phone: "",
        location: "",
        organization: "",
      });
    } else if (email) {
      const userName = email.split('@')[0];
      const nameParts = userName.split('.');
      setFormData({
        firstName: nameParts[0] || userName,
        lastName: nameParts.slice(1).join(' ') || "",
        email: email,
        phone: "",
        location: "",
        organization: "",
      });
    }

    // Redirect if not authenticated
    if (!email && !storedEmail) {
      navigate("/login");
    }
  }, [email, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Save user data
    localStorage.setItem("chartingai.userData", JSON.stringify(formData));
    localStorage.setItem("chartingai.email", JSON.stringify(formData.email));
    
    // Dispatch custom event to notify ProfilePage of changes
    window.dispatchEvent(new CustomEvent('userDataUpdated'));

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate("/profile", { replace: true });
    }, 500);
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!email && !role) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Edit Profile - ChartingAI</title>
        <meta
          name="description"
          content="Edit your profile information and preferences."
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
          className="w-full max-w-2xl"
        >
          <div className="p-10 rounded-2xl bg-white dark:bg-black border border-neutral-200/50 dark:border-neutral-800/50 shadow-apple-lg">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-3">
                Edit Profile
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-400 font-light">
                Update your profile information and preferences
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
                    className="h-11 text-base border-neutral-300 dark:border-neutral-800 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600 dark:focus:ring-blue-500 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100"
                  />
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

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-11 text-base border-neutral-300 dark:border-neutral-800 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600 dark:focus:ring-blue-500 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100"
                />
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Location
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="h-11 text-base border-neutral-300 dark:border-neutral-800 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600 dark:focus:ring-blue-500 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100"
                />
              </div>

              {/* Organization Field */}
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Organization
                </Label>
                <Input
                  id="organization"
                  type="text"
                  placeholder="Healthcare Organization"
                  value={formData.organization}
                  onChange={(e) => handleInputChange("organization", e.target.value)}
                  className="h-11 text-base border-neutral-300 dark:border-neutral-800 rounded-xl focus:border-blue-600 dark:focus:border-blue-500 focus:ring-blue-600 dark:focus:ring-blue-500 bg-white dark:bg-black text-neutral-900 dark:text-neutral-100"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="flex-1 h-11 text-base font-medium border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-apple rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      Save Changes
                      <Save className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default EditProfile;

