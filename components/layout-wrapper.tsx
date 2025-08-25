'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MobileHeader } from '@/components/dashboard/mobile-header';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import Widget from '@/components/dashboard/widget';
import Notifications from '@/components/dashboard/notifications';
import { MobileChat } from '@/components/chat/mobile-chat';
import Chat from '@/components/chat';
import AIChatbot from '@/components/dashboard/ai-chatbot';
import mockDataJson from '@/mock.json';
import type { MockData } from '@/types/dashboard';

const mockData = mockDataJson as MockData;

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const isAuthPage = pathname?.startsWith('/auth');
  
  // Define valid routes that should show the dashboard layout
  const validRoutes = [
    '/',
    '/analytics',
    '/bots',
    '/defi',
    '/exchanges',
    '/portfolio',
    '/settings'
  ];
  
  const isValidRoute = pathname && validRoutes.includes(pathname);
  const isPublicPage = isAuthPage || !isValidRoute || !user || loading;

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      {/* Mobile Header - only visible on mobile */}
      <MobileHeader mockData={mockData} />

      {/* Desktop Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-gap lg:px-sides">
        <div className="hidden lg:block col-span-2 top-0 relative">
          <DashboardSidebar />
        </div>
        <div className="col-span-1 lg:col-span-7">{children}</div>
        <div className="col-span-3 hidden lg:block">
          <div className="space-y-gap py-sides min-h-screen max-h-screen sticky top-0 overflow-clip">
            <Widget widgetData={mockData.widgetData} />
            <AIChatbot />
            <Notifications initialNotifications={mockData.notifications} />
            <Chat />
          </div>
        </div>
      </div>

      {/* Mobile Chat - floating CTA with drawer */}
      <MobileChat />
    </SidebarProvider>
  );
} 