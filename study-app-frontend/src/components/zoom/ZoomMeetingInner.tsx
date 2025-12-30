'use client';

import { useEffect } from 'react';

export default function ZoomMeetingInner({
  meetingNumber,
  password,
  userName,
  role,
}: {
  meetingNumber: string;
  password?: string;
  userName: string;
  role: 0 | 1;
}) {
  useEffect(() => {
    let client: any;

    const start = async () => {
      // ⚠️ import ONLY inside effect
      const ZoomMtgEmbedded = (await import('@zoom/meetingsdk/embedded')).default;

      client = ZoomMtgEmbedded.createClient();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/zoom/signature?meetingNumber=${meetingNumber}&role=${role}`
      );

      const { signature } = await res.json();

      client.init({
        zoomAppRoot: document.getElementById('zoom-root')!,
        language: 'en-US',
      });

      client.join({
        sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY!,
        signature,
        meetingNumber,
        password,
        userName,
      });
    };

    start();

    return () => {
      try {
        client?.leave?.();
      } catch {}
    };
  }, [meetingNumber, role, password, userName]);

  return <div id="zoom-root" className="h-screen w-full" />;
}
