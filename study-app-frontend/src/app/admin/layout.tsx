"use client";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/admin/AppHeader";
import AppSidebar from "@/layout/admin/AppSidebar";
import Backdrop from "@/layout/admin/Backdrop";
import React, { useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    useAdminAuth();
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
        <div className="min-h-screen xl:flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
            <AdminLayoutContent>{children}</AdminLayoutContent>
    );
}