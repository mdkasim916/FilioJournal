import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { JournalProvider, useJournal } from "./context/JournalStore";
import { NotificationProvider } from "./context/NotificationContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import JournalEditor from "./pages/JournalEditor";
import ViewJournal from "./pages/ViewJournal";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import AppLayout from "./components/layout/AppLayout";

function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px" }}>
        Page not found
      </h2>
      <p style={{ color: "#8A867D", marginTop: "16px" }}>
        The page you requested does not exist.
      </p>
      <a
        href="/"
        style={{
          color: "#1A3626",
          textDecoration: "underline",
          marginTop: "20px",
          display: "inline-block",
        }}
      >
        Return home
      </a>
    </div>
  );
}

// Redirect logged in users away from public auth pages
function PublicRoute({ children }) {
  const { authSession } = useJournal();
  if (authSession) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <JournalProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* Auth Pages (Protected from logged-in users) */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* Authenticated Routes with Sidebar */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journal/new" element={<JournalEditor />} />
              <Route path="/journal/:id" element={<ViewJournal />} />
              <Route path="/journal/edit/:id" element={<JournalEditor />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </JournalProvider>
  );
}
