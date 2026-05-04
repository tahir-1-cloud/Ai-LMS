'use client';

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAllSessions } from "@/services/sessionService";
import type { Session } from "@/types/session";
import Loader from "@/components/common/Loader";

const SessionList: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getAllSessions();
        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch sessions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <section className="bg-slate-50 py-12 md:py-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10 md:mb-12">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-950">
            Available Learning Sessions
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Explore academic sessions, learning tracks, and structured
            educational programs designed for student success.
          </p>
         <div className="mt-4 h-1 w-20 bg-gradient-to-r from-yellow-400 to-blue-800 mx-auto rounded-full" />
        </div>


        {loading ? (
            <Loader/>
        ) : sessions.length === 0 ? (
          <p className="text-center text-slate-500 text-base sm:text-lg">
            No sessions available.
          </p>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {sessions.map((session) => (
              <div
                key={session.id}
                className="
                  group relative bg-white rounded-2xl
                  border border-slate-200
                  shadow-sm hover:shadow-xl
                  transition-all duration-300
                  overflow-hidden hover:-translate-y-1
                "
              >

                {/* top accent */}
                <div className="h-1 bg-gradient-to-r from-indigo-700 via-blue-600 to-yellow-400" />

                
                <div className="p-5 sm:p-6 flex flex-col h-full">

                  {/* title */}
                  <h3 className="
                    text-lg sm:text-xl font-bold
                    text-blue-950
                    group-hover:text-blue-700
                    transition
                  ">
                    {session.title}
                  </h3>


                  {/* description */}
                  <p className="
                    mt-3 text-sm sm:text-base
                    text-slate-600
                    leading-relaxed
                    line-clamp-4
                  ">
                    {session.description}
                  </p>


                  {/* footer */}
                  <div className="mt-auto pt-6 flex items-center justify-between">

                    <span className="text-sm text-slate-500">
                      Session Year
                    </span>

                    <span className="
                      bg-yellow-100
                      text-yellow-800
                      text-sm font-semibold
                      px-3 py-1
                      rounded-full
                    ">
                      {dayjs(session.sessionYear).format("YYYY")}
                    </span>

                  </div>

                </div>


                {/* subtle hover overlay */}
                <div className="
                  absolute inset-0
                  bg-blue-600/5
                  opacity-0 group-hover:opacity-100
                  transition
                  pointer-events-none
                " />

              </div>
            ))}

          </div>
        )}

      </div>

    </section>
  );
};

export default SessionList;