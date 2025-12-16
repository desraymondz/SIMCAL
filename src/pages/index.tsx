import { useState, useEffect } from "react";

export default function Home() {
  const [scheduleText, setScheduleText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

  // Check for Google auth tokens in URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const authSuccess = params.get('google_auth');

      if (token) {
        setAccessToken(token);
        // Store refresh token in localStorage if available
        if (refreshToken) {
          localStorage.setItem('google_refresh_token', refreshToken);
        }
        // Store access token in localStorage
        localStorage.setItem('google_access_token', token);
        setMessage("✅ Successfully connected to Google Calendar!");
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Check localStorage for existing token
      const storedToken = localStorage.getItem('google_access_token');
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/generate-ics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: scheduleText }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate .ics file");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "MyLectureSchedule.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setMessage("✅ Calendar file downloaded successfully!");
    } catch (err) {
      setMessage("❌ Something went wrong while generating the calendar file.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "/api/google-calendar/auth";
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // Call logout API to revoke token
      if (accessToken) {
        await fetch("/api/google-calendar/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken }),
        });
      }

      // Clear tokens from localStorage
      localStorage.removeItem('google_access_token');
      localStorage.removeItem('google_refresh_token');
      
      // Clear state
      setAccessToken(null);
      setMessage("✅ Successfully logged out. You can now connect with a different Google account.");
    } catch (err) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('google_access_token');
      localStorage.removeItem('google_refresh_token');
      setAccessToken(null);
      setMessage("✅ Logged out. You can now connect with a different Google account.");
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleAddToGoogleCalendar = async () => {
    if (!accessToken) {
      setMessage("❌ Please connect to Google Calendar first.");
      return;
    }

    setGoogleLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/google-calendar/add-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: scheduleText,
          access_token: accessToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add events to Google Calendar");
      }

      if (data.errors && data.errors.length > 0) {
        setMessage(`⚠️ Added ${data.added} events. ${data.failed} failed.`);
      } else {
        setMessage(`✅ Successfully added ${data.added} events to Google Calendar!`);
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Something went wrong while adding events to Google Calendar."}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-blue-600 dark:text-blue-400">
            SIMCAL
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Convert your SIMConnect lecture schedule into calendar events
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-gray-200 dark:border-gray-700">
          {/* Textarea */}
          <div className="mb-6">
            <label htmlFor="schedule-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Paste your lecture schedule
            </label>
            <textarea
              id="schedule-input"
              rows={12}
              className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Paste your lecture schedule here..."
              value={scheduleText}
              onChange={(e) => setScheduleText(e.target.value)}
            />
          </div>

          {/* Google Calendar Section */}
          <div className="mb-6">
            {accessToken ? (
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    Connected to Google Calendar
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {logoutLoading ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 flex items-center justify-center gap-2"
                onClick={handleGoogleAuth}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Connect to Google Calendar</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading || !scheduleText}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download .ics File</span>
                </>
              )}
            </button>
            
            {accessToken && (
              <button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={googleLoading || !scheduleText}
                onClick={handleAddToGoogleCalendar}
              >
                {googleLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Adding events...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add to Google Calendar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`p-4 rounded-lg shadow-md border-l-4 ${
            message.includes("✅") 
              ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-300" 
              : message.includes("⚠️")
              ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-300"
              : "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-300"
          }`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {message.includes("✅") ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : message.includes("⚠️") ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="flex-1 text-sm font-medium">{message}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
