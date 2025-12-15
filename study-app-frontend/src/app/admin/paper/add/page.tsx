'use client';

import { useState } from 'react';
import { addPaper } from '@/services/paperService';
import { CreatePaperModel } from '@/types/createPaper.model';
import { toast } from 'sonner';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { useRouter } from 'next/navigation';

export default function AddPaperForm() {
  const [title, setTitle] = useState('');
  const [testDateTime, setTestDateTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number | ''>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!testDateTime) {
      toast.error('Please select test date & time');
      return;
    }

    if (!durationMinutes || durationMinutes < 1) {
      toast.error('Duration must be at least 1 minute');
      return;
    }


    const paper: CreatePaperModel = {
      title: title.trim(),
      testConductionDate: new Date(
        new Date(testDateTime).getTime() -
          new Date().getTimezoneOffset() * 60000
      ),
      durationMinutes,
    };

    try {
      setIsSubmitting(true);
      await addPaper(paper);

      toast.success('Paper added successfully');

      // ✅ navigate to paper listing page
      router.push('/admin/paper/listing');

    } catch (error: unknown) {
      toast.error((error as Error)?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1">
      <form onSubmit={handleSubmit} className="space-y-6">
        <ComponentCard title="Add Paper">

          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter paper title"
              required
            />
          </div>

          {/* Test Date & Time */}
          <div>
            <Label>Test Date & Time</Label>
            <Input
              type="datetime-local"
              value={testDateTime}
              onChange={(e) => setTestDateTime(e.target.value)}
              required
            />
          </div>

          {/* Duration */}
          <div>
            <Label>Test Duration (minutes)</Label>
            <Input
              type="number"
              min={1}
              step={1}
              value={durationMinutes}
              onChange={(e) => {
                const val = e.target.value;

                // allow empty input
                if (val === '') {
                  setDurationMinutes('');
                  return;
                }

                const num = Number(val);

                if (num >= 1) {
                  setDurationMinutes(num);
                }
              }}
              placeholder="e.g. 40"
              required
            />
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? 'Adding...' : 'Add Paper'}
            </button>
          </div>

        </ComponentCard>
      </form>
    </div>
  );
}
