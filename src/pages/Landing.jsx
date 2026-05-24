// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../components/ui";
import { useJournal } from "../context/JournalStore";
import { Menu, X } from "lucide-react";

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
    title: "Analytics & Insights",
    body: "Visualise your consistency, mood history, and writing volume across weeks and months.",
  },
  {
    num: "04",
    title: "Calendar View",
    body: "Navigate your archive by date. Every day you wrote is a door worth opening again.",
  },
  {
    num: "05",
    title: "Secure Cloud Sync",
    body: "Keep your journal safe and accessible across all your devices with Google-powered sync.",
  },
  {
    num: "06",
    title: "Local-First Storage",
    body: "Your words are stored on your device first. Fast, reliable, and available even when you're offline.",
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <nav className="flex justify-between items-center px-6 lg:px-12 py-5 border-b border-[#1C1917] sticky top-0 bg-[#FBF9F6] z-50">
        <span
          className="font-bold text-[20px]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Folio
        </span>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
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
              <Link to="/journal/new">
                <Button size="sm">Start Writing</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-[#1C1917]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#FBF9F6] border-b border-[#1C1917] p-6 flex flex-col gap-6 md:hidden shadow-xl">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] uppercase tracking-[1.5px] text-[#8A867D]"
            >
              Features
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[14px] uppercase tracking-[1.5px] text-[#8A867D]"
            >
              Stories
            </a>
            {authSession ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link
                  to="/journal/new"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">Start Writing</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 lg:px-12 pt-16 lg:pt-24 pb-16 lg:pb-20 border-b border-[#1C1917]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] uppercase tracking-[3px] text-[#C29F60] mb-6">
            A digital journal for serious writers
          </p>
          <h1
            className="text-[40px] md:text-[60px] lg:text-[80px] font-bold leading-[1.1] md:leading-[1.0] mb-8 max-w-4xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Where your thoughts
            <br className="hidden md:block" />
            <em className="font-normal italic"> deserves to live.</em>
          </h1>
          <p className="text-[16px] md:text-[20px] text-[#8A867D] leading-[1.7] max-w-xl mb-12">
            Folio is a premium journaling environment — editorial typography,
            calm aesthetics, and tools that deepen self-understanding over time.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/journal/new" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Begin Your Journal — Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sample entry preview ── */}
      <section className="px-6 lg:px-12 py-16 lg:py-20 border-b border-[#1C1917] bg-[#F2EFE9]">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[3px] text-[#8A867D] mb-6">
            From the archive
          </p>
          <h2
            className="text-[32px] md:text-[44px] font-bold leading-[1.1] mb-6 text-[#1C1917]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            On the Stillness Before Dawn
          </h2>
          <p className="text-[16px] md:text-[18px] leading-[1.85] text-[#8A867D] mb-4">
            There is a particular quality to the silence at 5 in the morning
            that I have been thinking about all week. It is not the absence of
            sound — it is the presence of something deeper, a held breath the
            world takes before committing to another day.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 items-center border-t border-[#1C1917] pt-5 mt-6">
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
      <section
        id="features"
        className="px-6 lg:px-12 py-16 lg:py-20 border-b border-[#1C1917]"
      >
        <p className="text-[11px] uppercase tracking-[3px] text-[#C29F60] mb-4 max-w-6xl mx-auto">
          What's inside
        </p>
        <h2
          className="text-[36px] md:text-[48px] font-bold leading-[1.1] mb-12 lg:mb-16 max-w-6xl mx-auto"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Built for the long practice
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t md:border-l border-[#1C1917]">
          {FEATURES.map((f) => (
            <div
              key={f.num}
              className="p-8 border-b border-[#1C1917] md:border-r"
            >
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
        className="px-6 lg:px-12 py-16 lg:py-20 border-b border-[#1C1917] bg-[#F2EFE9]"
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[3px] text-[#8A867D] mb-12 lg:mb-16">
            From writers who stayed
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-[#1C1917] md:border-l">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="p-8 border-b border-[#1C1917] md:border-r"
              >
                <p
                  className="text-[20px] md:text-[22px] italic leading-[1.4] mb-6"
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
      <section className="px-6 py-24 text-center">
        <p
          className="text-[40px] md:text-[64px] font-bold leading-[1.1] md:leading-[1.05] mb-8 mx-auto max-w-2xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Begin today.
          <em className="font-normal italic block">Your words are waiting.</em>
        </p>
        <Link to="/journal/new">
          <Button size="lg" className="w-full sm:w-auto">
            Start Writing for Free
          </Button>
        </Link>
        <p className="text-[13px] text-[#8A867D] mt-5">
          No credit card. No algorithm. Just writing.
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1C1917] px-6 lg:px-12 py-8 flex flex-col md:row justify-between items-center gap-6">
        <span
          className="font-bold text-[18px]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Folio
        </span>
        <p className="text-[12px] text-[#8A867D] uppercase tracking-[1.5px] text-center">
          © 2026 Folio — Private by design
        </p>
      </footer>
    </div>
  );
}
