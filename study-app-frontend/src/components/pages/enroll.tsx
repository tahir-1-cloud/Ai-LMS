"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GraduationCap, BookOpen, Phone, Send } from "lucide-react";
import Swal from "sweetalert2";

import { enrollStudent } from "@/services/enrollmentService";
import { studentEnrollment } from "@/types/studentEnrollment";

export default function EnrollPage() {
  const [formData, setFormData] = useState<studentEnrollment>({
    fullName: "",
    email: "",
    phoneNumber: "",
    preferredCourse: "",
    city: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof studentEnrollment, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.preferredCourse) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all required fields before enrolling.",
      });
      return;
    }

    try {
      setLoading(true);
      await enrollStudent(formData);

      Swal.fire({
        icon: "success",
        title: "Enrollment Successful!",
        text: "Our team will contact you soon!",
        confirmButtonColor: "#2563eb",
      });

      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        preferredCourse: "",
        city: "",
        status: "",
      });
    } catch (error: unknown) {
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text: (error as Error)?.message || "Try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 sm:px-6 py-10 sm:py-16 flex items-center justify-center">

      <div className="w-full max-w-6xl">

        {/* HEADER */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#22418c]">
            Join MDCAT Preparation 🚀
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
            Enroll after your test and continue your journey with expert guidance and structured learning.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-blue-100 p-5 sm:p-10"
          >

            <h3 className="text-lg sm:text-2xl font-bold text-[#22418c] mb-6 flex items-center gap-2">
              <GraduationCap className="text-blue-600" />
              Enrollment Form
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Full Name"
                className="w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Email Address"
                className="w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <div className="flex items-center border rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                <Phone className="text-gray-500" size={18} />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  placeholder="Phone Number"
                  className="w-full ml-2 outline-none text-sm sm:text-base"
                />
              </div>

              <select
                value={formData.preferredCourse}
                onChange={(e) => handleChange("preferredCourse", e.target.value)}
                className="w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">Select Course</option>
                <option value="Medical Entry Test">Medical Entry Test</option>
                <option value="Engineering Entry Test">Engineering Entry Test</option>
                <option value="General Aptitude">General Aptitude</option>
              </select>

              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="City (Optional)"
                className="w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:scale-[1.02] transition disabled:opacity-50"
              >
                <Send size={18} />
                {loading ? "Submitting..." : "Enroll Now"}
              </button>

            </form>

            <p className="text-center text-gray-500 text-xs sm:text-sm mt-4">
              We’ll contact you shortly after enrollment.
            </p>

          </motion.div>

          {/* IMAGE SIDE */}
          <div className="hidden lg:flex justify-center">
            <div className="relative w-[420px] h-[420px] xl:w-[500px] xl:h-[500px]">
              <Image
                src="/images/Landingpage/enrolestd.jpg"
                alt="Enrollment"
                fill
                className="object-cover rounded-3xl shadow-xl border border-blue-200"
              />

              {/* floating badge */}
              <div className="absolute top-5 right-5 bg-white px-3 py-2 rounded-xl shadow text-sm flex items-center gap-2">
                <BookOpen size={16} /> 1000+ Tests
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}