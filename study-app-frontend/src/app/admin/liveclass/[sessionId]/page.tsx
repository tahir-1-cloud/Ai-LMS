'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';

import {
  createLiveClass,
  getSessionLiveClasses,
  startLiveClass,
  endLiveClass,
} from '@/services/liveClassService';

import { LiveClass } from '@/types/liveclass';
import ZoomMeeting from '@/components/zoom/zoommeeting';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

export default function AdminLiveClasses({
  params,
}: {
  params: { sessionId: string };
}) {
  useAdminAuth();

  const sessionId = Number(params.sessionId);

  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);

  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState<number | ''>(60);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await getSessionLiveClasses(sessionId);
    setLiveClasses(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!title || !scheduledAt || !duration) {
      toast.error('All fields are required');
      return;
    }

    try {
      setLoading(true);

      await createLiveClass({
        sessionId,
        title,
        scheduledAt,
        durationMinutes: Number(duration),
      });

      toast.success('Live class created');
      setTitle('');
      setScheduledAt('');
      setDuration(60);
      load();
    } catch (e: any) {
      toast.error(e.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (cls: LiveClass) => {
    await startLiveClass(cls.id);
    setActiveClass(cls);
  };

  const handleEnd = async (id: number) => {
    await endLiveClass(id);
    setActiveClass(null);
    load();
  };

  // 🔴 HOST VIEW (ZOOM)
  if (activeClass) {
    return (
      <ZoomMeeting
        meetingNumber={activeClass.zoomMeetingId}
        password={activeClass.password}
        userName="Admin"
        role={1}
      />
    );
  }

  return (
    <ComponentCard title="Live Classes">
      <div className="space-y-4">

        {/* Create Form */}
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label>Schedule Time</Label>
          <Input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>

        <div>
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="rounded-lg bg-brand-500 px-4 py-2 text-white"
        >
          {loading ? 'Creating...' : 'Create Live Class'}
        </button>

        <hr />

        {/* List */}
        {liveClasses.map((cls) => (
          <div key={cls.id} className="rounded border p-3">
            <b>{cls.title}</b>

            <div>
              {new Date(cls.scheduledAt).toLocaleString('en-PK', {
                timeZone: 'Asia/Karachi',
              })}
            </div>

            <div>
              Status:{' '}
              {cls.isEnded
                ? 'Ended'
                : cls.isStarted
                ? 'Running'
                : 'Scheduled'}
            </div>

            {!cls.isStarted && !cls.isEnded && (
              <button onClick={() => handleStart(cls)}>Start</button>
            )}

            {cls.isStarted && !cls.isEnded && (
              <button onClick={() => handleEnd(cls.id)}>End</button>
            )}
          </div>
        ))}
      </div>
    </ComponentCard>
  );
}
