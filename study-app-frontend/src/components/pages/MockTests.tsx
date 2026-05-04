"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllMockTestCount } from "@/services/mocktestattemptServices";
import { MocktestCounts } from "@/types/mocktest";

const MockTests = () => {
  const [mockTests, setMockTests] = useState<MocktestCounts[]>([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getAllMockTestCount();
        setMockTests(data);
      } catch (error) {
        console.error("Error fetching mock tests:", error);
      }
    };

    fetchTests();
  }, []);

  return (
    <section className="bg-slate-50 py-12 md:py-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10 md:mb-12">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-950">
            Practice Mock Tests
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Test your preparation, improve accuracy, and build confidence
            with exam-focused mock assessments.
          </p>

          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-yellow-400 to-blue-800 mx-auto rounded-full" />

        </div>


        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {mockTests.map((test) => (
            <div
              key={test.id}
              className="
                bg-white
                border border-blue-100
                rounded-3xl
                shadow-md hover:shadow-2xl
                transition-all duration-300
                hover:-translate-y-2
                overflow-hidden
                group
              "
            >

              {/* top accent */}
              <div className="h-1 bg-gradient-to-r from-indigo-800 via-blue-700 to-yellow-400" />


              <div className="p-6 text-center">

                {/* title */}
                <h3 className="
                  text-lg sm:text-xl
                  font-bold text-blue-950
                  mb-4
                  group-hover:text-blue-700
                  transition
                ">
                  {test.title}
                </h3>


                {/* info */}
                <div className="space-y-2 mb-5">

                  <p className="text-sm text-slate-600">
                    🧮 {test.totalQuestions} Questions
                  </p>

                  <p className="text-sm text-slate-600">
                    ⏱ 10 min
                  </p>

                  <p className="text-sm text-slate-600">
                    🎯 Medium Level
                  </p>

                </div>


                {/* button */}
                <Link href={`/assessment/${test.id}`}>

                  <button
                    className="
                      bg-gradient-to-r
                      from-blue-800 to-indigo-900
                      text-white
                      font-semibold
                      px-6 py-2.5
                      rounded-full
                      hover:scale-105
                      transition
                      shadow-md
                    "
                  >
                    Start Test
                  </button>

                </Link>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default MockTests;