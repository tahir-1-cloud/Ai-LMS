"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Spin,
  Button,
  Tag,
  Modal,
  message,
  Divider,
  Typography,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getStudentPaper, StudentPaperDto } from '@/services/paperService';
import { startAttempt, getMyAttempts } from '@/services/studentService';
import { useStudentAuth } from "@/hooks/useStudentAuth";

const { Title, Text, Paragraph } = Typography;

// TEMP: replace with real auth later
function getStudentId(): number {
  return Number(process.env.NEXT_PUBLIC_TEST_STUDENT_ID ?? 1);
}

function formatPakistaniDate(dateString?: string | null): string {
  const d = parseUtc(dateString);
  if (!d) return 'TBD';

  return d.toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function parseUtc(date?: string | null): Date | null {
  if (!date) return null;
  return new Date(date.endsWith('Z') ? date : date + 'Z');
}


function getExamWindow(paper: StudentPaperDto) {
  const start = parseUtc(paper.testConductedOn);
  if (!start) return null;

  const end = new Date(
    start.getTime() + (paper.durationMinutes ?? 0) * 60 * 1000
  );

  return { start, end };
}



function getExamStatus(paper: StudentPaperDto) {
  const window = getExamWindow(paper);
  if (!window) return 'UNKNOWN';

  const now = new Date(new Date().toISOString());

  if (now < window.start) return 'UPCOMING';
  if (now > window.end) return 'ENDED';
  return 'LIVE';
}



export default function ViewDetailsPage({ params,}: {
  params: { Id: string };})
   {
      useStudentAuth();

  const paperId = Number(params.Id);
  const router = useRouter();
  const studentId = getStudentId();

  const [loading, setLoading] = useState(true);
  const [paper, setPaper] = useState<StudentPaperDto | null>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [startLoading, setStartLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const p = await getStudentPaper(paperId);
        setPaper(p);

        // fetch attempt id ONLY if completed
        if (p.hasAttempted && p.isAttempted) {
          const attempts = await getMyAttempts(studentId);
          const att = attempts.find(a => a.paperId === paperId);
          if (att) setAttemptId(att.id);
        }
      } catch (err: any) {
        console.error(err);
        message.error(err?.message || 'Failed to load paper');
      } finally {
        setLoading(false);
      }
    })();
  }, [paperId, studentId]);

  function canStartTest(paper: StudentPaperDto | null): boolean {
    if (!paper) return false;
    if (paper.hasAttempted) return false;
    return getExamStatus(paper) === 'LIVE';
  }

  async function handleStart() {
    if (!paper) return;

    Modal.confirm({
      title: 'Start Test?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <Paragraph strong>Please read the rules carefully.</Paragraph>
          <ul style={{ paddingLeft: 18 }}>
            <li>Only <strong>one attempt</strong> is allowed.</li>
            <li>If connection breaks, test auto-submits.</li>
            <li>Do not refresh or open multiple tabs.</li>
          </ul>
          <Divider />
          <Text>
            Questions: {paper.questions.length} • Duration:{' '}
            {paper.durationMinutes ?? 'N/A'} minutes
          </Text>
        </div>
      ),
      okText: 'Start Test',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setStartLoading(true);
          const res = await startAttempt({ paperId, studentId });
          router.push(`/student/exams/attempt/${res.attemptId}`);
        } catch (err: any) {
          message.error(
            err?.response?.data ||
              err?.message ||
              'Could not start test'
          );
        } finally {
          setStartLoading(false);
        }
      },
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
        <Card>
          <div className="py-12 text-center text-gray-600">
            Paper not found.
          </div>
        </Card>
      </div>
    );
  }

  const status = getExamStatus(paper);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <Title level={4}>{paper.title}</Title>

          <div className="text-sm text-gray-600 mb-4 space-y-1">
            <div>
              <Text strong>Session:</Text> {paper.sessionTitle ?? '—'}
            </div>
            <div>
              <Text strong>Test Date:</Text>{' '}
              {formatPakistaniDate(paper.testConductedOn)}
            </div>
            <div>
              <Text strong>Questions:</Text> {paper.questions.length}
            </div>
            <div>
              <Text strong>Duration:</Text>{' '}
              {paper.durationMinutes
                ? `${paper.durationMinutes} minutes`
                : 'N/A'}
            </div>
            <div className="mt-2">
              <Text strong>Status:</Text>{' '}
              {paper.hasAttempted && paper.isAttempted ? (
                <Tag color="success">Completed</Tag>
              ) : paper.hasAttempted && !paper.isAttempted ? (
                <Tag color="orange">Submitted</Tag>
              ) : status === 'UPCOMING' ? (
                <Tag color="blue">Upcoming</Tag>
              ) : status === 'LIVE' ? (
                <Tag color="green">Live</Tag>
              ) : status === 'ENDED' ? (
                <Tag color="red">Ended</Tag>
              ) : (
                <Tag>Unknown</Tag>
              )}
            </div>
          </div>

          <Divider />

          <Title level={5}>Instructions</Title>
          <ul className="list-disc pl-6 text-sm text-gray-700">
            <li>Only one attempt is allowed.</li>
            <li>No resume once test starts.</li>
            <li>Ensure stable internet connection.</li>
          </ul>

          <Divider />

          <div className="mt-6 flex gap-3">
            {/* 🟢 START */}
            {!paper.hasAttempted && (
              <Button
                type="primary"
                size="large"
                loading={startLoading}
                disabled={!canStartTest(paper)}
                onClick={handleStart}
              >
                {status === 'UPCOMING'
                  ? 'Test Not Started Yet'
                  : status === 'ENDED'
                  ? 'Test Ended'
                  : 'Start Test'}
              </Button>
            )}

            {/* ⛔ SUBMITTED */}
            {paper.hasAttempted && !paper.isAttempted && (
              <Tag color="orange" className="px-4 py-2 text-base">
                Submitted
              </Tag>
            )}

            {/* ✅ RESULT */}
            {paper.hasAttempted && paper.isAttempted && (
              <Button
                type="default"
                size="large"
                disabled={!attemptId}
                onClick={() =>
                  router.push(`/student/exams/results/${attemptId}`)
                }
              >
                View Result
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
