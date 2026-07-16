import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { AuthShell, AuthInput, AuthLabel } from "@/components/AuthShell";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Physcal" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const c = useColors();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    if (password.length < 4) {
      setLoading(false);
      setError("Those credentials don't match. Try again.");
      setShake((s) => s + 1);
      return;
    }
    nav({ to: "/dashboard" });
  };

  return (
    <AuthShell>
      <motion.div
        key={shake}
        animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-black" style={{ color: c.textPrimary }}>
          Welcome back
        </h1>
        <p className="text-sm mt-1.5 font-medium" style={{ color: c.textTertiary }}>
          Sign in to continue your journey.
        </p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl px-4 py-3 mt-5 flex items-start gap-2.5 text-sm"
              style={{
                border: `1px solid ${c.exuberant}44`,
                background: c.exuberantBg,
                color: c.exuberant,
              }}
            >
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={submit} className="mt-6 space-y-4">
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
              error={!!error}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <AuthLabel c={c}>Password</AuthLabel>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold transition-colors"
                style={{ color: c.textTertiary }}
                onMouseEnter={(e) => (e.currentTarget.style.color = c.sunGlare)}
                onMouseLeave={(e) => (e.currentTarget.style.color = c.textTertiary)}
              >
                Forgot password?
              </Link>
            </div>
            <AuthInput
              c={c}
              icon={Lock}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              error={!!error}
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
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            style={{
              background: c.sunGlare,
              color: "#1C1C1A",
              boxShadow: !loading && email && password ? `0 0 28px ${c.sunGlareBg}` : "none",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px" style={{ background: c.divider }} />
          <span className="text-xs font-medium" style={{ color: c.textTertiary }}>
            or
          </span>
          <span className="flex-1 h-px" style={{ background: c.divider }} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {["Google", "Apple"].map((p) => (
            <button
              key={p}
              className="rounded-xl h-11 text-sm font-semibold transition-all"
              style={{
                background: c.chipBg,
                border: `1px solid ${c.chipBorder}`,
                color: c.textSecondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = c.hoverBg;
                e.currentTarget.style.color = c.textPrimary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = c.chipBg;
                e.currentTarget.style.color = c.textSecondary;
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <p className="text-sm text-center mt-7" style={{ color: c.textTertiary }}>
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold transition-colors" style={{ color: c.sunGlare }}>
            Sign up
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
