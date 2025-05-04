import { useState } from "react";

export default function Home() {
  const [scheduleText, setScheduleText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    console.log("Schedule Text:", scheduleText);
    try {
      const res = await fetch("/api/generate-ics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: scheduleText }),
      });
      console.log("Response:", res);
      console.log("Response Headers:", res.headers.get("Content-Type"));
      console.log("Response Body:", await res.text());

      if (!res.ok) {
        throw new Error("Failed to generate .ics file");
      }

      // const blob = await res.blob();
      // const url = window.URL.createObjectURL(blob);

      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "MyLectureSchedule.ics";
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while generating the calendar file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lecture to Calendar 🗓️</h1>
      <textarea
        rows={10}
        className="w-full p-3 border border-gray-300 rounded mb-4"
        placeholder="Paste your lecture schedule here..."
        value={scheduleText}
        onChange={(e) => setScheduleText(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={loading || !scheduleText}
        onClick={handleSubmit}
      >
        {loading ? "Generating..." : "Generate Calendar"}
      </button>
    </main>
  );
}
