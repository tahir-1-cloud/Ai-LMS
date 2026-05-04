"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] via-white to-[#f0f9ff] flex flex-col items-center px-4 sm:px-6 py-12 md:py-20 relative overflow-hidden font-[Poppins]">

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,#1447e6_1px,transparent_0)] bg-[length:40px_40px]" />

      {/* soft blobs */}
      <div className="absolute top-10 left-0 w-60 sm:w-72 h-60 sm:h-72 bg-blue-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-60 sm:w-72 h-60 sm:h-72 bg-indigo-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 md:mb-20 z-10 max-w-4xl"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#22418c] leading-tight">
          Welcome to <span className="text-[#1447e6]">LMS</span>
        </h1>

        <p className="text-gray-600 mt-4 text-sm sm:text-base md:text-xl leading-relaxed px-2 sm:px-0">
          Your trusted partner in achieving medical education excellence.
          We empower aspiring doctors with expert guidance and structured preparation.
        </p>
          <div className="mt-4 h-1 w-16 sm:w-20 bg-gradient-to-r from-yellow-400 to-blue-800 mx-auto rounded-full" />

      </motion.div>

      {/* MISSION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl w-full bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 sm:p-8 md:p-16 z-10">

        {/* IMAGE */}
        <div className="w-full h-[220px] sm:h-[320px] md:h-[450px] relative rounded-xl overflow-hidden">
          <Image
            src="/images/Landingpage/exprtwaqasupdate1.jpg"
            alt="MDCAT students"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* TEXT */}
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#22418c] mb-4 md:mb-6">
            Our Mission
          </h2>

          <div className="space-y-3 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            <p>
              Junoon MDCAT provides structured preparation, mock tests, and smart learning tools.
            </p>
            <p>
              We help students convert pressure into confidence through disciplined preparation.
            </p>
            <p>
              Every student is guided step-by-step toward medical success with clarity and focus.
            </p>

            <p className="font-semibold text-[#1447e6] pt-2">
              We don’t just teach — we build future doctors.
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-6xl w-full mt-12 md:mt-20 z-10 px-2">

        {[
          { number: "5000+", label: "Students" },
          { number: "95%", label: "Success" },
          { number: "10K+", label: "Questions" },
          { number: "50+", label: "Tests" },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl shadow-md text-center"
          >
            <div className="text-xl sm:text-2xl md:text-4xl font-bold text-[#1447e6]">
              {s.number}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
              {s.label}
            </div>
          </div>
        ))}

      </div>

      {/* CORE VALUES */}
      <div className="max-w-7xl w-full mt-14 md:mt-24 z-10 px-2">

        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#22418c] mb-6 md:mb-10">
          Our Core Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">

          {[
            {
              title: "Excellence",
              desc: "High-quality structured learning experience for MDCAT preparation.",
              icon: "🎯",
            },
            {
              title: "Innovation",
              desc: "Smart learning system with modern tools & analytics.",
              icon: "💡",
            },
            {
              title: "Support",
              desc: "Full guidance from start to success journey.",
              icon: "🤝",
            },
          ].map((v, i) => (
            <div
              key={i}
              className="bg-white p-6 md:p-10 rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <div className="text-4xl md:text-6xl mb-3">{v.icon}</div>
              <h3 className="text-lg md:text-2xl font-bold text-[#22418c]">
                {v.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base mt-2">
                {v.desc}
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 md:mt-24 text-center z-10 px-4">

        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#22418c]">
          Start Your MDCAT Journey Today
        </h3>

        <p className="text-gray-600 mt-3 max-w-xl mx-auto text-sm md:text-base">
          Join thousands of students preparing smarter and achieving success.
        </p>

        <a
          href="https://wa.me/923075944779"
          target="_blank"
          className="inline-flex items-center gap-2 mt-6 bg-[#1447e6] text-white px-6 sm:px-10 py-3 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:scale-105 transition"
        >
          WhatsApp Contact
        </a>

      </div>

    </div>
  );
}