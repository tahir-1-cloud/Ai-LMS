'use client'

import { useState, useEffect } from 'react'

const testimonials = [
  {
    name: "Dr. Fatima Shoukat",
    quote: "At Junoon MDCAT, you don’t feel like a student, you feel like family. The dedication, care,and nonstop motivation push you to give your absolute best every single day.",
    university: "Nishter Medical University Multan",
    session: "Session 2023-2024",
    marks: "178 / 200",
    img: "/images/Landingpage/drfatima.jpg",
  },
  {
    name: "Dr. Afifa javed",
    quote: "I never felt alone in my preparation because Junoon MDCAT stands with its students like a family.",
    university: "Ayub medical college Abbottabad",
    session: "Session 2024-2025",
    marks: "182 / 200",
    img: "/images/Landingpage/drafifa.jpg",
  },
  {
    name: "Dr Tayyab Naseer",
    quote: "Junoon MDCAT doesn’t create pressure, it creates confidence. The environment pushes you to grow without fear.",
    university: "Avicenna Medical College Lahore",
    session: "Session 2023-2024",
    marks: "181 / 200",
    img: "/images/Landingpage/drtayb1.jpg",
  },
  {
    name: "Syeda Nimra Gillani",
    quote: "This platform gave my MDCAT journey direction, discipline, and belief.",
    university: "Poonch Medical College Rawalakot",
    session: "Session 2022-2023",
    marks: "171 / 200",
    img: "/images/Landingpage/drnimra.jpg",
  },
  {
    name: "Muhammad Shairaz Rumi",
    quote: "Joining Junoon MDCAT was the best decision of my MDCAT journey.",
    university: "Rawalpindi medical university",
    session: "Session 2023-2024",
    marks: "185 / 200",
    img: "/images/Landingpage/drunkown2.jpg",
  },
  {
    name: "Zain Shairaz",
    quote: "Junoon MDCAT transformed my preparation completely.",
    university: "Rawalpindi Medical University",
    session: "Session 2024-2025",
    marks: "188 / 200",
    img: "/images/Landingpage/drunkown1.jpg",
  },
  {
    name: "Arbab Khan",
    quote: "From day one, Junoon MDCAT made me feel capable.",
    university: "Abu Umara medical and dental college",
    session: "Session 2023-2024",
    marks: "182 / 200",
    img: "/images/Landingpage/drarbab.jpg",
  },
  {
    name: "Hifza Zahir",
    quote: "Classes are focused, energetic, and helpful.",
    university: "Ayub Medical College Abbottabad",
    session: "Session 2023-2024",
    marks: "175 / 200",
    img: "/images/Landingpage/HifzaZahir.jpg",
  },
  {
    name: "Hania Waseem",
    quote: "Best platform for serious MDCAT preparation.",
    university: "Poonch Medical College Rawlakot",
    session: "Session 2023-2024",
    marks: "180 / 200",
    img: "/images/Landingpage/Hania.jpeg",
  },
  {
    name: "Uzair Ali",
    quote: "Junoon MDCAT builds strong foundations for MDCAT.",
    university: "Allama Iqbal Medical College Lahore",
    session: "Session 2023-2024",
    marks: "185 / 200",
    img: "/images/Landingpage/uzair.jpeg",
  },
  {
    name: "Dr.Muhhammad Atif",
    quote: "Learning became enjoyable at Junoon MDCAT.",
    university: "Punjab Medical College Faislabad",
    session: "Session 2023-2024",
    marks: "185 / 200",
    img: "/images/Landingpage/atif.jpeg",
  }
]

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(timer)
  }, [currentIndex])

  const nextSlide = () => {
    if (isAnimating) return

    setIsAnimating(true)

    setCurrentIndex(
      (prev) => (prev + 1) % testimonials.length
    )

    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return

    setIsAnimating(true)

    setCurrentIndex(
      (prev) =>
        (prev - 1 + testimonials.length) %
        testimonials.length
    )

    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToSlide = (index: number) => {
    if (
      isAnimating ||
      index === currentIndex
    ) return

    setIsAnimating(true)

    setCurrentIndex(index)

    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <section className="bg-slate-50 py-12 md:py-16">

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10 md:mb-12">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-950">
            Student Success Stories
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Real achievements, real journeys, and real success from our learners.
          </p>

          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-yellow-400 to-blue-800 mx-auto rounded-full" />

        </div>


        {/* Slider */}
        <div className="relative">

          {/* Prev */}
        <button
          onClick={prevSlide}
          className="
            absolute left-1 sm:left-2 md:left-4
            top-1/2 -translate-y-1/2
            z-10

            bg-white/90 backdrop-blur
            rounded-full
            p-2 sm:p-3
            shadow-md

            border border-slate-200

            /* MOBILE FIX: push away from card */
            -translate-x-2 sm:translate-x-0
          "
        >
          ←
        </button>


        {/* Next */}
        <button
          onClick={nextSlide}
          className="
            absolute right-1 sm:right-2 md:right-4
            top-1/2 -translate-y-1/2
            z-10

            bg-white/90 backdrop-blur
            rounded-full
            p-2 sm:p-3
            shadow-md

            border border-slate-200

            /* MOBILE FIX: push away from card */
            translate-x-2 sm:translate-x-0
          "
        >
          →
        </button>


          {/* Card */}
          <div className="
            bg-white
            rounded-3xl
            border border-slate-200
            shadow-xl
           p-5 sm:p-6 md:p-10
            max-w-4xl mx-auto
          ">

            <div
              className={`
                transition-opacity duration-500
                ${isAnimating
                  ? 'opacity-70'
                  : 'opacity-100'
                }
              `}
            >

              <div className="
                flex flex-col md:flex-row
                items-center gap-5 md:gap-8
              ">

                {/* Image */}
                <img
                  src={testimonials[currentIndex].img}
                  alt={testimonials[currentIndex].name}
                  className="
                    w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32
                    rounded-full
                    object-cover
                    border-4 border-blue-800
                    shadow-lg
                    flex-shrink-0
                  "
                />


                {/* Content */}
                <div className="
                  flex-1
                  text-center md:text-left
                ">

                <div className="mb-4 flex justify-center md:justify-start">

                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>

                </div>


                  <p className="
                    text-slate-700
                    text-xs sm:text-sm md:text-base lg:text-lg
                    leading-relaxed italic
                    mb-6
                  ">
                    {testimonials[currentIndex].quote}
                  </p>


                  <h4 className="
                    text-xl font-bold
                    text-blue-950
                  ">
                    {testimonials[currentIndex].name}
                  </h4>


                  <p className="
                    text-slate-600 mt-1
                  ">
                    {testimonials[currentIndex].university}
                  </p>


                  <div className="
                    mt-4
                    flex flex-col sm:flex-row
                    gap-3 sm:items-center
                    sm:justify-between
                  ">

                    <span className="
                      text-sm text-slate-500
                    ">
                      {testimonials[currentIndex].session}
                    </span>


                    <span className="
                      bg-yellow-400
                      text-blue-950
                      px-5 py-2
                      rounded-full
                      font-bold
                      shadow-md
                    ">
                      {testimonials[currentIndex].marks}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* Dots */}
        <div className="
          flex justify-center
          mt-8 gap-3
          flex-wrap
        ">

          {testimonials.map(
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  goToSlide(index)
                }
                className={`
                  w-3 h-3 rounded-full
                  transition
                  ${
                    index === currentIndex
                      ? 'bg-blue-800 scale-125'
                      : 'bg-slate-300'
                  }
                `}
              />
            )
          )}

        </div>


        {/* Progress */}
        <div className="mt-6 max-w-md mx-auto">

          <div className="
            w-full h-1
            bg-slate-200
            rounded-full
          ">

            <div
              className="
                h-1 rounded-full
                bg-blue-800
                transition-all duration-1000
              "
              style={{
                width: `${
                  ((currentIndex + 1) /
                    testimonials.length) *
                  100
                }%`,
              }}
            />

          </div>

        </div>

      </div>

    </section>
  )
}

export default Testimonials