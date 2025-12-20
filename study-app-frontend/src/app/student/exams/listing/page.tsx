'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Spin,
  message,
  Modal,
  Typography,
  Divider,
  Input,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getAssignedPapersForStudent,
  startAttempt as startAttemptService,
  getAttemptsForStudent,
} from '@/services/studentService';
import type { AssignedPaperDto, StudentAttemptDto } from '@/types/student';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

/* ------------------ HELPERS ------------------ */

function getStudentId(): number {
  return Number(process.env.NEXT_PUBLIC_TEST_STUDENT_ID ?? 1);
}

function formatPakistaniDate(date?: string | null) {
  const d = parseUtc(date);
  if (!d) return '--';

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


function getExamStatus(r: AssignedPaperDto) {
  const now = new Date(); // local now is fine

  const from = parseUtc(r.availableFrom);
  const to = parseUtc(r.availableTo);

  if (from && from > now) return 'UPCOMING';
  if (to && to < now) return 'ENDED';

  return 'LIVE';
}


function getStatusPriority(r: AssignedPaperDto): number {
  if (r.isAttempted) return 4;

  const status = getExamStatus(r);
  if (status === 'LIVE') return 1;
  if (status === 'UPCOMING') return 2;
  if (status === 'ENDED') return 3;

  return 5;
}

function safeDateValue(date?: string | null): number {
  const d = parseUtc(date);
  return d ? d.getTime() : Number.MAX_SAFE_INTEGER;
}


/* ------------------ COMPONENT ------------------ */

export default function StudentAssignedTestsPage() {
  const [assigned, setAssigned] = useState<AssignedPaperDto[]>([]);
  const [attempts, setAttempts] = useState<StudentAttemptDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [starting, setStarting] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');

  const studentId = getStudentId();
  const router = useRouter();

  useEffect(() => {
    loadAssigned();
    loadAttempts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAssigned = async () => {
    setLoading(true);
    try {
      const data = await getAssignedPapersForStudent(studentId);
      setAssigned(data);
    } catch {
      message.error('Failed to load assigned tests');
    } finally {
      setLoading(false);
    }
  };

  const loadAttempts = async () => {
    setAttemptsLoading(true);
    try {
      const data = await getAttemptsForStudent(studentId);
      setAttempts(data ?? []);
    } finally {
      setAttemptsLoading(false);
    }
  };

  function canStartTest(r: AssignedPaperDto) {
  const att = getAttemptForPaper(r.id);
  if (att) return false;
  return getExamStatus(r) === 'LIVE';
}


  const getAttemptForPaper = (paperId: number) =>
    attempts.find(a => Number(a.paperId) === Number(paperId)) ?? null;

  async function handleStart(paperId: number) {
    Modal.confirm({
      title: 'Start Test?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <Paragraph strong>Please read the rules carefully.</Paragraph>
          <ul style={{ paddingLeft: 18 }}>
            <li>Only one attempt is allowed.</li>
            <li>Once started, test will auto-submit on disconnect.</li>
            <li>Do not refresh or open multiple tabs.</li>
          </ul>
          <Divider />
        </>
      ),
      onOk: async () => {
        try {
          setStarting(paperId);
          const resp = await startAttemptService({ paperId, studentId });
          router.push(`/student/exams/attempt/${resp.attemptId}`);
        } catch (err: any) {
          message.warning(err?.response?.data || 'Could not start attempt');
        } finally {
          setStarting(null);
        }
      },
    });
  }

  /* ------------------ FILTER + SORT ------------------ */

  const filteredAndSortedData = assigned
    .filter(r =>
      r.title?.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      const p1 = getStatusPriority(a);
      const p2 = getStatusPriority(b);
      if (p1 !== p2) return p1 - p2;
      return safeDateValue(a.availableFrom) - safeDateValue(b.availableFrom);
    });

  /* ------------------ TABLE ------------------ */

  const columns: ColumnsType<AssignedPaperDto> = [
    { title: '#', render: (_, __, i) => i + 1 },

    { title: 'Title', dataIndex: 'title' },

    {
      title: 'Availability',
      render: (_, r) => (
        <div className="text-sm">
          <div>
            <Text strong>From:</Text> {formatPakistaniDate(r.availableFrom)}
          </div>
          <div>
            <Text strong>To:</Text> {formatPakistaniDate(r.availableTo)}
          </div>
        </div>
      ),
    },

    {
        title: 'Status',
        render: (_, r) => {
          const att = getAttemptForPaper(r.id);

          // ✅ ATTEMPT-BASED STATUS FIRST
          if (att?.status === 'Completed')
            return <Tag color="success">Completed</Tag>;

          if (att?.status === 'InProgress')
            return <Tag color="orange">In Progress</Tag>;

          // ⏱ EXAM WINDOW STATUS
          const status = getExamStatus(r);
          if (status === 'LIVE') return <Tag color="green">Live</Tag>;
          if (status === 'UPCOMING') return <Tag color="blue">Upcoming</Tag>;
          if (status === 'ENDED') return <Tag color="red">Ended</Tag>;

          return <Tag>Unknown</Tag>;
        },
      },


    {
      title: 'Action',
        render: (_, r) => {
        const att = getAttemptForPaper(r.id);

        // ✅ COMPLETED
        if (att?.status === 'Completed') {
          return (
            <Space>
              <Link href={`/student/exams/results/${att.id}`}>
                <Button type="primary">Result</Button>
              </Link>

              <Link href={`/student/exams/${r.id}/ViewDetails`}>
                <Button>Details</Button>
              </Link>
            </Space>
          );
        }

        // ⛔ IN PROGRESS → DO NOT ALLOW RESTART
        if (att?.status === 'InProgress') {
          return (
            <Space>
              <Tag color="orange">In Progress</Tag>
              <Button disabled>Start</Button>
            </Space>
          );
        }

        // 🟢 NO ATTEMPT EXISTS → ALLOW START IF LIVE
        return (
          <Space>
            <Button
              type="primary"
              disabled={!canStartTest(r)}
              loading={starting === r.id}
              onClick={() => handleStart(r.id)}
            >
              Start
            </Button>

            <Link href={`/student/exams/${r.id}/ViewDetails`}>
              <Button>Details</Button>
            </Link>
          </Space>
        );
      },
    },
  ];

  const isBusy = loading || attemptsLoading;

  /* ------------------ UI ------------------ */

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>📘 Assigned Tests</Title>
          <Input.Search
            placeholder="Search by title"
            allowClear
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 260 }}
          />
        </div>

        {isBusy ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredAndSortedData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>
    </div>
  );
}
