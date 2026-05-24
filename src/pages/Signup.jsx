// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useJournal } from "../context/JournalStore";

const STEPS = ["Account", "Your Name", "Writing Goal"];

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    goal: "",
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (ev) => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const GOALS = [
    {
      id: "daily",
      label: "Daily journaling",
      desc: "Write every day, build the habit",
    },
    {
      id: "weekly",
      label: "Weekly reflection",
      desc: "A Sunday ritual of looking back",
    },
    {
      id: "freeform",
      label: "Whenever it calls",
      desc: "No pressure, just a place to return",
    },
    {
      id: "therapy",
      label: "Therapeutic practice",
      desc: "Process emotions with intention",
    },
  ];

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.email) e.email = "Email is required";
      if (!form.password || form.password.length < 8)
        e.password = "Min 8 characters";
    }
    if (step === 1 && !form.name) e.name = "Please tell us your name";
    return e;
  };
  const { signUp, signInWithGoogle: signInWithGoogleProvider } = useJournal();

  const next = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    try {
      const res = await signUp(form.email, form.password);
      setLoading(false);
      if (res.error) {
        setErrors({ form: res.error.message || "Sign up failed" });
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setErrors({ form: err instanceof Error ? err.message : String(err) });
    }
  };

  const handleGoogle = () => {
    setLoading(true);
    signInWithGoogleProvider().catch(() => setLoading(false));
  };

  return (
    <div
      className="min-h-screen bg-[#FBF9F6] flex"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-[45%] bg-[#F2EFE9] flex-col justify-between p-16 border-r border-[#1C1917]">
        <Link to="/">
          <span
            className="font-bold text-[22px] text-[#1C1917]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Folio
          </span>
        </Link>

        {/* Progress steps */}
        <div className="flex flex-col gap-8">
          <p className="text-[11px] uppercase tracking-[3px] text-[#C29F60]">
            Getting started
          </p>
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-start gap-4">
              <div
                className={`w-7 h-7 flex items-center justify-center border text-[12px] font-medium shrink-0 ${
                  i < step
                    ? "bg-[#1A3626] border-[#1A3626] text-[#FBF9F6]"
                    : i === step
                      ? "border-[#1C1917] text-[#1C1917]"
                      : "border-[#8A867D] text-[#8A867D]"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <div className="pt-0.5">
                <p
                  className={`text-[14px] font-medium ${i === step ? "text-[#1C1917]" : "text-[#8A867D]"}`}
                >
                  {s}
                </p>
                {i === step && (
                  <p className="text-[12px] text-[#8A867D] mt-0.5">
                    {
                      [
                        "Create your login credentials",
                        "How shall we address you?",
                        "Set your writing intention",
                      ][i]
                    }
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-[#8A867D] uppercase tracking-[1.5px]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#1A3626] hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-24">
        <div className="max-w-sm w-full mx-auto">
          {/* Step indicator mobile */}
          <p className="lg:hidden text-[11px] uppercase tracking-[2px] text-[#8A867D] mb-6">
            Step {step + 1} of {STEPS.length}
          </p>

          {/* ── Step 0: Credentials ── */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <p className="text-[11px] uppercase tracking-[3px] text-[#C29F60]">
                Create account
              </p>
              <h1
                className="text-[36px] font-bold text-[#1C1917] leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Start writing today
              </h1>

              <button
                onClick={handleGoogle}
                className="w-full h-11 flex items-center justify-center gap-3 border border-[#1C1917] bg-transparent text-[#1C1917] text-[14px] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
              >
                <GoogleIcon />
                Sign up with Google
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-[#F2EFE9]" />
                <span className="text-[12px] uppercase tracking-[1.5px] text-[#8A867D]">
                  or
                </span>
                <div className="flex-1 border-t border-[#F2EFE9]" />
              </div>

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={set("password")}
                error={errors.password}
              />
            </div>
          )}

          {/* ── Step 1: Name ── */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <p className="text-[11px] uppercase tracking-[3px] text-[#C29F60]">
                Almost there
              </p>
              <h1
                className="text-[36px] font-bold text-[#1C1917] leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                What's your name?
              </h1>
              <p className="text-[15px] text-[#8A867D] leading-[1.6]">
                This appears on your journal entries. It can be your real name,
                a pen name, or initials.
              </p>
              <Input
                label="Your name"
                type="text"
                placeholder="e.g. Alex or A.M."
                value={form.name}
                onChange={set("name")}
                error={errors.name}
                autoFocus
              />
            </div>
          )}

          {/* ── Step 2: Goal ── */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <p className="text-[11px] uppercase tracking-[3px] text-[#C29F60]">
                Set your intention
              </p>
              <h1
                className="text-[36px] font-bold text-[#1C1917] leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                How do you want to write?
              </h1>
              <div className="flex flex-col gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setForm((f) => ({ ...f, goal: g.id }))}
                    className={`text-left p-4 border transition-all duration-200 cursor-pointer ${
                      form.goal === g.id
                        ? "border-[#1A3626] bg-[#1A3626] text-[#FBF9F6]"
                        : "border-[#F2EFE9] bg-transparent text-[#1C1917] hover:border-[#1C1917]"
                    }`}
                  >
                    <p className="text-[14px] font-medium">{g.label}</p>
                    <p
                      className={`text-[12px] mt-0.5 ${form.goal === g.id ? "text-[#FBF9F6]/70" : "text-[#8A867D]"}`}
                    >
                      {g.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1"
              onClick={next}
              disabled={loading}
            >
              {loading
                ? "Creating journal…"
                : step === STEPS.length - 1
                  ? "Enter Folio"
                  : "Continue"}
            </Button>
          </div>

          {step === 0 && (
            <p className="text-center text-[14px] text-[#8A867D] mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#1A3626] font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
