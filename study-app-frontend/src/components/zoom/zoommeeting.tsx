'use client';

import { FC, useEffect, useRef, useState } from 'react';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import { twMerge } from 'tailwind-merge';

const client = ZoomMtgEmbedded.createClient();

interface ZoomMeetingProps {
  meetingNumber: string;
  password?: string;
  userName: string;
  role: 0 | 1; // 0 = student, 1 = admin (host)
  className?: string;
}

const ZoomMeeting: FC<ZoomMeetingProps> = ({
  meetingNumber,
  password = '',
  userName,
  role,
  className,
}) => {
  const zoomRootRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let mounted = true;

  const startMeeting = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/zoom/signature?meetingNumber=${meetingNumber}&role=${role}`
      );

      if (!res.ok) {
        throw new Error('Failed to get Zoom signature');
      }

      const { signature } = await res.json();

      if (!mounted || !zoomRootRef.current) return;

      client.init({
        zoomAppRoot: zoomRootRef.current,
        language: 'en-US',
        customize: {
          video: {
            isResizable: true,
          },
        },
      });

      await client.join({
        sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY!,
        signature,
        meetingNumber,
        password,
        userName,
      });

      if (mounted) setLoading(false);
    } catch (err) {
      console.error('Zoom meeting error:', err);
    }
  };

  startMeeting();

  return () => {
    mounted = false;
    try {
      client.leaveMeeting();
    } catch {
      // no-op
    }
  };
}, [meetingNumber, password, userName, role]);


  return (
    <div
      className={twMerge(
        'relative h-screen w-full bg-black',
        className
      )}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-white">
          Joining meeting…
        </div>
      )}

      <div
        ref={zoomRootRef}
        className="h-full w-full"
      />
    </div>
  );
};

export default ZoomMeeting;
