"use client";

import React from "react";
import {
  UserPlusIcon,
  BookOpenIcon,
  VideoCameraIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  ChartBarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const controls = [
  { title: "Register Students", icon: UserPlusIcon, color: "bg-blue-100 text-blue-700" },
  { title: "Student Papers", icon: BookOpenIcon, color: "bg-yellow-100 text-yellow-700" },
  { title: "Live Lectures", icon: VideoCameraIcon, color: "bg-sky-100 text-sky-700" },
  { title: "Recorded Lectures", icon: AcademicCapIcon, color: "bg-indigo-100 text-indigo-700" },
  { title: "Mock Tests", icon: ClipboardDocumentCheckIcon, color: "bg-blue-100 text-blue-700" },
  { title: "Test Results", icon: ChartBarIcon, color: "bg-sky-100 text-sky-700" },
  { title: "Sessions", icon: AcademicCapIcon, color: "bg-yellow-100 text-yellow-700" },
  { title: "Public Lectures", icon: GlobeAltIcon, color: "bg-indigo-100 text-indigo-700" },
];

export default function AdminControlPanel() {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90">
          Admin Control Panel
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Junoon MDCAT – Administrative Access
        </p>
      </div>

      {/* Grid */}
      <div
        className="
          grid gap-8
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {controls.map((item, index) => (
          <div
            key={index}
            className="
              flex flex-col items-center justify-center
              h-48
              rounded-2xl
              border border-gray-200
              bg-white
              px-8
              text-center
              transition-all
              hover:-translate-y-0.5
              hover:shadow-lg
              hover:border-blue-300
              dark:border-gray-800
              dark:bg-gray-900/40
            "
          >
            <div
              className={`mb-5 flex h-16 w-16 items-center justify-center rounded-xl ${item.color}`}
            >
              <item.icon className="h-8 w-8" />
            </div>

            <h3 className="
              max-w-[160px]
              text-base
              font-semibold
              leading-snug
              text-gray-800
              dark:text-white/90
            ">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
