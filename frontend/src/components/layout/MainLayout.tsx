import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { SearchBar } from '@/components/shared/SearchBar';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { isFeatureEnabled } from '@/config/features';

interface MainLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  showTopTabs?: boolean;
  topTabs?: ReactNode;
}

export function MainLayout({
  children,
  showBottomNav = true,
  showTopTabs = false,
  topTabs,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              SD
            </span>
            <span className="hidden text-sm font-semibold sm:inline">System Design Hub</span>
          </Link>

          {showTopTabs && <div className="hidden flex-1 justify-center md:flex">{topTabs}</div>}
          {!showTopTabs && <div className="flex-1" />}

          <div className="flex items-center gap-2">
            <SearchBar />
            <ThemeToggle />
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
        {showTopTabs && (
          <div className="border-t px-4 py-2 md:hidden">
            {topTabs}
          </div>
        )}
      </header>

      <main id="main-content" className={cn(showBottomNav && 'pb-20 md:pb-0')}>
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
}

function BottomNav() {
  const navItems = [
    { id: 'home', label: 'Home', path: '/', show: true },
    { id: 'fundamentals', label: 'Fundamentals', path: '/system-design/fundamentals', show: isFeatureEnabled('systemDesign') },
    { id: 'problems', label: 'Problems', path: '/system-design/problems', show: isFeatureEnabled('systemDesign') },
    { id: 'ai-fundamentals', label: 'AI Fundamentals', path: '/system-design/ai/ml-system-design', show: isFeatureEnabled('aiSystemDesign') },
    { id: 'ai-ml', label: 'AI / ML', path: '/ai-ml/learning-paths', show: isFeatureEnabled('aiMl') },
    { id: 'dsa', label: 'DSA', path: '/dsa', show: isFeatureEnabled('dsa') },
    { id: 'certifications', label: 'Certifications', path: '/certifications', show: isFeatureEnabled('certifications') },
  ].filter((item) => item.show);

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background md:hidden"
      aria-label="Main navigation"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.path}
            className="rounded-md px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
