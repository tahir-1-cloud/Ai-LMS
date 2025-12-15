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

const { Title, Text, Paragraph } = Typography;

// TEMP: replace with real auth later
function getStudentId(): number {
  return Number(process.env.NEXT_PUBLIC_TEST_STUDENT_ID ?? 1);
}

function formatPakistaniDate(dateString?: string | null): string {
  if (!dateString) return 'TBD';

  return new Date(dateString).toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getExamWindow(paper: StudentPaperDto) {
  if (!paper.testConductedOn) {
    return null;
  }

  const start = new Date(paper.testConductedOn);
  const end = new Date(
    start.getTime() + (paper.durationMinutes ?? 0) * 60 * 1000
  );

  return { start, end };
}

function getExamStatus(paper: StudentPaperDto) {
  const window = getExamWindow(paper);
  if (!window) return 'UNKNOWN';

  const now = new Date();
  const { start, end } = window;

  if (now < start) return 'UPCOMING';
  if (now > end) return 'ENDED';
  return 'LIVE';
}



export default function ViewDetailsPage({
 
  params,
}: {
  params: { Id: string };
}) {
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

        if (p.isAttempted) {
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
  }, [paperId]);

  // function isWithinWindow(): boolean {
  //   if (!paper) return false;
  //   if (!paper.availableFrom && !paper.availableTo) return true;

  //   const now = new Date();
  //   if (paper.availableFrom && new Date(paper.availableFrom) > now) return false;
  //   if (paper.availableTo && new Date(paper.availableTo) < now) return false;
  //   return true;
  // }

  function isWithinWindow(): boolean {
    if (!paper) return false;
    if (!paper.availableFrom && !paper.availableTo) return true;

    const now = new Date();
    if (paper.availableFrom && new Date(paper.availableFrom) > now) return false;
    if (paper.availableTo && new Date(paper.availableTo) < now) return false;
    return true;
  }

  function canStartTest(paper: StudentPaperDto | null): boolean {
  if (!paper) return false;
  if (paper.isAttempted) return false;

  return getExamStatus(paper) === 'LIVE';
}


  async function handleStart() {
    if (!paper) return;

    if (paper.isAttempted) {
      message.info('You have already completed this test.');
      return;
    }

    if (!isWithinWindow()) {
      message.warning('This test is not currently available.');
      return;
    }

    Modal.confirm({
      title: 'Start Test?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <Paragraph strong>Please read the rules carefully.</Paragraph>
          <ul style={{ paddingLeft: 18 }}>
            <li>Only <strong>one attempt</strong> is allowed.</li>
            <li>Once submitted, you cannot re-attempt.</li>
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
          console.error(err);
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
              {paper.isAttempted ? (
                <Tag color="green">Completed</Tag>
              ) : getExamStatus(paper) === 'UPCOMING' ? (
                <Tag color="blue">Upcoming</Tag>
              ) : getExamStatus(paper) === 'LIVE' ? (
                <Tag color="green">Live</Tag>
              ) : getExamStatus(paper) === 'ENDED' ? (
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
            <li>Once submitted, you cannot retry.</li>
            <li>Ensure stable internet connection.</li>
          </ul>

          <Divider />

          <div className="mt-6">
            {!paper.isAttempted && (
              <Button
                type="primary"
                size="large"
                loading={startLoading}
                disabled={!canStartTest(paper)}
                onClick={handleStart}
              >
                {getExamStatus(paper) === 'UPCOMING'
                  ? 'Test Not Started Yet'
                  : getExamStatus(paper) === 'ENDED'
                  ? 'Test Ended'
                  : 'Start Test'}
              </Button>
            )}



            {paper.isAttempted && (
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
