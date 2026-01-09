"use client";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/student/AppHeader";
import AppSidebar from "@/layout/student/AppSidebar";
import Backdrop from "@/layout/student/Backdrop";
import React, { useEffect } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthGuard from "@/components/AuthGuard";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();


   // Set favicon and title dynamically
    useEffect(() => {
        // Set favicon
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = '/favicon.ico';
        document.getElementsByTagName('head')[0].appendChild(link);

        // Set title
        document.title = 'Admin Dashboard';
    }, []);

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <ThemeProvider>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </ThemeProvider>
      </SidebarProvider>
    </AuthGuard>
  );
}
