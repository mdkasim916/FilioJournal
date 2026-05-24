import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#FBF9F6] border border-[#1C1917] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1C1917]/10">
          <h3 className="font-serif text-[20px] font-bold text-[#1C1917]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-[#8A867D] hover:text-[#1C1917] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-8">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-[#1C1917]/10 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
