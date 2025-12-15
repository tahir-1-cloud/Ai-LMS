"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAdminAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    // Hardcoded admin check
    if (!(username === "admin" && password === "12345")) {
      router.replace("/login");
    }
  }, []);
};
