import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { JournalProvider, useJournal } from "./context/JournalStore";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateJournal from "./pages/CreateJournal";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";
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
            <Route path="/journal/new" element={<CreateJournal />} />
            <Route path="/settings" element={<Settings />} />
            {/* Add other authenticated routes here as needed */}
            <Route
              path="/calendar"
              element={
                <div className="p-12">
                  <h1>Calendar Coming Soon</h1>
                </div>
              }
            />
            <Route
              path="/analytics"
              element={
                <div className="p-12">
                  <h1>Analytics Coming Soon</h1>
                </div>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </JournalProvider>
  );
}
