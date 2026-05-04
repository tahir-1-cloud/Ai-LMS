import Link from "next/link"
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-950 via-blue-900 to-indigo-950 text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center sm:text-left">

          {/* Brand / About */}
          <div>
            <Link
              href="/"
              className="inline-block mb-3 hover:opacity-90 transition"
            >
              <div className="flex flex-col leading-tight">
                
                <span className="text-xl font-bold tracking-wide">
                  LMS
                </span>

                <span className="text-xs text-blue-200 mt-0.5">
                  Learning Management System
                </span>

              </div>
            </Link>

            <p className="text-sm text-blue-100 leading-relaxed max-w-sm mx-auto sm:mx-0">
              Your trusted platform for smart learning, expert guidance,
              mock tests, live classes, and academic success.
            </p>
          </div>


          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-300 mb-3">
              Quick Links
            </h4>

            <ul className="space-y-2">
              {["Home", "Courses", "About", "Blog", "Contact"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      href={`/${
                        link.toLowerCase() === "home"
                          ? ""
                          : link.toLowerCase()
                      }`}
                      className="text-sm text-blue-100 hover:text-yellow-300 transition"
                    >
                      {link}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>


          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-yellow-300 mb-3">
              Contact Us
            </h4>

            <div className="space-y-2 text-sm text-blue-100">
              <p>
                Email:{" "}
                <span className="text-yellow-300">
                  tahiranwar572@gmail.com
                </span>
              </p>

              <p>Phone: +923075944779</p>
            </div>


            {/* Social Icons */}
            <div className="flex justify-center sm:justify-start gap-4 mt-4">

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-yellow-300 transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-yellow-300 transition"
              >
                <FaTwitter />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-yellow-300 transition"
              >
                <FaYoutube />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-yellow-300 transition"
              >
                <FaInstagram />
              </a>

            </div>
          </div>

        </div>
      </div>


      {/* Bottom Bar */}
      <div className="border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs sm:text-sm text-blue-200">

          © {new Date().getFullYear()}{" "}
          <span className="text-yellow-300 font-semibold">
            LMS
          </span>
          . All rights reserved.

        </div>
      </div>

    </footer>
  )
}

export default Footer