// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/ui";
import { useJournal } from "../context/JournalStore";

const FEATURES = [
  {
    num: "01",
    title: "Distraction-Free Editor",
    body: "A centered canvas built for thought. No clutter, no notifications — only you and the blank page.",
  },
  {
    num: "02",
    title: "Mood & Tag System",
    body: "Attach emotional context and searchable tags to every entry. Patterns emerge over time.",
  },
  {
    num: "03",
    title: "AI Reflection Tools",
    body: "Summarise, reframe, or expand entries with built-in AI assistance that respects your voice.",
  },
  {
    num: "04",
    title: "Analytics & Streaks",
    body: "Visualise your consistency, mood history, and writing volume across weeks and months.",
  },
  {
    num: "05",
    title: "Private by Design",
    body: "End-to-end encrypted. Export to PDF or Markdown at any time. Your words belong to you.",
  },
  {
    num: "06",
    title: "Calendar View",
    body: "Navigate your archive by date. Every day you wrote is a door worth opening again.",
  },
];

const TESTIMONIALS = [
  {
    quote: "The first journal I've kept for more than two weeks.",
    name: "Priya S.",
    role: "Product Designer",
  },
  {
    quote: "It reads like a magazine, writes like a diary.",
    name: "Tom H.",
    role: "Writer",
  },
  {
    quote: "The mood tracking alone changed how I start my mornings.",
    name: "Celine D.",
    role: "Therapist",
  },
];

export default function Landing() {
  const { authSession } = useJournal();

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#FBF9F6] text-[#1C1917]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── Nav ── */}
      <nav className="flex justify-between items-center px-12 py-5 border-b border-[#1C1917]">
        <span
          className="font-bold text-[20px]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Folio
        </span>
        <div className="flex items-center gap-8">
          <a
            href="#features"
            className="text-[13px] uppercase tracking-[1.5px] text-[#8A867D] hover:text-[#1C1917] transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-[13px] uppercase tracking-[1.5px] text-[#8A867D] hover:text-[#1C1917] transition-colors"
          >
            Stories
          </a>
          {authSession ? (
            <Link to="/dashboard">
              <Button size="sm">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Start Writing</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-12 pt-24 pb-20 border-b border-[#1C1917]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] uppercase tracking-[3px] text-[#C29F60] mb-6">
            A digital journal for serious writers
          </p>
          <h1
            className="text-[80px] font-bold leading-[1.0] mb-8 max-w-4xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Where your thoughts
            <br />
            <em className="font-normal italic">deserve to live.</em>
          </h1>
          <p className="text-[20px] text-[#8A867D] leading-[1.7] max-w-xl mb-12">
            Folio is a premium journaling environment — editorial typography,
            calm aesthetics, and tools that deepen self-understanding over time.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/journal/new">
              <Button size="lg">Begin Your Journal — Free</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg">
                See the Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sample entry preview ── */}
      <section className="px-12 py-20 border-b border-[#1C1917] bg-[#F2EFE9]">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[3px] text-[#8A867D] mb-6">
            From the archive
          </p>
          <h2
            className="text-[44px] font-bold leading-[1.1] mb-6 text-[#1C1917]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            On the Stillness Before Dawn
          </h2>
          <p className="text-[18px] leading-[1.85] text-[#8A867D] mb-4">
            There is a particular quality to the silence at 5 in the morning
            that I have been thinking about all week. It is not the absence of
            sound — it is the presence of something deeper, a held breath the
            world takes before committing to another day.
          </p>
          <div className="flex gap-6 items-center border-t border-[#1C1917] pt-5 mt-6">
            <span className="text-[12px] uppercase tracking-[1.5px] text-[#8A867D]">
              May 21, 2026
            </span>
            <span className="px-3 py-1 border border-blue-300 text-blue-700 text-[11px] uppercase tracking-[1.5px]">
              Reflective
            </span>
            <span className="text-[12px] text-[#8A867D]">148 words</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-12 py-20 border-b border-[#1C1917]">
        <p className="text-[11px] uppercase tracking-[3px] text-[#C29F60] mb-4 max-w-6xl mx-auto">
          What's inside
        </p>
        <h2
          className="text-[48px] font-bold leading-[1.1] mb-16 max-w-6xl mx-auto"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Built for the long practice
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-3 border-t border-l border-[#1C1917]">
          {FEATURES.map((f) => (
            <div key={f.num} className="p-8 border-b border-r border-[#1C1917]">
              <p className="text-[11px] uppercase tracking-[2px] text-[#C29F60] mb-4">
                {f.num}
              </p>
              <h3
                className="text-[22px] font-bold mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {f.title}
              </h3>
              <p className="text-[15px] text-[#8A867D] leading-[1.7]">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        className="px-12 py-20 border-b border-[#1C1917] bg-[#F2EFE9]"
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[3px] text-[#8A867D] mb-16">
            From writers who stayed
          </p>
          <div className="grid grid-cols-3 gap-0 border-l border-t border-[#1C1917]">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-8 border-b border-r border-[#1C1917]"
              >
                <p
                  className="text-[22px] italic leading-[1.4] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  "{t.quote}"
                </p>
                <p className="text-[13px] font-medium text-[#1C1917]">
                  {t.name}
                </p>
                <p className="text-[12px] text-[#8A867D]">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-12 py-24 text-center">
        <p
          className="text-[64px] font-bold leading-[1.05] mb-8 mx-auto max-w-2xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Begin today.
          <em className="font-normal italic block">Your words are waiting.</em>
        </p>
        <Link to="/journal/new">
          <Button size="lg">Create Your Free Journal</Button>
        </Link>
        <p className="text-[13px] text-[#8A867D] mt-5">
          No credit card. No algorithm. Just writing.
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1C1917] px-12 py-8 flex justify-between items-center">
        <span
          className="font-bold text-[18px]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Folio
        </span>
        <p className="text-[12px] text-[#8A867D] uppercase tracking-[1.5px]">
          © 2026 Folio — Private by design
        </p>
      </footer>
    </div>
  );
}
