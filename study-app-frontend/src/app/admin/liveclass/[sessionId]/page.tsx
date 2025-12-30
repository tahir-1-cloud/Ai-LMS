'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Modal } from 'antd';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';

import {
  createLiveClass,
  getSessionLiveClasses,
  startLiveClass,
  endLiveClass,
} from '@/services/liveClassService';

import { LiveClass } from '@/types/liveclass';
import ZoomClientOnly from '@/components/zoom/ZoomClientOnly';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

export default function AdminLiveClasses() {
  useAdminAuth();

  const params = useParams();
  const sessionId = Number(params.sessionId);

  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState<number>(60);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await getSessionLiveClasses(sessionId);
    setLiveClasses(data);
  };

  useEffect(() => {
    if (!isNaN(sessionId)) load();
  }, [sessionId]);

  // ------------------------
  // Create class
  // ------------------------
  const handleCreate = async () => {
    if (!title || !scheduledAt) {
      toast.error('All fields required');
      return;
    }

    try {
      setLoading(true);

      await createLiveClass({
        sessionId,
        title,
        scheduledAt,
        durationMinutes: duration,
      });

      toast.success('Live class scheduled');
      setOpen(false);
      setTitle('');
      setScheduledAt('');
      setDuration(60);
      load();
    } catch {
      toast.error('Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Start / End
  // ------------------------
  const handleStart = async (cls: LiveClass) => {
    await startLiveClass(cls.id);
    toast.success('Class started');
    load();
  };

  const handleEnd = async (id: number) => {
    await endLiveClass(id);
    setActiveClass(null);
    load();
  };

  // ------------------------
  // HOST VIEW (SDK)
  // ------------------------
  if (activeClass) {
    return (
      <ZoomClientOnly
        meetingNumber={activeClass.zoomMeetingId}
        password={activeClass.password}
        userName="Admin"
        role={1} // HOST
      />
    );
  }

  return (
    <ComponentCard title="Live Classes">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOpen(true)}
          className="rounded bg-brand-500 px-4 py-2 text-white"
        >
          + Schedule Live Class
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Schedule</th>
            <th className="border p-2">Duration</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {liveClasses.map((cls) => (
            <tr key={cls.id}>
              <td className="border p-2">{cls.title}</td>

              <td className="border p-2 text-center">
                {new Date(cls.scheduledAt).toLocaleString('en-PK', {
                  timeZone: 'Asia/Karachi',
                })}
              </td>

              <td className="border p-2 text-center">
                {cls.durationMinutes} min
              </td>

              <td className="border p-2 text-center">
                {cls.isEnded
                  ? 'Ended'
                  : cls.isStarted
                  ? 'Running'
                  : 'Scheduled'}
              </td>

              <td className="border p-2 text-center space-x-2">
                {!cls.isStarted && !cls.isEnded && (
                  <button
                    onClick={() => handleStart(cls)}
                    className="bg-green-500 px-3 py-1 text-white rounded"
                  >
                    Start
                  </button>
                )}

                {cls.isStarted && !cls.isEnded && (
                  <>
                    <button
                      onClick={() => setActiveClass(cls)}
                      className="bg-blue-500 px-3 py-1 text-white rounded"
                    >
                      Join
                    </button>

                    <button
                      onClick={() => handleEnd(cls.id)}
                      className="bg-red-500 px-3 py-1 text-white rounded"
                    >
                      End
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {liveClasses.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No live classes scheduled
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <Modal
        title="Schedule Live Class"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleCreate}
        confirmLoading={loading}
      >
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />

        <Label className="mt-3">Schedule Time</Label>
        <Input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />

        <Label className="mt-3">Duration (minutes)</Label>
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </Modal>
    </ComponentCard>
  );
}
