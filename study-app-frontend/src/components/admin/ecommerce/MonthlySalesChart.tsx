"use client";

import React from "react";
import { UserCircleIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

export default function AdminDashboardHeader() {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Top Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left: App Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <AcademicCapIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
              Junoon MDCAT
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Medical & Dental College Admission Test Portal
            </p>
          </div>
        </div>

        {/* Right: Admin Info */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/40">
          <UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Doctor Waqas
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-gray-200 dark:bg-gray-800"></div>

      {/* Info Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            System Status
          </p>
          <p className="mt-1 font-semibold text-green-600">
            Operational
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Academic Session
          </p>
          <p className="mt-1 font-semibold text-gray-800 dark:text-white/90">
            2025 – 2026
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Platform Type
          </p>
          <p className="mt-1 font-semibold text-gray-800 dark:text-white/90">
            Admin Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
