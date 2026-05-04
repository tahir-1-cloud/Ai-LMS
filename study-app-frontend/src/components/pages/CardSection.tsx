"use client";

import { useEffect, useState } from "react";
import { LecturesModel } from "@/types/lecturesModel";
import { getLectures } from "@/services/lecturesServices";
import Link from "next/link";

export default function HomeLectures() {
  const [lectures, setLectures] = useState<LecturesModel[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getLectures();
        setLectures(data.slice(0, 6));
      } catch (err) {
        console.error("Error fetching lectures:", err);
      }
    };

    fetchLectures();
  }, []);

  const convertToEmbedUrl = (url: string) => {
    if (url.includes("youtu.be")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  };

  return (
    <section className="bg-slate-50 py-10 sm:py-14 md:py-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* HEADER */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">

          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-blue-950">
            Comprehensive Learning Courses
          </h2>

          <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Learn through expert-led lectures, practical concepts, and structured content.
          </p>

          <div className="mt-4 h-1 w-16 sm:w-20 bg-gradient-to-r from-yellow-400 to-blue-800 mx-auto rounded-full" />

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">

          {lectures.map((lecture) => {
            const embedUrl = convertToEmbedUrl(lecture.youtubeUrl);

            return (
              <div
                key={lecture.id ?? lecture.title}
                className="
                  bg-white rounded-2xl sm:rounded-3xl
                  overflow-hidden
                  border border-blue-100
                  shadow-md hover:shadow-xl
                  transition-all duration-300
                  hover:-translate-y-1 sm:hover:-translate-y-2
                "
              >

                {/* MEDIA */}
                <div className="relative w-full h-44 sm:h-52 md:h-64 bg-blue-100 overflow-hidden">

                  {activeVideo === lecture.id?.toString() ? (
                    <iframe
                      className="w-full h-full"
                      src={`${embedUrl}?autoplay=1&modestbranding=1&rel=0`}
                      allow="autoplay; encrypted-media"
                    />
                  ) : (
                    <>
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${lecture.imageUrl}`}
                        alt={lecture.title}
                        className="
                          w-full h-full object-cover
                          group-hover:scale-105
                          transition duration-500
                        "
                      />

                      {/* PLAY BUTTON */}
                      <button
                        onClick={() =>
                          setActiveVideo(
                            lecture.id?.toString() ?? lecture.title
                          )
                        }
                        className="
                          absolute inset-0
                          flex items-center justify-center
                          bg-black/30
                          text-white text-3xl sm:text-4xl
                          opacity-0 hover:opacity-100
                          transition
                        "
                      >
                        ▶
                      </button>
                    </>
                  )}

                </div>

                {/* CONTENT */}
                <div className="p-4 sm:p-5 md:p-6 text-center">

                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-950 mb-2 sm:mb-3">
                    {lecture.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm md:text-base line-clamp-2 mb-4 sm:mb-5 leading-relaxed">
                    {lecture.description}
                  </p>

                  {activeVideo === lecture.id?.toString() ? (
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="
                        bg-red-500 text-white
                        px-5 sm:px-6 py-2
                        rounded-full
                        text-sm sm:text-base
                        font-semibold
                        hover:bg-red-600
                        transition
                        shadow-md
                      "
                    >
                      ✖ Close Video
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setActiveVideo(
                          lecture.id?.toString() ?? lecture.title
                        )
                      }
                      className="
                        bg-gradient-to-r from-blue-800 to-indigo-900
                        text-white
                        px-5 sm:px-6 py-2
                        rounded-full
                        text-sm sm:text-base
                        font-semibold
                        hover:scale-105
                        transition
                        shadow-md
                      "
                    >
                      ▶ Watch Lecture
                    </button>
                  )}

                </div>

              </div>
            );
          })}

        </div>

        {/* CTA */}
        <div className="text-center mt-10 sm:mt-12">

          <Link
            href="/courses"
            className="
              inline-block
              bg-yellow-400 text-blue-950
              px-6 sm:px-8 py-2.5 sm:py-3
              rounded-full
              text-sm sm:text-base
              font-semibold
              hover:bg-yellow-300
              transition
              shadow-md
            "
          >
            Explore More Lectures
          </Link>

        </div>

      </div>
    </section>
  );
}