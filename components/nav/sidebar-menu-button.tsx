'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenuButton as UISidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

type Props = {
  url: string;
  tooltip?: string;
  children: React.ReactNode;
};

export function SidebarMenuButton({ url, tooltip, children }: Props) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const sidebar = useSidebar();

  return (
    <UISidebarMenuButton asChild isActive={pathname === url} tooltip={tooltip}>
      <Link href={url} onClick={() => isMobile && sidebar.toggleSidebar()}>
        {children}
      </Link>
    </UISidebarMenuButton>
  );
}
