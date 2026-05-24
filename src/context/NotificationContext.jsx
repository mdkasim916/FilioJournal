import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-md w-full">
        {notifications.map((n) => (
          <Toast
            key={n.id}
            {...n}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function Toast({ message, type, onClose }) {
  const icons = {
    success: <CheckCircle className="text-green-600" size={18} />,
    error: <AlertCircle className="text-red-600" size={18} />,
    info: <Info className="text-blue-600" size={18} />,
  };

  const bgs = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 border shadow-lg animate-in slide-in-from-right-full duration-300 ${bgs[type] || bgs.info}`}
    >
      <div className="shrink-0 mt-0.5">{icons[type] || icons.info}</div>
      <p className="flex-1 text-[14px] text-[#1C1917] font-medium leading-relaxed">
        {message}
      </p>
      <button
        onClick={onClose}
        className="shrink-0 text-[#8A867D] hover:text-[#1C1917] transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}
