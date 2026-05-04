import Link from "next/link"

// components/Header.tsx
const Header = () => {
  return (
    <section
      className="relative text-white text-center py-16 md:py-20 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 58, 138, 0.85)), url('/images/Landingpage/headrbg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-blue-900/50 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6">

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          Boost Your <span className="text-yellow-300">Entry Test</span> Preparation
        </h1>

        {/* Sub text */}
        <p className="text-sm md:text-lg mb-6 text-blue-100 max-w-2xl mx-auto">
          Learn from expert instructors, take mock tests, and build a smart study path for success.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          
          <button className="bg-white text-blue-800 px-6 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition">
            Get Started
          </button>

          <Link href="/courses">
            <button className="border border-yellow-300 text-yellow-300 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 hover:text-blue-900 transition">
              View Courses
            </button>
          </Link>

        </div>

        {/* Stats */}
        <div className="mt-10 pt-6 border-t border-blue-400/20">
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">

            <div>
              <div className="text-xl md:text-2xl font-bold text-yellow-300">99%</div>
              <div className="text-xs md:text-sm text-blue-100">Success Rate</div>
            </div>

            <div>
              <div className="text-xl md:text-2xl font-bold text-yellow-300">1000+</div>
              <div className="text-xs md:text-sm text-blue-100">Mock Tests</div>
            </div>

            <div>
              <div className="text-xl md:text-2xl font-bold text-yellow-300">24/7</div>
              <div className="text-xs md:text-sm text-blue-100">Support</div>
            </div>

          </div>
        </div>

      </div>

      {/* subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-950/80 to-transparent"></div>
    </section>
  )
}

export default Header