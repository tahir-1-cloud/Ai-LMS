'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Spin,
  Empty,
  Button,
  DatePicker,
  Pagination,
  Tooltip
} from 'antd';
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

  const filteredLectures = useMemo(() => {
    if (!selectedDate) return lectures;
    return lectures.filter(
      l => l.assignedAt && dayjs(l.assignedAt).isSame(selectedDate, 'day')
    );
  }, [lectures, selectedDate]);

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
              Assigned MDCAT Lectures
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Carefully curated lectures assigned for your preparation
            </p>
          </div>

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

        {/* Loading / Empty */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Spin size="large" />
          </div>
        ) : filteredLectures.length === 0 ? (
          <Empty description="No assigned lectures found" className="py-24" />
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {paginatedLectures.map((lecture) => {
                const thumbnail = lecture.thumbnailUrl;

                return (
                  <Card
                    key={lecture.lectureId}
                    hoverable
                    className="rounded-2xl shadow-sm border-0 overflow-hidden bg-white transition-all"
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
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                        {lecture.lectureTitle}
                      </h3>

                      {/* Description */}
                      <Tooltip title={lecture.description} placement="topLeft">
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 cursor-help">
                          {lecture.description}
                        </p>
                      </Tooltip>

                      <div className="flex items-center justify-between pt-3">
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>
                            Session:{' '}
                            <span className="font-medium text-gray-700">
                              {lecture.sessionTitle}
                            </span>
                          </div>
                          {lecture.assignedAt && (
                            <div>
                              Date:{' '}
                              {dayjs(lecture.assignedAt).format('DD MMM YYYY')}
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
        <div
          className="bg-white rounded-xl w-full max-w-xl p-3 relative"
          onContextMenu={(e) => e.preventDefault()} // basic download block
        >
          {/* ❌ Close Button */}
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Video */}
          {/* <div className="relative w-full pt-[56.25%] select-none">
            <iframe
              src={`${selectedVideo}?autoplay=1`}
              className="absolute inset-0 w-full h-full rounded-lg"
              allow="autoplay; fullscreen"
              allowFullScreen           
            />
          </div> */}

          {/* Video */}
        <div className="relative w-full pt-[56.25%] select-none">
          <video
            src={selectedVideo}
            className="absolute inset-0 w-full h-full rounded-lg"
            controls
            autoPlay
            playsInline
            controlsList="nodownload"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>


        </div>
      </div>
    )}

      </div>
    </div>
  );
}
