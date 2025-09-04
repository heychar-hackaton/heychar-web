import { SessionProvider } from 'next-auth/react';
import { AppBreadcrumbs } from '@/components/nav/app-breadcrumbs';
import { AppSidebar } from '@/components/nav/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                className="mr-2 data-[orientation=vertical]:h-4"
                orientation="vertical"
              />
              <AppBreadcrumbs />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </main>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
