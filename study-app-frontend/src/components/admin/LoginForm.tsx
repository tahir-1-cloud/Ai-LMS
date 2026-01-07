"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { loginStudent } from "@/services/userService";
import axios from "axios";
import { toast } from "sonner";

export default function LoginInForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 🔐 ADMIN LOGIN
      if (username === "admin" && password === "12345") {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);

        // 🔥 opaque admin marker
        localStorage.setItem("__sa", "a9f3e7c1b2");

        router.replace("/admin/dashboard");
        return;
      }

      // 👨‍🎓 STUDENT LOGIN
      await loginStudent({ userName: username, password });

      // ensure admin marker is removed
      localStorage.removeItem("__sa");

      router.replace("/student/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data || err.message || "Login failed";
        toast.error(typeof message === "string" ? message : "Login failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center relative z-10">
      <div className="w-full max-w-md px-8">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Email</Label>
              <Input
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeIcon className="w-5" /> : <EyeSlashIcon className="w-5" />}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="text-sm">Keep me logged in</span>
            </div>

            <Button className="w-full">Login</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
