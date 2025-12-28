'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Addblogs } from '@/services/blogsServices';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import dynamic from 'next/dynamic';

// Dynamically import TipTap editor
const TipTapEditor = dynamic(
  async () => {
    const { useEditor, EditorContent } = await import('@tiptap/react');
    const StarterKit = (await import('@tiptap/starter-kit')).default;
    const Bold = (await import('@tiptap/extension-bold')).default;
    const Italic = (await import('@tiptap/extension-italic')).default;
    const Underline = (await import('@tiptap/extension-underline')).default;
    const Heading = (await import('@tiptap/extension-heading')).default;
    const BulletList = (await import('@tiptap/extension-bullet-list')).default;
    const OrderedList = (await import('@tiptap/extension-ordered-list')).default;
    const ListItem = (await import('@tiptap/extension-list-item')).default;
    const Link = (await import('@tiptap/extension-link')).default;

    return function Editor({
      value,
      onChange,
    }: {
      value: string;
      onChange: (html: string) => void;
    }) {
      const editor = useEditor({
        extensions: [StarterKit, Bold, Italic, Underline, Heading, BulletList, OrderedList, ListItem, Link],
        content: value,
        onUpdate({ editor }) {
          onChange(editor.getHTML());
        },
        editorProps: {
          attributes: {
            class: 'prose min-h-[300px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-500',
          },
        },
        immediatelyRender: false,
      });

      if (!editor) return null;

      return (
        <div className="border border-gray-300 rounded-xl bg-white">
          {/* Toolbar */}
          <div className="flex gap-2 flex-wrap p-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
            >
              Italic
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
            >
              Underline
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
            >
              1. List
            </button>
            <button
              type="button"
              onClick={() => {
                const url = prompt('Enter link URL');
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
            >
              Link
            </button>
          </div>

          {/* Editor */}
          <EditorContent editor={editor} />
        </div>
      );
    };
  },
  { ssr: false }
);

export default function AddBlogPage() {
  useAdminAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    content: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return toast.error('Content is required');

    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('shortDescription', formData.shortDescription);
    fd.append('content', formData.content);
    if (imageFile) fd.append('image', imageFile);

    try {
      setLoading(true);
      await Addblogs(fd);
      toast.success('Blog published successfully!');
      router.push('/admin/Blogs/listing');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">📝 Add New Blog</h1>
          <p className="text-gray-500 mt-2">Create and publish a new blog post</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title + Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Blog Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter blog title"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Blog Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Short Description</label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Short summary of the blog"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Blog Content</label>
            <TipTapEditor
              value={formData.content}
              onChange={(html: string) => setFormData({ ...formData, content: html })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-2 rounded-lg font-semibold text-white shadow-md transition ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Publishing...' : 'Publish Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
