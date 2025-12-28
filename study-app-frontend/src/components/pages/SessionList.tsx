// src/components/pages/SessionsPage.tsx
'use client';

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAllSessions } from "@/services/sessionService";
import type { Session } from "@/types/session";

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
    <section className="bg-blue-50 min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mb-12 text-blue-900">
          🌟 Available Learning Sessions
        </h1>

        {loading ? (
          <p className="text-center text-blue-700 text-lg">
            Loading sessions...
          </p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No sessions available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="relative bg-white rounded-2xl border border-blue-100 shadow-md 
                           hover:shadow-2xl transition-all duration-300 group overflow-hidden"
              >
                {/* Top Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-800" />

                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-700 transition">
                    {session.title}
                  </h3>

                  {/* Description (handles long text nicely) */}
                  <p className="text-gray-700 mt-3 leading-relaxed line-clamp-4">
                    {session.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-6">
                    <span className="text-sm font-medium text-black/70">
                      Session Year
                    </span>

                    <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {dayjs(session.sessionYear).format("YYYY")}
                    </span>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SessionList;
