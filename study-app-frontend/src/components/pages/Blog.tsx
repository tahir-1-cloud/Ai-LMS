'use client';

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { addsubscriber } from "@/services/publicServices"; 
import { getAllBlogs, getBlogDetails } from "@/services/blogsServices"; 
import { BlogsModel, Blogsdetail } from '@/types/blogs';
import { Loader } from "lucide-react";

export default function BlogPage() {
  const [email, setEmail] = useState("");
  const [blogs, setBlogs] = useState<BlogsModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<Blogsdetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const offset = currentPage * blogsPerPage;
  const currentBlogs = blogs.slice(offset, offset + blogsPerPage);
  const pageCount = Math.ceil(blogs.length / blogsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      Swal.fire({ title: "Email Required", text: "Please enter your email address.", icon: "warning", confirmButtonColor: "#1447e6" });
      return;
    }
    if (!emailRegex.test(email)) {
      Swal.fire({ title: "Invalid Email", text: "Please enter a valid email address.", icon: "error", confirmButtonColor: "#1447e6" });
      return;
    }
    try {
      await addsubscriber({ email });
      setEmail("");
      Swal.fire({ title: "Subscribed!", text: "Thank you for subscribing.", icon: "success", confirmButtonColor: "#1447e6" });
    } catch (error) {
      Swal.fire({ title: "Error", text: "Something went wrong! Please try again later.", icon: "error", confirmButtonColor: "#d33" });
    }
  };

  const handleReadMore = async (blogId: number) => {
    setModalVisible(true);
    setModalLoading(true);
    try {
      const data = await getBlogDetails(blogId);
      setModalContent(data);
    } catch (error) {
      Swal.fire({ title: "Error", text: "Unable to load blog details.", icon: "error", confirmButtonColor: "#d33" });
      setModalVisible(false);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#eff6ff] to-white min-h-screen py-14 px-4 sm:px-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#22418c] mb-3">
          📚 Study Blogs & Insights
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Learn strategies, tips, and motivation to boost your entry test preparation journey.
        </p>
      </div>

      {/* BLOG GRID */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="animate-spin text-[#1447e6]" size={28} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {currentBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
              >

                {/* IMAGE */}
                <div className="relative h-52 sm:h-60 overflow-hidden">
                  {blog.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${blog.imageUrl}`}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                      No Image
                    </div>
                  )}

                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <p className="text-xs opacity-80">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                    <h2 className="text-lg font-semibold">{blog.title}</h2>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {blog.shortDescription}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#1447e6] font-medium">
                      Junoon MDCAT
                    </span>

                    <button
                      onClick={() => handleReadMore(blog.id)}
                      className="text-sm bg-[#ffdf20] hover:bg-[#1447e6] hover:text-white text-[#22418c] px-4 py-2 rounded-full font-semibold transition"
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          {pageCount > 1 && (
            <div className="flex justify-center mt-10">
              <ReactPaginate
                previousLabel={"←"}
                nextLabel={"→"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"flex gap-2 flex-wrap justify-center"}
                pageClassName={"px-3 py-2 bg-white border rounded-lg hover:bg-blue-50"}
                activeClassName={"bg-[#1447e6] text-white"}
              />
            </div>
          )}
        </>
      )}

      {/* MODAL */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 relative max-h-[80vh] overflow-y-auto">

            <button
              onClick={() => setModalVisible(false)}
              className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-black"
            >
              ×
            </button>

            {modalLoading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[#22418c] mb-4">
                  {modalContent?.title}
                </h2>
                <div
                  className="text-gray-700 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: modalContent?.content || "" }}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* SUBSCRIBE */}
      <div className="max-w-3xl mx-auto mt-16 bg-white border rounded-2xl shadow-sm p-6 sm:p-10 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-[#22418c] mb-2">
          Stay Updated 📩
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          Get latest blogs & study tips directly in your inbox.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="border rounded-full px-4 py-3 w-full sm:w-80 focus:ring-2 focus:ring-[#1447e6] outline-none"
          />
          <button
            onClick={handleSubscribe}
            className="bg-[#1447e6] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#22418c] transition"
          >
            Subscribe
          </button>
        </div>
      </div>

    </section>
  );
}