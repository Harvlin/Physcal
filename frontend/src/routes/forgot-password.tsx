import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { AuthShell, AuthInput, AuthLabel } from "@/components/AuthShell";
import { useColors } from "@/hooks/useColors";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Physcal" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const c = useColors();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthShell>
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="form" exit={{ opacity: 0 }}>
            <h1 className="text-2xl font-medium" style={{ color: c.textPrimary }}>
              Reset your password
            </h1>
            <p className="text-sm mt-1.5" style={{ color: c.textSecondary }}>
              Enter your email and we'll send you a reset link.
            </p>
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
                />
              </div>
              <button
                type="submit"
                disabled={!email || loading}
                className="w-full h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                style={{
                  background: c.sunGlare,
                  color: "#1C1C1A",
                  boxShadow: `0 0 16px ${c.sunGlareBg}`,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
            <p className="text-sm text-center mt-6" style={{ color: c.textSecondary }}>
              Remembered?{" "}
              <Link
                to="/login"
                className="hover:underline font-medium"
                style={{ color: c.sunGlare }}
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <div
              className="w-14 h-14 rounded-full grid place-items-center mx-auto mb-5"
              style={{ background: c.violetBg }}
            >
              <CheckCircle size={24} style={{ color: c.violet }} />
            </div>
            <h1 className="text-2xl font-medium" style={{ color: c.textPrimary }}>
              Check your email
            </h1>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: c.textSecondary }}>
              We sent a reset link to <span style={{ color: c.textPrimary }}>{email}</span>. The
              link expires in 1 hour.
            </p>
            <Link
              to="/login"
              className="inline-block mt-7 text-sm hover:underline font-medium"
              style={{ color: c.sunGlare }}
            >
              Back to sign in
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
