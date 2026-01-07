"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { LectureDetailsModel } from "@/types/studentLectures";
import { addStudentLectures } from "@/services/studentLectureServices";


export default function LectureUploadForm() {
   const router = useRouter();
  const [lecture, setLecture] = useState<LectureDetailsModel>({
    title: "",
    description: "",
    thumbnail: null,
    video: null,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!lecture.title.trim()) return toast.error("Title is required!");
    if (!lecture.thumbnail) return toast.error("Thumbnail is required!");
    if (!lecture.video) return toast.error("Video is required!");
    if (!lecture.description.trim()) return toast.error("Description is required!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Title", lecture.title);
      formData.append("Description", lecture.description);
      if (lecture.thumbnail) formData.append("Thumbnail", lecture.thumbnail);
      if (lecture.video) formData.append("Video", lecture.video);

      await addStudentLectures(formData as any);
      toast.success("Lecture uploaded successfully!");
        router.push('/admin/studentlectures/list');
      // Reset form
      setLecture({
        title: "",
        description: "",
        thumbnail: null,
        video: null,
      });
    } catch (err) {
      toast.error("Failed to upload lecture.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-blue-50 p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-black mb-6 text-center">
          Upload Lecture
        </h2>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Title</label>
          <input
            type="text"
            value={lecture.title}
            onChange={(e) => setLecture({ ...lecture, title: e.target.value })}
            className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
          />
        </div>

        {/* Files: Thumbnail & Video */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Thumbnail */}
          <div className="flex-1">
            <label className="block text-black font-semibold mb-2">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setLecture({ ...lecture, thumbnail: e.target.files?.[0] || null })
              }
              className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            />
          </div>

          {/* Video */}
          <div className="flex-1">
            <label className="block text-black font-semibold mb-2">Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setLecture({ ...lecture, video: e.target.files?.[0] || null })
              }
              className="w-full px-3 py-2 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Description</label>
          <textarea
            value={lecture.description}
            onChange={(e) =>
              setLecture({ ...lecture, description: e.target.value })
            }
            className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {loading ? "Uploading..." : "Upload Lecture"}
        </button>
      </form>
    </div>
  );
}
