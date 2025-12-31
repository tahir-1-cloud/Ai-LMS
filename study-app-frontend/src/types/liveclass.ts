export interface LiveClass {
  id: number;
  title: string;
  scheduledAt: string; // UTC from backend
  durationMinutes: number;
  isStarted: boolean;
  isEnded: boolean;
  zoomMeetingId: string;
  password: string;
  startUrl:string;
  joinUrl: string;
}
