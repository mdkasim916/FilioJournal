import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function Toast({ message, type, onClose }) {
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
