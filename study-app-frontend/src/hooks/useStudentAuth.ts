
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;       // user id
  fullName: string;  
  session: string;   
  exp: number;
}

export const useStudentAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.replace("/login");
      } else {
        setUser(decoded); // save decoded user info
      }
    } catch {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }, []);

  return { user };
};
