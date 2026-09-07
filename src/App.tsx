import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RouterProvider, useRoute } from '@/lib/router';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { HomePage } from '@/pages/HomePage';
import { AssessmentPage } from '@/pages/AssessmentPage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { ComparisonPage } from '@/pages/ComparisonPage';
import { ExplainPage } from '@/pages/ExplainPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { AuthPage } from '@/pages/AuthPage';
import { AboutPage } from '@/pages/AboutPage';

function AppRoutes() {
  const route = useRoute();
  const { loading } = useAuth();

  const renderPage = () => {
    // Public pages
    if (route === '/' || route === '') return <HomePage />;
    if (route === '/about') return <AboutPage />;
    if (route === '/login') return <AuthPage />;
    if (route === '/assessment') return <AssessmentPage />;
    if (route === '/analysis') return <AnalysisPage />;
    if (route === '/results') return <ResultsPage />;
    if (route === '/comparison') return <ComparisonPage />;
    if (route === '/explain') return <ExplainPage />;

    // Protected pages
    if (route === '/history') {
      return (
        <ProtectedRoute loading={loading}>
          <HistoryPage />
        </ProtectedRoute>
      );
    }

    return <HomePage />;
  };

  const isAuthPage = route === '/login';
  const isAnalysisPage = route === '/analysis';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        {renderPage()}
      </main>
      {!isAuthPage && !isAnalysisPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <AppRoutes />
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
