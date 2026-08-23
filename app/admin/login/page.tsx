"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, ArrowRight, Code } from "lucide-react";
import AdminPublicLayout from "../public-layout";

const AdminLoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <AdminPublicLayout>
      {/* ── Full-screen background ── */}
      <div
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
        style={{ background: "linear-gradient(160deg, #0d2a3e 0%, #0a3d55 40%, #083248 70%, #071e30 100%)" }}
      >
        {/* ── Glass water droplets ── */}
        {[
          // big drops
          { s: 110, t: "8%",  l: "6%",  anim: "drop-float",   dur: "9s",  delay: "0s"   },
          { s: 90,  t: "60%", l: "80%", anim: "drop-float-b",  dur: "11s", delay: "1s"   },
          { s: 130, t: "45%", l: "50%", anim: "drop-float-c",  dur: "13s", delay: "2s"   },
          { s: 75,  t: "75%", l: "22%", anim: "drop-float",    dur: "10s", delay: "3.2s" },
          { s: 95,  t: "15%", l: "70%", anim: "drop-float-b",  dur: "8s",  delay: "0.5s" },
          // medium drops
          { s: 55,  t: "30%", l: "38%", anim: "drop-float-c",  dur: "7s",  delay: "1.8s" },
          { s: 60,  t: "82%", l: "60%", anim: "drop-float",    dur: "12s", delay: "4s"   },
          { s: 48,  t: "50%", l: "88%", anim: "drop-float-b",  dur: "8.5s",delay: "2.5s" },
          { s: 65,  t: "18%", l: "28%", anim: "drop-float-c",  dur: "9.5s",delay: "0.8s" },
          { s: 50,  t: "68%", l: "5%",  anim: "drop-float",    dur: "11s", delay: "3s"   },
          // small drops
          { s: 28,  t: "12%", l: "45%", anim: "drop-float-b",  dur: "6s",  delay: "1.2s" },
          { s: 32,  t: "88%", l: "42%", anim: "drop-float-c",  dur: "7.5s",delay: "2.8s" },
          { s: 22,  t: "35%", l: "65%", anim: "drop-float",    dur: "5.5s",delay: "0.3s" },
          { s: 36,  t: "55%", l: "14%", anim: "drop-float-b",  dur: "8s",  delay: "4.5s" },
          { s: 24,  t: "72%", l: "72%", anim: "drop-float-c",  dur: "6.5s",delay: "1.6s" },
          { s: 18,  t: "25%", l: "92%", anim: "drop-float",    dur: "5s",  delay: "3.8s" },
          { s: 30,  t: "90%", l: "90%", anim: "drop-float-b",  dur: "7s",  delay: "0.6s" },
          { s: 20,  t: "42%", l: "3%",  anim: "drop-float-c",  dur: "6s",  delay: "2.2s" },
        ].map((d, i) => (
          <span
            key={i}
            className="drop"
            style={{
              width:  d.s,
              height: d.s,
              top:    d.t,
              left:   d.l,
              animation: `${d.anim} ${d.dur} ease-in-out ${d.delay} infinite`,
            }}
          />
        ))}

        {/* ── Rising water drops (bottom → top) ── */}
        {[
          // large rising drops
          { s: 80,  l: "4%",  anim: "drop-rise",   dur: "14s", delay: "0s"   },
          { s: 65,  l: "12%", anim: "drop-rise-b",  dur: "11s", delay: "2.5s" },
          { s: 90,  l: "22%", anim: "drop-rise-c",  dur: "16s", delay: "1s"   },
          { s: 55,  l: "33%", anim: "drop-rise",    dur: "12s", delay: "4s"   },
          { s: 75,  l: "44%", anim: "drop-rise-b",  dur: "15s", delay: "0.5s" },
          { s: 85,  l: "56%", anim: "drop-rise-c",  dur: "13s", delay: "3s"   },
          { s: 60,  l: "67%", anim: "drop-rise",    dur: "11s", delay: "1.8s" },
          { s: 70,  l: "78%", anim: "drop-rise-b",  dur: "14s", delay: "5s"   },
          { s: 50,  l: "88%", anim: "drop-rise-c",  dur: "10s", delay: "2s"   },
          { s: 80,  l: "96%", anim: "drop-rise",    dur: "13s", delay: "3.5s" },
          // small rising drops
          { s: 28,  l: "8%",  anim: "drop-rise-c",  dur: "8s",  delay: "1.5s" },
          { s: 22,  l: "17%", anim: "drop-rise",    dur: "7s",  delay: "4.5s" },
          { s: 32,  l: "27%", anim: "drop-rise-b",  dur: "9s",  delay: "0.8s" },
          { s: 18,  l: "38%", anim: "drop-rise-c",  dur: "7.5s",delay: "6s"   },
          { s: 26,  l: "49%", anim: "drop-rise",    dur: "8.5s",delay: "2.8s" },
          { s: 30,  l: "61%", anim: "drop-rise-b",  dur: "9s",  delay: "1.2s" },
          { s: 20,  l: "72%", anim: "drop-rise-c",  dur: "7s",  delay: "5.5s" },
          { s: 24,  l: "83%", anim: "drop-rise",    dur: "8s",  delay: "3.2s" },
          { s: 35,  l: "92%", anim: "drop-rise-b",  dur: "10s", delay: "0.3s" },
        ].map((d, i) => (
          <span
            key={`rise-${i}`}
            className="drop-rise"
            style={{
              width:  d.s,
              height: d.s,
              left:   d.l,
              animation: `${d.anim} ${d.dur} linear ${d.delay} infinite`,
            }}
          />
        ))}

        {/* ── Glass card ── */}
        <div
          className="relative z-10 w-full max-w-sm rounded-3xl p-8 text-white"
          style={{
            background: "var(--auth-card-bg)",
            backdropFilter: "var(--auth-card-blur)",
            WebkitBackdropFilter: "var(--auth-card-blur)",
            border: "1px solid var(--auth-card-border)",
            boxShadow: "var(--auth-card-shadow)",
          }}
        >
          {/* Top shine strip */}
          <div
            className="absolute top-0 left-6 right-6 h-px rounded-full"
            style={{ background: "var(--auth-shine)" }}
          />

          {/* Heading */}
          <h1 className="text-[1.6rem] font-bold text-center mb-1 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-center mb-7" style={{ color: "var(--auth-muted-color)" }}>
            Please enter your details to sign in.
          </p>

          <form onSubmit={handleLogin} noValidate>
            {/* Email */}
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--auth-label-color)" }}>
              Email
            </label>
            <div
              className="flex items-center gap-2 rounded-xl px-3.5 mb-4 focus-within:ring-2 focus-within:ring-white/30 transition-all"
              style={{ background: "var(--auth-input-bg)", border: "1px solid var(--auth-input-border)" }}
            >
              <Mail className="w-4 h-4 shrink-0" style={{ color: "var(--auth-icon-color)" }} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent py-3 text-sm focus:outline-none placeholder:text-white/25"
              />
            </div>

            {/* Password */}
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--auth-label-color)" }}>
              Password
            </label>
            <div
              className="flex items-center gap-2 rounded-xl px-3.5 mb-3 focus-within:ring-2 focus-within:ring-white/30 transition-all"
              style={{ background: "var(--auth-input-bg)", border: "1px solid var(--auth-input-border)" }}
            >
              <Lock className="w-4 h-4 shrink-0" style={{ color: "var(--auth-icon-color)" }} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent py-3 text-sm focus:outline-none placeholder:text-white/25"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: "var(--auth-body-color)" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-violet-400 w-4 h-4"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => router.push("/admin/forgot-password")}
                className="text-xs hover:text-white transition-colors"
                style={{ color: "var(--auth-accent-text)" }}
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[var(--text-error)] text-xs mb-3 text-center rounded-lg py-2" style={{ background: "var(--auth-error-bg)" }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 active:scale-[0.98]"
              style={{ background: "var(--auth-btn-bg)", boxShadow: "var(--auth-btn-shadow)" }}
            >
              {loading ? "Signing in…" : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "var(--auth-divider-color)" }} />
              <span className="text-xs" style={{ color: "var(--auth-divider-text)" }}>Or continue with</span>
              <div className="flex-1 h-px" style={{ background: "var(--auth-divider-color)" }} />
            </div>

            {/* Social buttons */}
            <div className="flex gap-3">
              {[Mail, Code].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all active:scale-95"
                  style={{
                    background: "var(--auth-social-bg)",
                    border: "1px solid var(--auth-social-border)",
                    color: "var(--auth-social-color)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Register link */}
            <p className="text-center text-xs mt-6" style={{ color: "var(--auth-dimmed-color)" }}>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/admin/register")}
                className="font-semibold hover:text-white transition-colors"
                style={{ color: "var(--auth-accent-text)" }}
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </AdminPublicLayout>
  );
};

export default AdminLoginPage;
