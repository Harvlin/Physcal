import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, User, Check } from "lucide-react";
import { AuthShell, AuthInput, AuthLabel } from "@/components/AuthShell";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Physcal" }] }),
  component: SignupPage,
});

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const labels = ["", "Weak", "Fair", "Good", "Strong"];

function SignupPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const c = useColors();
  const strengthColors = ["transparent", c.exuberant, "#F5A52A", c.sunGlare, c.sunGlare];
  const s = strength(pw);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    nav({ to: "/onboarding" });
  };

  const canSubmit = name && email && pw.length >= 8 && agreed && !loading;

  return (
    <AuthShell>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-black" style={{ color: c.textPrimary }}>
          Create your account
        </h1>
        <p className="text-sm mt-1.5 font-medium" style={{ color: c.textTertiary }}>
          Start your inclusive sports journey in 60 seconds.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <AuthLabel c={c}>Full name</AuthLabel>
            <AuthInput
              c={c}
              icon={User}
              placeholder="Your name"
              value={name}
              onChange={setName}
              autoComplete="name"
            />
          </div>
          <div>
            <AuthLabel c={c}>Email</AuthLabel>
            <AuthInput
              c={c}
              icon={Mail}
              type="email"
              placeholder="you@physcal.app"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
          </div>
          <div>
            <AuthLabel c={c}>Password</AuthLabel>
            <AuthInput
              c={c}
              icon={Lock}
              type={showPw ? "text" : "password"}
              placeholder="At least 8 characters"
              value={pw}
              onChange={setPw}
              autoComplete="new-password"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="w-8 h-8 grid place-items-center rounded-lg transition-colors"
                  style={{ color: c.textTertiary }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />
            {pw && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-0.5 rounded-full transition-all"
                      style={{ background: i <= s ? strengthColors[s] : c.divider }}
                    />
                  ))}
                </div>
                <span
                  className="text-[11px] w-12 text-right font-semibold"
                  style={{ color: s > 0 ? strengthColors[s] : c.textTertiary }}
                >
                  {labels[s]}
                </span>
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer pt-1">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              aria-checked={agreed}
              role="checkbox"
              className="w-4 h-4 rounded mt-0.5 grid place-items-center flex-shrink-0 transition-all"
              style={{
                background: agreed ? c.sunGlare : "transparent",
                border: agreed ? "none" : `1.5px solid ${c.chipBorder}`,
              }}
            >
              {agreed && <Check size={11} style={{ color: "#1C1C1A" }} strokeWidth={3} />}
            </button>
            <span className="text-xs leading-relaxed" style={{ color: c.textSecondary }}>
              I agree to Physcal's{" "}
              <a href="#" className="font-semibold hover:underline" style={{ color: c.sunGlare }}>
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="font-semibold hover:underline" style={{ color: c.sunGlare }}>
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-35"
            style={{
              background: c.sunGlare,
              color: "#1C1C1A",
              boxShadow: canSubmit ? `0 0 28px ${c.sunGlareBg}` : "none",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Creating your account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: c.textTertiary }}>
          Already have an account?{" "}
          <Link to="/login" className="font-bold" style={{ color: c.sunGlare }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
