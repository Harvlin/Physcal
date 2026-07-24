/**
 * PhyscalAlert — Standardized alert/banner component using cva variants.
 * 
 * Replaces the existing shadcn default/destructive alert with Physcal's
 * design-token-aware variants: warning, info, and success.
 *
 * Usage:
 *   <PhyscalAlert variant="warning" icon={ShieldAlert} title="Manual review needed">
 *     Description text here.
 *   </PhyscalAlert>
 */

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { useColors } from "@/hooks/useColors";

export type AlertVariant = "warning" | "info" | "success";

interface PhyscalAlertProps {
  variant: AlertVariant;
  icon?: LucideIcon;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export function PhyscalAlert({ variant, icon: Icon, title, children, className }: PhyscalAlertProps) {
  const c = useColors();

  const styles = React.useMemo(() => {
    switch (variant) {
      case "warning":
        return {
          background: c.exuberantBg,
          border: `1px solid ${c.exuberant}26`,
          iconColor: c.exuberant,
          titleColor: c.exuberant,
          textColor: c.textSecondary,
        };
      case "info":
        return {
          background: c.violetBg,
          border: `1px solid ${c.violet}26`,
          iconColor: c.violet,
          titleColor: c.violet,
          textColor: c.textSecondary,
        };
      case "success":
        return {
          background: c.sunGlareBg,
          border: `1px solid ${c.sunGlare}26`,
          iconColor: c.sunGlare,
          titleColor: c.sunGlare,
          textColor: c.textSecondary,
        };
    }
  }, [variant, c]);

  return (
    <div
      role="alert"
      className={`rounded-2xl px-4 py-3 flex items-start gap-3 text-[13px] font-medium ${className ?? ""}`}
      style={{
        background: styles.background,
        border: styles.border,
      }}
    >
      {Icon && (
        <Icon
          size={15}
          className="flex-shrink-0 mt-0.5"
          style={{ color: styles.iconColor }}
          aria-hidden="true"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[13px]" style={{ color: styles.titleColor }}>
          {title}
        </div>
        {children && (
          <div className="mt-0.5 leading-relaxed" style={{ color: styles.textColor }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
