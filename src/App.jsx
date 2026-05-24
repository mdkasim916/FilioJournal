import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JournalProvider } from "./context/JournalStore";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateJournal from "./pages/CreateJournal";
import Landing from "./pages/Landing";
import Settings from "./pages/Settings";

function NotFound() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Page not found</h2>
      <p>The page you requested does not exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <JournalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal/new" element={<CreateJournal />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </JournalProvider>
  );
}
