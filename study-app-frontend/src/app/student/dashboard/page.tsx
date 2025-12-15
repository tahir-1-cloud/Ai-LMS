"use client";
import React from "react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import WelcomeStudentMetaCard from "@/components/user-profile/WelcomeStudentMetaCard";



export default function StudentDashboard() {
     const { user } = useStudentAuth();
     console.log(user);
     if (!user) return null; // or a loader
    return (
        <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Welcome Back : <span className="text-blue-600 font-bold">{user.fullName}</span>
                 </h3>

                <div className="space-y-6">
                    <WelcomeStudentMetaCard />
                </div>
            </div>
        </div>
    );
}
