"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] via-white to-[#f0f9ff] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden font-[Poppins]">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,#1447e6_1px,transparent_0)] bg-[length:50px_50px]" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-20 z-10 max-w-4xl"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-4"
        >
          
        </motion.div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-[#22418c] mb-6 leading-tight">
          Welcome to <span className="text-[#1447e6]">Junoon MDCAT</span>
        </h1>
        
        <p className="text-gray-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-light">
          Your trusted partner in achieving medical education excellence. We empower aspiring doctors 
          with comprehensive preparation resources, expert guidance, and unwavering support to turn 
          dreams into reality.
        </p>
      </motion.div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl w-full items-center z-10 bg-white rounded-3xl shadow-2xl p-10 md:p-16 mb-20">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-[550px] h-[380px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-4 border-[#eff6ff] group">
            <Image
              src="/images/Landingpage/exprtwaqasupdate1.jpg"
              alt="MDCAT preparation students studying"
              fill
              className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              priority
              quality={100}
            />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-gray-700 leading-relaxed"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#22418c] mb-6 flex items-center gap-3">
            <span className="w-2 h-12 bg-[#1447e6] rounded-full" />
            Our Mission
          </h2>
          
          <div className="space-y-4 text-base md:text-lg font-light leading-relaxed">
            <p>
              At <span className="font-semibold text-[#1447e6]">Junoon MDCAT</span>, we are dedicated to making 
              entry test preparation accessible, efficient, and results-driven for every aspiring medical student. 
              Our platform offers expertly curated mock tests, comprehensive past papers, and advanced performance 
              analytics designed to help you study smarter.
            </p>
            
            <p>
              We ignite the unstoppable passion within every student to conquer the <strong>MDCAT</strong> and 
              transform ambitious dreams into tangible achievements. Every student carries a unique vision for 
              their future, and with strategic guidance, dedicated practice, and relentless determination, no goal 
              is beyond reach.
            </p>
            
            <p>
              We don't just teach—we empower, inspire, and elevate students beyond their perceived limits. Every 
              lesson, strategy session, and practice test is meticulously crafted to fuel your journey toward 
              medical excellence. We transform stress into strength, anxiety into confidence, and ambition into 
              achievement.
            </p>
            
            <p className="font-medium text-[#22418c] text-lg md:text-xl pt-2">
              At Junoon MDCAT, we are more than an educational platform—we are your partners in success, 
              committed to helping you achieve your medical career aspirations with unstoppable 
              <span className="text-[#1447e6]"> Junoon!</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl w-full z-10 mb-20"
      >
        {[
          { number: "5000+", label: "Students Enrolled" },
          { number: "95%", label: "Success Rate" },
          { number: "10,000+", label: "Practice Questions" },
          { number: "50+", label: "Mock Tests" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100"
          >
            <div className="text-4xl md:text-5xl font-bold text-[#1447e6] mb-2">
              {stat.number}
            </div>
            <div className="text-gray-600 text-sm md:text-base font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Core Values Section */}
      <div className="max-w-7xl w-full z-10 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#22418c] mb-4">
            Our Core Values
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
            The principles that guide our commitment to student success and educational excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Excellence",
              desc: "We deliver premium educational content with structured learning pathways, ensuring every student receives the highest quality preparation materials and comprehensive study resources.",
              icon: "🎯",
              color: "from-blue-50 to-indigo-50"
            },
            {
              title: "Innovation",
              desc: "We harness cutting-edge technology to create interactive, personalized learning experiences that adapt to each student's unique needs, pace, and learning style.",
              icon: "💡",
              color: "from-indigo-50 to-purple-50"
            },
            {
              title: "Support",
              desc: "Our dedicated team provides continuous guidance and mentorship, walking alongside students every step of their journey toward achieving their academic and career goals.",
              icon: "🤝",
              color: "from-purple-50 to-pink-50"
            },
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`bg-gradient-to-br ${value.color} p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 backdrop-blur-sm`}
            >
              <div className="text-6xl mb-6 filter drop-shadow-md">{value.icon}</div>
              <h3 className="text-2xl font-bold text-[#22418c] mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed font-light">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl w-full z-10 bg-[#1447e6] rounded-3xl shadow-2xl p-12 md:p-16 text-white"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Why Choose Junoon MDCAT?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Comprehensive Curriculum",
              desc: "Complete coverage of MDCAT syllabus with subject-wise preparation modules"
            },
            {
              title: "Expert Faculty",
              desc: "Learn from experienced educators specializing in medical entrance examinations"
            },
            {
              title: "Performance Analytics",
              desc: "Track your progress with detailed insights and personalized recommendations"
            },
            {
              title: "Flexible Learning",
              desc: "Study at your own pace with 24/7 access to all course materials and resources"
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 5 }}
              className="flex gap-4 items-start"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-white/90 font-light leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-24 text-center z-10">
        <h3 className="text-2xl md:text-3xl font-bold text-[#22418c] mb-3">
          Ready to Start Your MDCAT Preparation?
        </h3>

        <p className="text-gray-700 text-lg max-w-xl mx-auto mb-8">
          Get complete enrollment details, guidance, and support by connecting with
          our team directly on WhatsApp.
        </p>

        <motion.a
          href="https://wa.me/923144099819"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-10 py-4 
                    bg-[#1447e6] text-white rounded-full 
                    text-lg font-semibold shadow-lg 
                    hover:bg-[#0f36b8] hover:shadow-xl 
                    transition-all duration-300">
          <svg 
            className="w-6 h-6" 
            fill="currentColor" 
            viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
          Contact on WhatsApp
        </motion.a>
      </motion.div>


    </div>
  );
}