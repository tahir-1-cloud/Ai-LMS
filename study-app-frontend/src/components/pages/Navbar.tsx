"use client"

import Link from "next/link"
import { useState } from "react"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 text-white shadow-lg sticky top-0 z-50">
      
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

        {/* BRAND / LOGO */}
       <Link href="/" className="flex items-center hover:opacity-90 transition">

        <div className="flex flex-col leading-tight">

          {/* Main Title (always visible) */}
          <span className="text-lg font-bold tracking-wide text-white">
            LMS
          </span>

          {/* Subtitle (desktop only, properly below LMS) */}
          <span className="hidden sm:block text-xs text-blue-200 mt-0.5">
            Learning Management System
          </span>

        </div>

        </Link>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-3xl font-bold"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* NAV LINKS */}
        <ul
          className={`
            md:flex md:items-center md:space-x-8
            absolute md:static left-0 top-16 md:top-auto
            w-full md:w-auto
            bg-blue-900 md:bg-transparent
            transition-all duration-300 ease-in-out
            ${menuOpen ? "block" : "hidden md:flex"}
          `}
        >
          {["Home", "Courses", "About", "Contact", "Blog"].map((item) => (
            <li
              key={item}
              className="border-b border-blue-800 md:border-none"
            >
              <Link
                href={
                  item.toLowerCase() === "home"
                    ? "/"
                    : item.toLowerCase() === "courses"
                    ? "/courses"
                    : item.toLowerCase() === "about"
                    ? "/about"
                    : item.toLowerCase() === "contact"
                    ? "/contact"
                    : item.toLowerCase() === "blog"
                    ? "/blog"
                    : `/${item.toLowerCase()}`
                }
                className="block px-6 py-3 md:p-0 font-medium hover:text-yellow-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            </li>
          ))}

          {/* LOGIN BUTTON */}
          <li className="px-6 py-4 md:p-0">
            <Link
              href="/login"
              className="inline-block bg-yellow-400 text-blue-900 px-5 py-2 rounded-full font-semibold hover:bg-yellow-300 transition shadow-md"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </li>
        </ul>

      </div>
    </nav>
  )
}

export default Navbar