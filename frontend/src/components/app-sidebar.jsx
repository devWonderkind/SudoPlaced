'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  LayoutDashboard,
  Briefcase,
  FileText,
  GraduationCap,
  Settings2,
  Terminal,
  Search,
  CheckCircle2,
  StickyNote,
  Bell,
  Contact

} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { IconTarget } from '@tabler/icons-react';

// navigation data
const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Applications',
      url: '/dashboard/applications',
      icon: Briefcase,
      isActive: false,
      // items: [
      //   { title: 'Active', url: '#' },
      //   { title: 'Offers', url: '#' },
      //   { title: 'Archived', url: '#' },
      // ],
    },
    {
      title: 'Interview Schedule',
      url: '/dashboard/interview-schedule',
      icon: BookOpen,
      // items: [
      //   { title: 'Resume Templates', url: '#' },
      //   { title: 'Interview Prep', url: '#' },
      //   { title: 'DSA Roadmap', url: '#' },
      // ],
    },
    {
      title: 'Keynotes',
      url: '/dashboard/keynotes',
      icon: StickyNote,

    },
    // {
    //   title: 'HR Contacts',
    //   url: '#',
    //   icon: Contact,
    // }

  ],
  quickAccess: [
    {
      name: 'Notifications',
      url: '/dashboard/notifications',
      icon: Bell,
    },
    {
      name: 'Contacts',
      url: '/dashboard/directory',
      icon: Contact,
    },
    {
      name: 'Notifications',
      url: '/dashboard/notifications',
      icon: Bell,
    },
    {
      name: 'Settings',
      url: '/dashboard/profile',
      icon: Settings2,
    },
    // {
    //   name: 'Resume Builder',
    //   url: '#',
    //   icon: FileText,
    // },
    // {
    //   name: 'Job Search',
    //   url: '#',
    //   icon: Search,
    // },
    // {
    //   name: 'Certifications',
    //   url: '#',
    //   icon: GraduationCap,
    // },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {/* Sudo Placed Icon Logo */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-600 sm:h-8 sm:w-8">
                    <IconTarget className="h-5 w-5 text-white sm:h-6 sm:w-6" stroke={2.5} />
                  </div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="text-foreground truncate text-lg font-bold tracking-tight">
                    sudoplaced
                  </span>
                  {/* <span className="text-muted-foreground truncate text-xs">Placement Tracker</span> */}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.quickAccess} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
