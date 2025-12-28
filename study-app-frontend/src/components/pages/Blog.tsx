'use client';

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { addsubscriber } from "@/services/publicServices"; 
import { getAllBlogs, getBlogDetails } from "@/services/blogsServices"; 
import { BlogsModel, Blogsdetail } from '@/types/blogs';

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
      Swal.fire({ title: "Subscribed!", text: "Thank you for subscribing.", icon: "success", confirmButtonColor: "#1447e6", background: "#ffffff", customClass: { popup: "rounded-2xl shadow-xl p-4" } });
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
      console.error("Failed to fetch blog details:", error);
      Swal.fire({ title: "Error", text: "Unable to load blog details.", icon: "error", confirmButtonColor: "#d33" });
      setModalVisible(false);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <section className="bg-[#eff6ff] min-h-screen py-20 px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold text-[#22418c] mb-4 tracking-tight drop-shadow-sm">
          📚 Latest Insights & Study Blogs
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Stay informed with expert advice, motivation, and preparation strategies to help you succeed in your entry test journey.
        </p>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {currentBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-[#e3e9ff]"
              >
                <div className="relative w-full h-60 overflow-hidden">
                  {blog.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${blog.imageUrl}`}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-sm opacity-90">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
                        : "-"}
                    </span>
                    <h2 className="text-xl font-semibold mt-1">{blog.title}</h2>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                    {blog.shortDescription}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#1447e6]">
                      ✍️ Junoon Mdcat
                    </span>
                    <button
                      onClick={() => handleReadMore(blog.id)}
                      className="px-4 py-2 rounded-full text-sm font-semibold text-[#22418c] bg-[#ffdf20] hover:bg-[#1447e6] hover:text-white shadow-md transition-all duration-300"
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex justify-center mt-12">
              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"flex items-center space-x-2"}
                pageClassName={"px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors duration-200"}
                pageLinkClassName={"text-gray-700 hover:text-blue-700"}
                previousClassName={"px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors duration-200"}
                previousLinkClassName={"text-gray-700 hover:text-blue-700"}
                nextClassName={"px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors duration-200"}
                nextLinkClassName={"text-gray-700 hover:text-blue-700"}
                breakClassName={"px-4 py-2 text-gray-500"}
                activeClassName={"!bg-blue-600 !text-white shadow-md"}
                activeLinkClassName={"!text-white"}
                disabledClassName={"opacity-40 cursor-not-allowed"}
                disabledLinkClassName={"text-gray-400"}
              />
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl font-bold"
              onClick={() => setModalVisible(false)}
            >
              &times;
            </button>
            {modalLoading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-[#22418c] mb-4">{modalContent?.title}</h2>
                <div
                  className="text-gray-700 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: modalContent?.content || '' }}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center mt-24 max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-md border border-[#e3e9ff]">
        <h3 className="text-3xl font-semibold text-[#22418c] mb-4">
          Want to Stay Updated?
        </h3>
        <p className="text-gray-700 mb-8">
          Subscribe to our newsletter to get the latest updates on study tips, new courses, and motivational blogs delivered straight to your inbox.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-72 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1447e6]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSubscribe}
            className="bg-[#1447e6] hover:bg-[#22418c] text-[#ffdf20] px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-xl transition-all duration-300"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
