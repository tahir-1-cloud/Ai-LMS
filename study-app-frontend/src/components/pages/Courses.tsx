'use client';

import { useEffect, useState } from "react";
import { LecturesModel } from "@/types/lecturesModel";
import { getLectures } from "@/services/lecturesServices";
import ReactPaginate from "react-paginate";

const toEmbedUrl = (url: string): string => {
  try {
    if (url.includes("embed/")) return url;
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  } catch {
    return url;
  }
};

export default function CoursesPage() {
  const [lectures, setLectures] = useState<LecturesModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const lecturesPerPage = 6;

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getLectures();
        setLectures(data);
      } catch (error) {
        console.error("Failed to fetch lectures:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  const offset = currentPage * lecturesPerPage;
  const currentLectures = lectures.slice(offset, offset + lecturesPerPage);
  const pageCount = Math.ceil(lectures.length / lecturesPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#e6f2ff] via-[#f5faff] to-[#fefefe] py-10 md:py-16">

      {/* HEADER */}
      <div className="text-center mb-10 md:mb-16 px-4 sm:px-6">

        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#22418c] mb-3 md:mb-4">
          🌟 All MDCAT Courses
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Explore all available lectures for MDCAT preparation. Watch videos, view images, and read descriptions.
        </p>
          <div className="mt-4 h-1 w-16 sm:w-20 bg-gradient-to-r from-yellow-400 to-blue-800 mx-auto rounded-full" />

      </div>

      {loading ? (
        <div className="flex justify-center py-16 md:py-20 text-gray-600 text-base md:text-lg font-medium">
          Loading lectures...
        </div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-7xl mx-auto px-4 sm:px-6">

            {currentLectures.map((lecture) => {
              const embedUrl =
                activeVideo === lecture.title
                  ? `${toEmbedUrl(lecture.youtubeUrl)}?autoplay=1&modestbranding=1&rel=0`
                  : "";

              return (
                <div
                  key={lecture.id}
                  className="
                    relative bg-white
                    rounded-2xl md:rounded-3xl
                    shadow-md hover:shadow-2xl
                    border border-blue-100
                    hover:border-blue-400
                    transition-all duration-300
                    overflow-hidden
                    group
                  "
                >

                  {/* MEDIA */}
                  <div className="relative w-full h-48 sm:h-56 md:h-64 bg-blue-100 overflow-hidden">

                    {activeVideo === lecture.title ? (
                      <iframe
                        className="w-full h-full"
                        src={embedUrl}
                        title={lecture.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        {lecture.imageUrl ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${lecture.imageUrl}`}
                            alt={lecture.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}

                        {/* Play Button */}
                        <button
                          onClick={() => setActiveVideo(lecture.title)}
                          className="
                            absolute inset-0
                            flex items-center justify-center
                            bg-black/40
                            opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                            transition
                          "
                        >
                          <div className="bg-gradient-to-r from-yellow-400 to-blue-600 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg">
                            ▶
                          </div>
                        </button>

                      </>
                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="p-4 sm:p-5 md:p-6 text-center">

                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#22418c] mb-2">
                      {lecture.title}
                    </h3>

                    <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-4 line-clamp-2">
                      {lecture.description}
                    </p>

                    {activeVideo === lecture.title ? (
                      <button
                        onClick={() => setActiveVideo(null)}
                        className="bg-red-500 text-white font-semibold px-4 sm:px-6 py-2 rounded-full hover:bg-red-400 transition shadow-md text-sm"
                      >
                        ✖ Close Video
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveVideo(lecture.title)}
                        className="bg-blue-600 text-white font-semibold px-4 sm:px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-md text-sm"
                      >
                        ▶ Watch Lecture
                      </button>
                    )}

                  </div>
                </div>
              );
            })}

          </div>

          {/* PAGINATION */}
          {pageCount > 1 && (
            <div className="flex justify-center mt-10 md:mt-12 px-4">
              <ReactPaginate
                previousLabel={"← Prev"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={"flex flex-wrap justify-center gap-2"}
                pageClassName={"px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition text-sm"}
                activeClassName={"!bg-blue-600 !text-white"}
                previousClassName={"px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 rounded-lg text-sm"}
                nextClassName={"px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 rounded-lg text-sm"}
                breakClassName={"px-2 text-gray-500"}
              />
            </div>
          )}

        </>
      )}
    </section>
  );
}