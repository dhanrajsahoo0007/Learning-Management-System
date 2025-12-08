import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ThemeProvider } from '@/context/ThemeContext';
import { GamificationProvider } from '@/context/GamificationContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { TopTabs } from '@/components/layout/TopTabs';
import { Grid3X3, Code, Award } from 'lucide-react';

// Lazy load page components
const SystemDesign = lazy(() => import('@/pages/SystemDesign'));
const DSA = lazy(() => import('@/pages/DSA'));
const Certifications = lazy(() => import('@/pages/Certifications'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
import Home from '@/pages/Home';
import SignInPage from '@/pages/SignIn';
import SignUpPage from '@/pages/SignUp';

// Loading component
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
);

// Home component is now imported from pages/Home

const App: React.FC = () => {
  const tabs = [
    {
      id: 'system-design',
      label: 'System Design',
      path: '/system-design',
      icon: <Grid3X3 className="w-4 h-4" />
    },
    {
      id: 'ai-system-design',
      label: 'AI System Design',
      path: '/system-design/ai',
      icon: <Grid3X3 className="w-4 h-4" />
    },
    {
      id: 'dsa',
      label: 'DSA',
      path: '/dsa',
      icon: <Code className="w-4 h-4" />
    },
    {
      id: 'certifications',
      label: 'Certifications',
      path: '/certifications',
      icon: <Award className="w-4 h-4" />
    }
  ];

  return (
    <ThemeProvider>
      <GamificationProvider>
        <Routes>
            <Route
              path="/"
              element={
                <MainLayout showBottomNav={false} showTopTabs={false}>
                  <Home />
                </MainLayout>
              }
            />
            {/* Auth Routes */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            
            {/* Protected Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <MainLayout showBottomNav={true} showTopTabs={false}>
                      <Suspense fallback={<PageLoader />}>
                        <Dashboard />
                      </Suspense>
                    </MainLayout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/system-design/*"
                element={
                  <MainLayout
                    showTopTabs={true}
                    topTabs={<TopTabs tabs={tabs} />}
                  >
                    <Suspense fallback={<PageLoader />}> 
                      <SystemDesign />
                    </Suspense>
                  </MainLayout>
                }
            />
            <Route
              path="/system-design/ai/*"
                element={
                  <MainLayout
                    showTopTabs={true}
                    topTabs={<TopTabs tabs={tabs} />}
                  >
                    <Suspense fallback={<PageLoader />}> 
                      <SystemDesign />
                    </Suspense>
                  </MainLayout>
                }
            />
            <Route
              path="/dsa/*"
              element={
                <MainLayout
                  showTopTabs={true}
                  topTabs={<TopTabs tabs={tabs} />}
                >
                  <Suspense fallback={<PageLoader />}>
                    <DSA />
                  </Suspense>
                </MainLayout>
              }
            />
            <Route
              path="/certifications/*"
              element={
                <MainLayout
                  showTopTabs={true}
                  topTabs={<TopTabs tabs={tabs} />}
                >
                  <Suspense fallback={<PageLoader />}>
                    <Certifications />
                  </Suspense>
                </MainLayout>
              }
            />
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GamificationProvider>
    </ThemeProvider>
  );
};

export default App;
