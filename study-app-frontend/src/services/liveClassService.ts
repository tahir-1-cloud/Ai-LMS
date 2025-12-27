const API = process.env.NEXT_PUBLIC_API_URL;

export async function createLiveClass(payload: {
  sessionId: number;
  title: string;
  scheduledAt: string; // PKT string
  durationMinutes: number;
}) {
  const res = await fetch(`${API}/api/LiveClass/Create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create live class");
}

export async function getSessionLiveClasses(sessionId: number) {
  const res = await fetch(
    `${API}/api/LiveClass/session/${sessionId}`
  );
  return res.json();
}

export async function startLiveClass(id: number) {
  const res = await fetch(
    `${API}/api/LiveClass/Start/${id}/start`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error("Failed to start live class");
}

export async function endLiveClass(id: number) {
  const res = await fetch(
    `${API}/api/LiveClass/End/${id}/end`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error("Failed to end live class");
}
