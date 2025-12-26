'use client';

import { useEffect } from 'react';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

const client = ZoomMtgEmbedded.createClient();

interface Props {
  meetingNumber: string;
  password?: string;
  userName: string;
}

export default function ZoomMeeting({
  meetingNumber,
  password = '',
  userName,
}: Props) {
  useEffect(() => {
    const startMeeting = async () => {
      // 1. Get signature from backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/zoom/signature?meetingNumber=${meetingNumber}&role=0`
      );

      const data = await res.json();

      // 2. Init Zoom
      client.init({
        zoomAppRoot: document.getElementById('zoom-root')!,
        language: 'en-US',
        customize: {
          video: {
            isResizable: true,
          },
        },
      });

      // 3. Join meeting
      client.join({
        sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY!,
        signature: data.signature,
        meetingNumber,
        password,
        userName,
      });
    };

    startMeeting();
  }, []);

  return (
    <div
      id="zoom-root"
      style={{ width: '100%', height: '100vh' }}
    />
  );
}
