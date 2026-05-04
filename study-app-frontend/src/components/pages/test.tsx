"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, BookOpenCheck, ArrowLeftRight } from "lucide-react";
import { getQuestionsByTestId, submitTest } from "@/services/mocktestattemptServices";
import { MockQuestion, SubmitAnswer, TestResult } from "@/types/mocktest";
import Link from "next/link";
import Swal from "sweetalert2";

interface TestPageProps {
  mockTestId: number;
}

export default function TestPage({ mockTestId }: TestPageProps) {
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [answers, setAnswers] = useState<SubmitAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!loading && !timerActive) setTimerActive(true);
  }, [loading, timerActive]);

  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      Swal.fire({
        icon: "warning",
        title: "Time's up!",
        text: "Your 10 minutes are over. Retry the test.",
      }).then(() => window.location.reload());
      return;
    }

    if (!timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, timerActive]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60)
      .toString()
      .padStart(2, "0")}`;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestionsByTestId(mockTestId);
        setQuestions(data);
        setAnswers(data.map(q => ({ questionId: q.id, optionId: -1 })));
      } catch (err) {
        Swal.fire("Error", "Failed to load questions", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [mockTestId]);

  const handleSelect = (i: number, optionId: number) => {
    const copy = [...answers];
    copy[i] = { questionId: questions[i].id, optionId };
    setAnswers(copy);
  };

  const handleSubmit = async () => {
    if (questions.length === 0) return;

    if (answers.some(a => a.optionId === -1)) {
      Swal.fire("Incomplete", "Attempt all questions", "warning");
      return;
    }

    try {
      const res = await submitTest({ mockTestId, answers });
      setResult(res);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      Swal.fire("Error", "Submission failed", "error");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading questions...
      </p>
    );

  const optionLabels = ["A", "B", "C", "D", "E"];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-3 sm:px-6 py-6 sm:py-10 flex justify-center">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white w-full max-w-4xl rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-8 ${
          questions.length === 0 ? "min-h-[300px] sm:min-h-[400px]" : ""
        }`}
      >

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-3xl font-bold text-[#22418c]">
            ✏️ Mock Test
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Attempt like real MDCAT exam
          </p>
        </div>

        {/* TIMER */}
        <div className="flex justify-end mb-4">
          <div className="bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* EMPTY STATE */}
          {questions.length === 0 ? (
            <div className="text-center py-10 sm:py-16">
              <p className="text-gray-500 text-base sm:text-lg">
                No questions yet 😕
              </p>
            </div>
          ) : !submitted ? (
            <motion.div key="questions">

              {/* QUESTIONS */}
              <div className="space-y-4 sm:space-y-6">

                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="bg-blue-50/40 border border-blue-100 rounded-xl p-3 sm:p-5"
                  >

                    <p className="font-semibold text-gray-800 text-sm sm:text-base mb-3">
                      {i + 1}. {q.title}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">

                      {q.mockOptions.map((opt, idx) => (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg border cursor-pointer text-sm transition ${
                            answers[i]?.optionId === opt.id
                              ? "bg-blue-100 border-blue-500"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <input
                            type="radio"
                            checked={answers[i]?.optionId === opt.id}
                            onChange={() => handleSelect(i, opt.id)}
                            className="accent-blue-600"
                          />
                          <span>
                            {optionLabels[idx]}. {opt.optionText}
                          </span>
                        </label>
                      ))}

                    </div>
                  </div>
                ))}

              </div>

              {/* SUBMIT (ONLY IF QUESTIONS EXIST) */}
              {questions.length > 0 && (
                <div className="text-center mt-6 sm:mt-8">
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 sm:px-10 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:scale-105 transition"
                  >
                    Submit Test
                  </button>
                </div>
              )}

            </motion.div>

          ) : (
            <motion.div className="text-center space-y-5">

              <Trophy className="mx-auto text-blue-600" size={50} />

              <h3 className="text-xl sm:text-3xl font-bold text-green-600">
                {result?.correct}/{result?.total} ({result?.percentage}%)
              </h3>

              <Link
                href="/enrollment"
                className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-semibold"
              >
                <ArrowLeftRight size={16} /> Enroll Now
              </Link>

            </motion.div>
          )}

        </AnimatePresence>

      </motion.div>
    </section>
  );
}