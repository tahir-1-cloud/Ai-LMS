'use client';

import { useState } from 'react';
import { addPaper } from '@/services/paperService';
import { CreatePaperModel } from '@/types/createPaper.model';
import { toast } from 'sonner';

import ComponentCard from '@/components/common/ComponentCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

export default function AddPaperForm() {
  const [title, setTitle] = useState('');
  const [testDateTime, setTestDateTime] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !testDateTime) {
      toast.error('Please enter a title and select date & time');
      return;
    }

    const paper: CreatePaperModel = {
      title,
      testConductionDate: new Date(
        new Date(testDateTime).getTime() -
        new Date().getTimezoneOffset() * 60000
      ),
    };


    try {
      await addPaper(paper);
      toast.success('Paper added successfully!');

      setTitle('');
      setTestDateTime('');
    } catch (error: unknown) {
      toast.error((error as Error)?.message || 'Something went wrong.');
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
              placeholder="Enter paper title..."
            />
          </div>

          {/* Date + Time */}
          <div>
            <Label>Test Date & Time</Label>
            <Input
              type="datetime-local"
              value={testDateTime}
              onChange={(e) => setTestDateTime(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              Add Paper
            </button>
          </div>
        </ComponentCard>
      </form>
    </div>
  );
}
