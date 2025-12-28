'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Select, Button, Popconfirm, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { toast } from 'sonner';

import { getAllBlogs, deleteBlogs, getBlogDetails } from '@/services/blogsServices';
import { BlogsModel, Blogsdetail } from '@/types/blogs';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function BlogsPage() {
  useAdminAuth();

  const [blogs, setBlogs] = useState<BlogsModel[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogsModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<Blogsdetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // 🔒 Safe HTML → text preview
  const getExcerpt = (html?: string, length = 120) => {
    if (!html) return '—';
    const text = html.replace(/<[^>]*>?/gm, '');
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  // 🔍 Search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();

    const filtered = blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(lower) ||
        b.shortDescription.toLowerCase().includes(lower) ||
        (b.content && b.content.toLowerCase().includes(lower) || b.createdAt)
    );

    setFilteredBlogs(filtered);
  };

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // 🗑 Delete
  const handleDelete = async (id: number) => {
    try {
      await deleteBlogs(id);

      const updated = blogs.filter((b) => b.id !== id);
      setBlogs(updated);
      setFilteredBlogs(updated);

      toast.success('Blog deleted successfully');
    } catch (error) {
      toast.error('Failed to delete blog');
      console.error(error);
    }
  };

  // 🔍 Open Modal
  const handleMoreDetails = async (id: number) => {
    setModalVisible(true);
    setModalLoading(true);
    try {
      const data = await getBlogDetails(id);
      setModalContent(data);
    } catch (error) {
      toast.error('Failed to fetch blog details');
      console.error(error);
    } finally {
      setModalLoading(false);
    }
  };

  // 📊 Table Columns
  const columns: ColumnsType<BlogsModel> = [
    {
      title: '#',
      key: 'index',
      render: (_: unknown, __: BlogsModel, index: number) => index + 1,
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl?: string) =>
        imageUrl ? (
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl}`}
            alt="blog"
            className="w-20 h-20 object-cover rounded-md border"
          />
        ) : (
          'No Image'
        ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Short Description',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      render: (text?: string) => <div className="max-w-md line-clamp-2">{text || '—'}</div>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (date?: string) => <div className="text-gray-700">{formatDate(date)}</div>,
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (content?: string) => (
        <div className="max-w-md line-clamp-2 text-gray-700">{getExcerpt(content)}</div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: BlogsModel) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            size="small"
            onClick={() => handleMoreDetails(Number(record.id))}
          >
            Details
          </Button>

          <Popconfirm
            title="Delete Blog?"
            description="This will permanently delete the blog. Are you sure?"
            onConfirm={() => handleDelete(Number(record.id))}
            okText="Delete"
            cancelText="Cancel"
            icon={<ExclamationCircleOutlined />}
            getPopupContainer={() => document.body}
          >
            <Button danger type="primary" size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">📝 Blogs</h1>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">Show</span>

            <Select
              value={pageSize}
              onChange={(value) => setPageSize(value)}
              options={[
                { value: 5, label: '5' },
                { value: 10, label: '10' },
                { value: 20, label: '20' },
                { value: 50, label: '50' },
              ]}
              className="w-20"
            />

            <Input.Search
              placeholder="Search blogs..."
              allowClear
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20 text-gray-600 text-lg font-medium">
            Loading blogs...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-lg font-medium">
            No blogs found.
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredBlogs}
            rowKey="id"
            pagination={{
              pageSize,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} blogs`,
            }}
            bordered
            className="border border-gray-200 rounded-lg"
            rowClassName={() => 'hover:bg-gray-50'}
          />
        )}

        {/* Modal */}
        <Modal
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
          title={modalContent?.title}
          style={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
          {modalLoading ? (
            <p>Loading...</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: modalContent?.content || '' }} />
          )}
        </Modal>
      </div>
    </div>
  );
}
