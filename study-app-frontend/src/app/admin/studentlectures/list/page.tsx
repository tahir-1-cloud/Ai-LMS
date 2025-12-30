'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Select, Modal, Button, Space, Spin, Alert, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getAllstudentLectures, assignLectureToSession,unassignPaperFromSession
  ,getLectureAssignments } from '@/services/studentLectureServices';
import { LectureDetailsResponseDto } from '@/types/studentLectures';
import type { Session } from '@/types/session';
import { TeamOutlined } from '@ant-design/icons';
import { useAdminAuth } from "@/hooks/useAdminAuth";  
import axiosInstance from '@/services/axiosInstance';
import { toast } from "sonner";

export default function StudentLecturesPage() {
  useAdminAuth();

  const [lectures, setLectures] = useState<LectureDetailsResponseDto[]>([]);
  const [filteredLectures, setFilteredLectures] = useState<LectureDetailsResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');

  // Assign modal state
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [assignLecture, setAssignLecture] = useState<LectureDetailsResponseDto | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [assignedSessionIds, setAssignedSessionIds] = useState<number[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getAllstudentLectures();
        setLectures(data);
        setFilteredLectures(data);
      } catch {
        message.error('Failed to load lectures');
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFilteredLectures(
      lectures.filter(
        l => l.title.toLowerCase().includes(lower) || l.description.toLowerCase().includes(lower)
      )
    );
  };

const openAssignModal = async (lecture: LectureDetailsResponseDto) => {
  setAssignLecture(lecture);
  setAssignModalVisible(true);
  setSessions([]);
  setSelectedSessionId(null);
  setSessionsLoading(true);
  setSessionsError(null);

  try {
    // load sessions
    const all = await axiosInstance.get<Session[]>('/Session/GetSession');
    setSessions(all.data);

    // ✅ load already assigned sessions
    const assignedIds = await getLectureAssignments(lecture.id);
    setAssignedSessionIds(assignedIds);

  } catch {
    setSessionsError('Failed to load sessions');
  } finally {
    setSessionsLoading(false);
  }
};


  const closeAssignModal = () => {
    setAssignModalVisible(false);
    setAssignLecture(null);
    setSessions([]);
    setAssignedSessionIds([]);
    setSelectedSessionId(null);
    setAssignLoading(false);
    setSessionsError(null);
  };

  const columns: ColumnsType<LectureDetailsResponseDto> = [
    { title: '#', width: 60, render: (_, __, index) => index + 1 },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnailUrl',
      width: 120,
      render: url =>
        url ? (
          <img
            src={url}
            alt="thumbnail"
            className="w-20 h-20 object-cover rounded-md border"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-xs">
            No Image
          </div>
        ),
    },
    { title: 'Title', dataIndex: 'title', width: 200, render: text => <span className="font-medium">{text}</span> },
    { title: 'Description', dataIndex: 'description', render: text => <span className="line-clamp-2 text-gray-600">{text}</span> },
    {
      title: 'Watch Video',
      width: 140,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          onClick={() => {
            setSelectedVideoUrl(record.videoUrl);
            setSelectedTitle(record.title);
            setIsModalOpen(true);
          }}
        >
          ▶ Watch
        </Button>
      ),
    },
    {
      title: 'Action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<TeamOutlined />}
            onClick={() => openAssignModal(record)}
          >
            Assign
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">🎓 Student Lectures</h1>
          <div className="flex gap-3 items-center">
            <Select
              value={pageSize}
              onChange={setPageSize}
              options={[5, 10, 20, 50].map(v => ({ value: v, label: v }))}
              className="w-20"
            />
            <Input.Search
              placeholder="Search lectures..."
              allowClear
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Table */}
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredLectures}
          rowKey="id"
          pagination={{ pageSize }}
          bordered
        />
      </div>

      {/* Video Modal */}
      <Modal
        title={<div className="text-sm font-medium truncate">Lecture: <span className="font-semibold text-blue-600">{selectedTitle}</span></div>}
        open={isModalOpen}
        footer={null}
        width={600}            
        centered
        maskClosable
        destroyOnHidden
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedVideoUrl('');
          setSelectedTitle('');
        }}
      >
        {selectedVideoUrl && (
          <div className="relative w-full pt-[56.25%]">
            <iframe
              src={`${selectedVideoUrl}?autoplay=1`}
              className="absolute inset-0 w-full h-full rounded-lg"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal
        title={
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-blue-700">
            🎓 Assign Lectures to Students
          </h2>
          <span className="text-xs text-gray-500">
            Select a session and assign the lecture
          </span>
        </div>
      }

        open={assignModalVisible}
        onCancel={closeAssignModal}
        footer={null}
        width={800}
        centered
      >
        {sessionsLoading ? (
          <div className="flex justify-center py-8"><Spin /></div>
        ) : sessionsError ? (
          <Alert message="Error" description={sessionsError} type="error" showIcon />
        ) : (
          <Table
            dataSource={sessions}
            rowKey="id"
            pagination={false}
            size="small"
            columns={[
              { title: '#', render: (_, __, i) => i + 1, width: 60 },
              { title: 'Title', dataIndex: 'title' },
              { title: 'Session Year', dataIndex: 'sessionYear', render: (y: string) => new Date(y).getFullYear(), width: 120 },
              {
                title: 'Action',
                width: 260,
                render: (_, r: Session) => {
              const sessionId = Number(r.id);
              const isAssigned = assignedSessionIds.includes(sessionId);
              const isSelected = selectedSessionId === sessionId;

  // ✅ WHEN ALREADY ASSIGNED
  if (isAssigned) {
    return (
      <Space>
        <Button size="small" disabled type="primary">
          Assigned
        </Button>

        <Popconfirm
          title="Unassign lecture from this session?"
          okText="Yes"
          cancelText="No"
          onConfirm={async () => {
            if (!assignLecture) return;

            setAssignLoading(true);
            try {
              await unassignPaperFromSession(assignLecture.id, sessionId);
              toast.success('Lecture unassigned');

              // update UI
              setAssignedSessionIds(prev =>
                prev.filter(id => id !== sessionId)
              );
            } finally {
              setAssignLoading(false);
            }
          }}
        >
          <Button danger size="small" loading={assignLoading}>
            Unassign
          </Button>
        </Popconfirm>
      </Space>
    );
  }

  // ✅ WHEN NOT ASSIGNED
  return (
    <Space>
      <Button
        size="small"
        type={isSelected ? 'primary' : 'default'}
        onClick={() => setSelectedSessionId(sessionId)}
      >
        {isSelected ? 'Selected' : 'Select'}
      </Button>

      <Button
        size="small"
        disabled={!isSelected || assignLoading}
        loading={assignLoading}
        onClick={async () => {
          if (!assignLecture) return;

          setAssignLoading(true);
          try {
            await assignLectureToSession(assignLecture.id, sessionId);
            toast.success('Lecture assigned');

            // update UI
            setAssignedSessionIds(prev => [...prev, sessionId]);
            setSelectedSessionId(null);
          } finally {
            setAssignLoading(false);
          }
        }}
      >
        Assign now
      </Button>
    </Space>
  );
}

              },
            ]}
          />
        )}
      </Modal>
    </div>
  );
}
