'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, Spin, Empty, Button, DatePicker, Pagination } from 'antd';
import { getAssignedLectures } from '@/services/studentLectureServices';
import { AssignedLectureDto } from '@/types/studentLectures';
import { PlayCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const PAGE_SIZE = 6;

export default function StudentAssignedLecturesPage() {
  const [lectures, setLectures] = useState<AssignedLectureDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getAssignedLectures();
        setLectures(data);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  /* 🔹 Date filter */
  const filteredLectures = useMemo(() => {
    if (!selectedDate) return lectures;

    return lectures.filter(l =>
      l.assignedAt &&
      dayjs(l.assignedAt).isSame(selectedDate, 'day')
    );
  }, [lectures, selectedDate]);

  /* 🔹 Pagination */
  const paginatedLectures = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLectures.slice(start, start + PAGE_SIZE);
  }, [filteredLectures, currentPage]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] py-10 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              🎓 My Lectures
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Access your assigned lectures session-wise & date-wise
            </p>
          </div>

          {/* Date Filter */}
          <DatePicker
            allowClear
            placeholder="Filter by date"
            onChange={(date) => {
              setSelectedDate(date);
              setCurrentPage(1);
            }}
            className="w-56"
            suffixIcon={<CalendarOutlined />}
          />
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Spin size="large" />
          </div>
        ) : filteredLectures.length === 0 ? (
          <Empty description="No lectures found" className="py-24" />
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {paginatedLectures.map((lecture) => {
                const thumbnail =lecture.thumbnailUrl;
                  
                return (
                  <Card
                    key={lecture.lectureId}
                    hoverable
                    className="rounded-2xl shadow-md border-0 overflow-hidden bg-white"
                    cover={
                      thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={lecture.lectureTitle}
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                          No Thumbnail
                        </div>
                      )
                    }
                  >
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {lecture.lectureTitle}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {lecture.description}
                      </p>

                      <div className="flex items-center justify-between pt-3">
                        <div className="text-xs text-gray-500">
                          <div>
                            Session: <b>{lecture.sessionTitle}</b>
                          </div>
                          {lecture.assignedAt && (
                            <div>
                              Date: {dayjs(lecture.assignedAt).format('DD MMM YYYY')}
                            </div>
                          )}
                        </div>

                        <Button
                          type="primary"
                          size="small"
                          icon={<PlayCircleOutlined />}
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => setSelectedVideo(lecture.videoUrl)}
                        >
                          Watch
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10">
              <Pagination
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={filteredLectures.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          </>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-3xl p-4 relative">
              <Button
                className="absolute right-3 top-3"
                onClick={() => setSelectedVideo(null)}
              >
                Close
              </Button>

              <div className="relative w-full pt-[56.25%]">
                <iframe
                  src={`${selectedVideo}?autoplay=1`}
                  className="absolute inset-0 w-full h-full rounded-xl"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
