import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ThemeProvider } from '@/context/ThemeContext';
import { GamificationProvider } from '@/context/GamificationContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { TopTabs } from '@/components/layout/TopTabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Grid3X3, Code, Award } from 'lucide-react';
import { isFeatureEnabled } from '@/config/features';

const SystemDesign = lazy(() => import('@/pages/SystemDesign'));
const DSA = lazy(() => import('@/pages/DSA'));
const Certifications = lazy(() => import('@/pages/Certifications'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
import Home from '@/pages/Home';
import SignInPage from '@/pages/SignIn';
import SignUpPage from '@/pages/SignUp';

const PageLoader: React.FC = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <Skeleton className="h-10 w-10 rounded-full" />
  </div>
);

const App: React.FC = () => {
  const allTabs = [
    {
      id: 'system-design',
      label: 'System Design',
      path: '/system-design',
      icon: <Grid3X3 className="w-4 h-4" />,
    },
    {
      id: 'ai-system-design',
      label: 'AI System Design',
      path: '/system-design/ai',
      icon: <Grid3X3 className="w-4 h-4" />,
    },
    {
      id: 'dsa',
      label: 'DSA',
      path: '/dsa',
      icon: <Code className="w-4 h-4" />,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      path: '/certifications',
      icon: <Award className="w-4 h-4" />,
    },
  ];

  const tabs = allTabs.filter((tab) => {
    if (tab.id === 'dsa') return isFeatureEnabled('dsa');
    if (tab.id === 'certifications') return isFeatureEnabled('certifications');
    if (tab.id === 'system-design') return isFeatureEnabled('systemDesign');
    if (tab.id === 'ai-system-design') return isFeatureEnabled('aiSystemDesign');
    return true;
  });

  return (
    <ThemeProvider>
      <GamificationProvider>
        <TooltipProvider>
        <Routes>
            <Route
              path="/"
              element={
                <MainLayout showBottomNav={false} showTopTabs={false}>
                  <Home />
                </MainLayout>
              }
            />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />

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
                  <MainLayout showTopTabs={false} showBottomNav={false}>
                    <Suspense fallback={<PageLoader />}>
                      <SystemDesign />
                    </Suspense>
                  </MainLayout>
                }
            />
            {isFeatureEnabled('dsa') ? (
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
            ) : (
              <Route path="/dsa/*" element={<Navigate to="/" replace />} />
            )}
            {isFeatureEnabled('certifications') ? (
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
            ) : (
              <Route path="/certifications/*" element={<Navigate to="/" replace />} />
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </TooltipProvider>
      </GamificationProvider>
    </ThemeProvider>
  );
};

export default App;
