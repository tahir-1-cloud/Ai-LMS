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
  deleteLiveClass,
} from '@/services/liveClassService';

import { LiveClass } from '@/types/liveclass';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

export default function AdminLiveClasses() {
  useAdminAuth();

  const params = useParams();
  const sessionId = Number(params.sessionId);

  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState<number>(60);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Load classes
  // -------------------------
  const load = async () => {
    try {
      const data = await getSessionLiveClasses(sessionId);
      setLiveClasses(data);
    } catch {
      toast.error('Failed to load live classes');
    }
  };

  useEffect(() => {
    if (!isNaN(sessionId)) {
      load();
    }
  }, [sessionId]);

  // -------------------------
  // Create class
  // -------------------------
  const GRACE_MINUTES = 1;
const handleCreate = async () => {
  console.log('RAW scheduledAt value:', scheduledAt);
  if (!title || !scheduledAt) {
    toast.error('All fields are required');
    return;
  }

    const selected = new Date(scheduledAt);

  const nowPK = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' })
  );

  const allowedFrom = new Date(
    nowPK.getTime() - GRACE_MINUTES * 60 * 1000
  );

  console.log('Selected:', selected.toString());
  console.log('Now PK:', nowPK.toString());
  console.log('Allowed From:', allowedFrom.toString());

  if (selected < allowedFrom) {
    toast.error('Cannot schedule meeting in the past');
    return;
  }
  
  try {
    setLoading(true);

    await createLiveClass({
      sessionId,
      title,
      scheduledAt, // ✅ PK time string ONLY
      durationMinutes: duration,
    });

    toast.success('Live class scheduled');
    setOpen(false);
    setTitle('');
    setScheduledAt('');
    setDuration(60);
    load();
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      'Failed to create class';

    toast.error(message);
  } finally {
    setLoading(false);
  }
};


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

const getNowPKForInput = () => {
  const now = new Date();

  const pkNow = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' })
  );

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${pkNow.getFullYear()}-${pad(pkNow.getMonth() + 1)}-${pad(
    pkNow.getDate()
  )}T${pad(pkNow.getHours())}:${pad(pkNow.getMinutes())}`;
};


  // -------------------------
  // Start / End
  // -------------------------
  const handleStart = async (cls: LiveClass) => {
  try {
    await startLiveClass(cls.id);
    toast.success("Live class started");
    load();
  } catch (err: any) {
    const message =
      err?.response?.data ||
      "Unable to start live class";

    toast.error(message);
  }
};

const handleDelete = async (id: number) => {
  try {
    await deleteLiveClass(id);
    toast.success("Live class deleted");
    load();
  } catch (err: any) {
    toast.error(err?.response?.data || "Failed to delete class");
  }
};

  const handleEnd = async (id: number) => {
    await endLiveClass(id);
    toast.success('Live class ended');
    load();
  };

  return (
    <ComponentCard title="Live Classes">
      {/* Header */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOpen(true)}
          className="rounded bg-brand-500 px-4 py-2 text-white"
        >
          + Schedule Live Class
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-center">Schedule</th>
              <th className="border p-2 text-center">Duration</th>
              <th className="border p-2 text-center">Status</th>
              <th className="border p-2 text-center">Actions</th>
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
                    ? 'Running'
                    : 'Scheduled'}
                </td>

                <td className="border p-2 text-center space-x-2">
                  {/* Scheduled */}
                  {!cls.isStarted && !cls.isEnded && (
                    <button
                      onClick={() => handleStart(cls)}
                      className="bg-green-500 px-3 py-1 text-white rounded"
                    >
                      Start
                    </button>
                  )}

                  {/* Running */}
                  {cls.isStarted && !cls.isEnded && (
                    <>
                      <a
                        href={cls.startUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 px-3 py-1 text-white rounded inline-block"
                      >
                        Join (Host)
                      </a>

                      <button
                        onClick={() => handleEnd(cls.id)}
                        className="bg-red-500 px-3 py-1 text-white rounded"
                      >
                        End
                      </button>
                    </>
                  )}
                  {/* Ended */}
                  {cls.isEnded && (
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="bg-gray-700 px-3 py-1 text-white rounded"
                    >
                      Delete
                    </button>
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
      </div>

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
          min={getNowPKForInput()}
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
