'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import ComponentCard from '@/components/common/ComponentCard';
import { getStudentLiveClasses } from '@/services/liveClassService';
import { LiveClass } from '@/types/liveclass';

/**
 * Format UTC → Pakistan Time (SAFE for Vercel)
 */
const formatPKTime = (utcString: string) => {
  return new Date(utcString + 'Z').toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function StudentLiveLecturesPage() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getStudentLiveClasses(1);
      setLiveClasses(data);
    } catch {
      toast.error('Failed to load live lectures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ComponentCard title="Live Lectures">
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading live lectures...
        </div>
      ) : liveClasses.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No live lectures available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-center">Schedule</th>
                <th className="border p-2 text-center">Duration</th>
                <th className="border p-2 text-center">Status</th>
                <th className="border p-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {liveClasses.map((cls) => (
                <tr key={cls.id}>
                  <td className="border p-2">{cls.title}</td>

                  <td className="border p-2 text-center">
                    {formatPKTime(cls.scheduledAt)}
                  </td>

                  <td className="border p-2 text-center">
                    {cls.durationMinutes} min
                  </td>

                  <td className="border p-2 text-center">
                    {cls.isEnded
                      ? 'Ended'
                      : cls.isStarted
                      ? 'Live'
                      : 'Scheduled'}
                  </td>

                  <td className="border p-2 text-center">
                    {cls.isStarted && !cls.isEnded && cls.joinUrl ? (
                      <a
                        href={cls.joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 px-4 py-1 text-white rounded inline-block"
                      >
                        Join
                      </a>
                    ) : (
                      <span className="text-gray-400">Not Available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ComponentCard>
  );
}
