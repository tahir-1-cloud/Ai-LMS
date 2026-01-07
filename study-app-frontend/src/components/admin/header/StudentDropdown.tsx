"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { useStudentAuth } from "@/hooks/useStudentAuth";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useStudentAuth();
  const router = useRouter();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleLogout() {
    // 🔥 Student logout — remove auth only
    localStorage.removeItem("token");
    localStorage.removeItem("__sa"); // safety
    localStorage.removeItem("username");
    localStorage.removeItem("password");

    router.replace("/login");
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            width={44}
            height={44}
            src="/images/user/user-01.jpg"
            alt="User"
          />
        </span>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] w-[260px] rounded-2xl border bg-white p-3 shadow-theme-lg"
      >
        <div>
          <span className="block font-medium text-theme-sm">
            {user?.fullName}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-3 px-3 py-2 text-theme-sm rounded-lg hover:bg-gray-100"
        >
          ⏻ Sign out
        </button>
      </Dropdown>
    </div>
  );
}
