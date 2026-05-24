import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useJournal } from "../context/JournalStore";
import { useNotification } from "../context/NotificationContext";
import { MoodBadge, Tag, Modal } from "../components/ui";
import Button from "../components/ui/Button";
import { ArrowLeft, Edit3, Trash2, Calendar, Clock } from "lucide-react";
import { formatDate } from "../lib/constants";

export default function ViewJournal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEntryById, deleteEntry } = useJournal();
  const { showNotification } = useNotification();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const entry = getEntryById(id);

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-6 text-center">
        <h2 className="font-serif text-[32px] font-bold text-[#1C1917] mb-4">
          Entry not found
        </h2>
        <p className="text-[#8A867D] mb-8 leading-relaxed">
          The journal entry you are looking for doesn't exist or has been
          removed.
        </p>
        <Link to="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteEntry(id);
      showNotification("Entry deleted successfully", "success");
      navigate("/dashboard");
    } catch (err) {
      showNotification("Failed to delete entry", "error");
    }
  };

  return (
    <div className="min-h-full bg-[#FBF9F6]">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-[#F2EFE9] sticky top-0 bg-[#FBF9F6] z-40">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-sans text-[14px] text-[#8A867D] hover:text-[#1C1917] transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-[#8A867D] hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer"
            title="Delete entry"
          >
            <Trash2 size={18} />
          </button>
          <Link to={`/journal/edit/${id}`}>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit3 size={16} />
              <span className="hidden sm:inline">Edit Entry</span>
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <article className="max-w-[800px] mx-auto px-6 py-12 md:py-20">
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <MoodBadge mood={entry.mood} />
            <div className="flex items-center gap-2 text-[12px] uppercase tracking-[2px] text-[#8A867D]">
              <Calendar size={14} className="text-[#C29F60]" />
              <span>{formatDate(entry.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] uppercase tracking-[2px] text-[#8A867D]">
              <Clock size={14} className="text-[#C29F60]" />
              <span>
                {entry.body ? entry.body.split(/\s+/).length : 0} words
              </span>
            </div>
          </div>

          <h1 className="font-serif text-[40px] md:text-[64px] font-bold text-[#1C1917] leading-[1.1] mb-10">
            {entry.title}
          </h1>

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <Tag key={tag}>#{tag}</Tag>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-stone prose-lg max-w-none">
          <div
            className="font-sans text-[18px] md:text-[21px] leading-[1.85] text-[#1C1917] whitespace-pre-wrap selection:bg-[#C29F60]/30"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {entry.body}
          </div>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Entry"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete Entry
            </Button>
          </>
        }
      >
        <p className="text-[15px] text-[#8A867D] leading-relaxed">
          Are you sure you want to delete this entry? This action cannot be
          undone and the entry will be removed from your archive.
        </p>
      </Modal>
    </div>
  );
}
