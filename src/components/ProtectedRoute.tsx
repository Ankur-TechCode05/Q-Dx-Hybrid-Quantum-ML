import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { navigate } from '@/lib/router';

export function ProtectedRoute({ children, loading }: { children: ReactNode; loading: boolean }) {
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return <>{children}</>;
}
