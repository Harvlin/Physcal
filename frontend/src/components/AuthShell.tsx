import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useColors } from "@/hooks/useColors";

const Logo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M16 4 L28 28 L22 28 L16 14 L10 28 L4 28 Z" fill="currentColor" />
    <path d="M11.5 22 L20.5 22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export function AuthShell({ children }: { children: ReactNode }) {
  const c = useColors();
  return (
    <div
      className="min-h-dvh font-sans relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 70% 50% at 50% -10%, ${c.sunGlareBg} 0%, transparent 55%), linear-gradient(175deg, ${c.isDark ? '#1E1E1B' : '#FFFFFF'} 0%, ${c.isDark ? '#181816' : '#F4F3EE'} 100%)`,
      }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: "500px",
          height: "500px",
          top: "-120px",
          right: "-150px",
          background: `radial-gradient(circle, ${c.violetBg} 0%, transparent 70%)`,
          borderRadius: "9999px",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: "400px",
          height: "400px",
          bottom: "-100px",
          left: "-100px",
          background: `radial-gradient(circle, ${c.exuberantBg} 0%, transparent 70%)`,
          borderRadius: "9999px",
        }}
      />

      <Link
        to="/"
        className="absolute top-5 left-5 z-20 size-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
        style={{
          background: c.chipBg,
          border: `1px solid ${c.chipBorder}`,
          color: c.textSecondary,
        }}
        aria-label="Back home"
      >
        <ArrowLeft size={16} />
      </Link>

      <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-5 py-12">
        <div className="flex items-center gap-2.5 mb-8" style={{ color: c.sunGlare }}>
          <Logo size={26} />
          <span className="font-bold text-xl tracking-tight" style={{ color: c.textPrimary }}>Physcal</span>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-strong rounded-3xl p-8 w-full max-w-md"
          style={{ borderColor: c.divider }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function AuthInput({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  rightSlot,
  error,
  c,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  rightSlot?: ReactNode;
  error?: boolean;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <div className="relative">
      <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: c.textTertiary }} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`w-full h-12 rounded-xl pl-10 ${
          rightSlot ? "pr-12" : "pr-4"
        } text-sm outline-none transition-all`}
        style={{
          background: c.inputBg,
          border: error
            ? `1px solid ${c.exuberant}99`
            : `1px solid ${c.inputBorder}`,
          color: c.textPrimary,
          boxShadow: error ? `0 0 0 3px ${c.exuberantBg}` : "none",
        }}
        onFocus={e => {
          if (!error) {
            e.currentTarget.style.borderColor = `${c.sunGlare}80`;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${c.sunGlareBg}`;
          }
        }}
        onBlur={e => {
          if (!error) {
            e.currentTarget.style.borderColor = c.inputBorder;
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      />
      {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>}
    </div>
  );
}

export function AuthLabel({ children, c }: { children: ReactNode; c: ReturnType<typeof useColors> }) {
  return (
    <label
      className="text-xs font-semibold mb-1.5 block"
      style={{ color: c.textSecondary }}
    >
      {children}
    </label>
  );
}
