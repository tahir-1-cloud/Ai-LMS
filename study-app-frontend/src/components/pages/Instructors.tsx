"use client";

import { useEffect, useRef, useState } from "react";

const instructors = [
  {
    name: "Prof. Waqas Ahmed",
    subject: "Biology Expert",
    exp: "10+ Years Experience",
    img: "/images/Landingpage/exprtwaqasupdate.jpg",
  },
  {
    name: "Prof. Haseeb Uzair",
    subject: "Chemistry Instructor",
    exp: "8+ Years Experience",
    img: "/images/Landingpage/expertuzair1.jpg",
  },
  {
    name: "Fahad Bhatti",
    subject: "Physics Expert",
    exp: "12+ Years Experience",
    img: "/images/Landingpage/exprtshafiq1.jpg",
  },
  {
    name: "Ayesha Habib Ullah",
    subject: "English Trainer",
    exp: "6+ Years Experience",
    img: "/images/Landingpage/Ayesha.jpeg",
  },
  {
    name: "Dr. Farah Nadeem",
    subject: "Mathematics Expert",
    exp: "9+ Years Experience",
    img: "/images/Landingpage/Farah.jpeg",
  },
];

const Instructors = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const getStep = () => {
      if (window.innerWidth < 640) {
        return container.clientWidth; // mobile = full card
      }
      return 280; // desktop/tablet
    };

    const autoScroll = () => {
      if (isUserInteracting) return;

      const maxScroll =
        container.scrollWidth - container.clientWidth;

      const step = getStep();
      const nextScroll = container.scrollLeft + step;

      if (container.scrollLeft >= maxScroll) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: step, behavior: "smooth" });
      }
    };

    const timer = setInterval(autoScroll, 2500);

    const start = () => setIsUserInteracting(true);
    const end = () =>
      setTimeout(() => setIsUserInteracting(false), 2500);

    container.addEventListener("mousedown", start);
    container.addEventListener("touchstart", start);
    container.addEventListener("mouseup", end);
    container.addEventListener("touchend", end);
    container.addEventListener("wheel", start, { passive: true });

    return () => {
      clearInterval(timer);

      container.removeEventListener("mousedown", start);
      container.removeEventListener("touchstart", start);
      container.removeEventListener("mouseup", end);
      container.removeEventListener("touchend", end);
      container.removeEventListener("wheel", start);
    };
  }, [isUserInteracting]);

  return (
    <section className="bg-slate-50 py-14 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">

        {/* Header */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-950">
          Meet Our Expert Instructors
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Learn from experienced educators who guide students toward success.
        </p>

        <div className="mt-4 h-1 w-20 bg-gradient-to-r from-yellow-400 to-blue-800 mx-auto rounded-full" />

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="
            flex gap-6 md:gap-8
            overflow-x-auto
            scroll-smooth
            no-scrollbar
            mt-12
            px-2
            cursor-grab active:cursor-grabbing
          "
        >
          {instructors.concat(instructors).map((inst, i) => (
            <div
              key={i}
              className="
                min-w-[85%] sm:min-w-[260px]
                bg-white
                border border-slate-200
                rounded-3xl
                shadow-md
                hover:shadow-2xl
                transition-all duration-300
                hover:-translate-y-2
                p-6
                text-center
                group
              "
            >
              <img
                src={inst.img}
                alt={inst.name}
                className="
                  w-24 h-24 sm:w-28 sm:h-28
                  rounded-full
                  mx-auto
                  object-cover
                  border-4 border-blue-800
                  shadow-md
                  group-hover:scale-105
                  transition
                "
              />

              <h3 className="
                mt-5 text-lg font-bold text-blue-950
                group-hover:text-blue-700
              ">
                {inst.name}
              </h3>

              <p className="text-slate-600 text-sm mt-1">
                {inst.subject}
              </p>

              <p className="text-slate-500 text-xs mt-1">
                {inst.exp}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Instructors;