"use client";

import { CubeTransparentIcon, UserGroupIcon } from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import {getTotalEnrolledStudents} from "@/services/enrollmentService";
import { getTotalStudents } from "@/services/userService";

export const EcommerceMetrics = () => {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [pendingStudents, setPendingStudents] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [total, pending] = await Promise.all([
          getTotalStudents(),
          getTotalEnrolledStudents()
        ]);

        setTotalStudents(total);
        setPendingStudents(pending);
      } catch (error) {
        console.error("Failed to load dashboard metrics", error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Total Registered Students */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <UserGroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Register Students
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "—" : totalStudents}
            </h4>
          </div>
        </div>
      </div>

      {/* Pending Registrations */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <CubeTransparentIcon className="text-gray-800 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pending Student Registrations
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "—" : pendingStudents}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Submitted via website
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
