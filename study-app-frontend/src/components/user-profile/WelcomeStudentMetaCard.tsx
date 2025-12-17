"use client";

import React from "react";
import Image from "next/image";
import { JwtPayload } from "@/hooks/useStudentAuth";

interface WelcomeStudentMetaCardProps {
  user: JwtPayload;
}

export default function WelcomeStudentMetaCard({ user }: WelcomeStudentMetaCardProps) {
  return (
    <div className="p-8 rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm font-[Poppins]">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

        {/* Left: Content */}
        <div className="w-full lg:w-2/3 text-center lg:text-left">
          <h1 className="text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Welcome to{" "}
            <span className="text-blue-600">JUNOON MDCAT</span>
          </h1>

          <p className="mt-4 text-lg font-medium text-black dark:text-gray-200">
            Hello,{" "}
            <span className="font-semibold text-blue-600">
              {user.fullName}
            </span>
          </p>

          <p className="mt-4 text-base text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
            This is your dedicated learning dashboard designed for focused and
            effective <strong className="text-black dark:text-white">MDCAT Entry Test</strong>{" "}
            preparation. Track your progress, improve weak areas, and stay
            consistent on your journey toward medical admission.
          </p>

          {/* Student Info */}
          <div className="mt-6 space-y-2 text-base">
            <p className="text-black dark:text-gray-200">
              <span className="font-semibold text-blue-600">
                Session:
              </span>{" "}
              {user.session}
            </p>

            <p className="text-black dark:text-gray-200">
              <span className="font-semibold text-blue-600">
                Registered Email:
              </span>{" "}
              {user.emailaddress}
            </p>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
          <Image
            src="/images/Landingpage/stdboard1.jpg"
            alt="Junoon MDCAT Student Dashboard"
            width={320}
            height={240}
            className="object-contain"
            priority
          />
        </div>

      </div>
    </div>
  );
}
