// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useJournal } from "../context/JournalStore";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useJournal();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    try {
      const res = await signIn(form.email, form.password);
      if (res.error) {
        setErrors({ form: res.error.message || "Sign in failed" });
        setLoading(false);
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setErrors({ form: err instanceof Error ? err.message : String(err) });
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  const set = (field) => (ev) => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <div
      className="min-h-screen bg-[#FBF9F6] flex"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── Left: editorial panel ── */}
      <div className="hidden lg:flex w-[45%] bg-[#1A3626] flex-col justify-between p-16">
        <Link to="/">
          <span
            className="font-bold text-[22px] text-[#FBF9F6]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Folio
          </span>
        </Link>
        <div>
          <p className="text-[11px] uppercase tracking-[3px] text-[#C29F60] mb-6">
            From the archive
          </p>
          <blockquote
            className="text-[32px] font-normal italic leading-[1.3] text-[#FBF9F6] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "The journal is the only place where I am never interrupted."
          </blockquote>
          <p className="text-[14px] text-[#FBF9F6]/60 uppercase tracking-[1.5px]">
            — A Folio writer
          </p>
        </div>
        <p className="text-[12px] text-[#FBF9F6]/40 uppercase tracking-[1.5px]">
          © 2026 Folio
        </p>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-24">
        <div className="max-w-sm w-full mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link to="/">
              <span
                className="font-bold text-[22px] text-[#1C1917]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Folio
              </span>
            </Link>
          </div>

          <p className="text-[11px] uppercase tracking-[3px] text-[#C29F60] mb-3">
            Welcome back
          </p>
          <h1
            className="text-[36px] font-bold text-[#1C1917] mb-8 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sign in to your journal
          </h1>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full h-11 flex items-center justify-center gap-3 border border-[#1C1917] bg-transparent text-[#1C1917] font-sans text-[14px] hover:bg-[#F2EFE9] transition-colors cursor-pointer mb-6"
          >
            <GoogleIcon />
            {loading ? "Connecting..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-[#F2EFE9]" />
            <span className="text-[12px] uppercase tracking-[1.5px] text-[#8A867D]">
              or
            </span>
            <div className="flex-1 border-t border-[#F2EFE9]" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errors.form && (
              <p className="text-red-500 text-[13px]">{errors.form}</p>
            )}
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
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              error={errors.password}
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="font-sans text-[13px] text-[#8A867D] hover:text-[#1C1917] bg-transparent border-none cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <Button size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-[14px] text-[#8A867D] mt-8">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#1A3626] font-medium hover:underline"
            >
              Create one free
            </Link>
          </p>
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
