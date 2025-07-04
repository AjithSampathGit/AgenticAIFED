b304e99b7eb1dd825c8305f523b4657e

import { useEffect, useState } from "react";

const INACTIVITY_LIMIT_MS = 30000; // 30 seconds

export default function App() {
  const [sessionId] = useState(() => `sess_${Math.random().toString(36).slice(2)}`);
  const [response, setResponse] = useState(null);
  const [inactive, setInactive] = useState(false);
  let timeoutId;

  // Simulate idle detection
  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setInactive(true);
    }, INACTIVITY_LIMIT_MS);
  };

  const handleAgenticResponse = async () => {
    const res = await fetch("https://your-api.onrender.com/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        step: "start",
      }),
    });
    const data = await res.json();
    setResponse(data);
  };

  useEffect(() => {
    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  useEffect(() => {
    if (inactive) {
      handleAgenticResponse();
    }
  }, [inactive]);

  return (
    <div className="p-10 font-sans max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to XYZ Bank</h1>
      <p className="mb-6">Start your account opening process. We’re here to help every step of the way.</p>

      {!inactive && <p className="text-sm text-gray-600">Session active. Keep interacting to stay online.</p>}

      {inactive && (
        <div className="mt-6 p-4 border rounded shadow bg-gray-100 space-y-2">
          <p className="font-semibold">Session timed out due to inactivity.</p>
          {response ? (
            <>
              <p><strong>Recommended Action:</strong> {response.status}</p>
              <p>{response.message}</p>
              {response.appointment_link && (
                <a
                  href={response.appointment_link}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Schedule Appointment
                </a>
              )}
            </>
          ) : (
            <p>Analyzing best action...</p>
          )}
        </div>
      )}
    </div>
  );
}
