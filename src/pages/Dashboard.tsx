import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import type { Role } from "@/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role] = useLocalStorage<Role | null>("chartingai.role", null);
  const [email] = useLocalStorage<string | null>("chartingai.email", null);

  useEffect(() => {
    if (!role) {
      navigate("/login");
    }
  }, [role, navigate]);

  if (!role) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Dashboard</h1>
        <p className="text-xl text-muted-foreground mb-2">
          Role: <strong>{role}</strong>
        </p>
        {email && (
          <p className="text-muted-foreground mb-8">
            Logged in as: {email}
          </p>
        )}
        <p className="text-muted-foreground">
          Dashboard content coming soon...
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
