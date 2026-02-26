import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const ADMIN_EMAIL = "bilalyasir4321@gmail.com";

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        {/* Changed text-purple-600 to text-[#D4AF37] for the Skoon Gold theme */}
        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  // Check if email matches exactly
  const isAuthorized = user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();

  if (!user || !isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}