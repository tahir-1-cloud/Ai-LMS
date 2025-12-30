'use client';

import dynamic from 'next/dynamic';

const ZoomMeetingInner = dynamic(
  () => import('./ZoomMeetingInner'),
  { ssr: false }
);

export default ZoomMeetingInner;
