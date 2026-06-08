import { useTheme } from "./useTheme";

/**
 * Returns theme-aware colour values for use in inline style props.
 * All values switch automatically when toggling dark ↔ light.
 */
export function useColors() {
  const { isDark } = useTheme();

  return {
    /* Text */
    textPrimary:   isDark ? "#F2F0E9"                  : "#1C1C1A",
    textSecondary: isDark ? "rgba(242,240,233,0.65)"   : "rgba(28,28,26,0.65)",
    textTertiary:  isDark ? "rgba(242,240,233,0.45)"   : "rgba(28,28,26,0.45)",
    textDisabled:  isDark ? "rgba(242,240,233,0.25)"   : "rgba(28,28,26,0.25)",

    /* Brand — same in both modes; light uses slightly deeper versions */
    sunGlare:     isDark ? "#D6E800" : "#A8B800",
    exuberant:    "#F5522A",
    violet:       "#6B5FC3",
    violetLight:  isDark ? "#9B8EE6" : "#8577D0",

    /* Accent backgrounds */
    sunGlareBg:   isDark ? "rgba(214,232,0,0.1)"   : "rgba(168,184,0,0.12)",
    exuberantBg:  isDark ? "rgba(245,82,42,0.12)"  : "rgba(245,82,42,0.1)",
    violetBg:     isDark ? "rgba(107,95,195,0.12)" : "rgba(107,95,195,0.1)",

    /* Surfaces */
    chipBg:       isDark ? "rgba(242,240,233,0.07)" : "rgba(28,28,26,0.06)",
    chipBorder:   isDark ? "rgba(242,240,233,0.12)" : "rgba(28,28,26,0.1)",
    inputBg:      isDark ? "rgba(242,240,233,0.05)" : "rgba(255,255,255,0.7)",
    inputBorder:  isDark ? "rgba(242,240,233,0.1)"  : "rgba(28,28,26,0.1)",
    divider:      isDark ? "rgba(242,240,233,0.07)" : "rgba(28,28,26,0.07)",

    /* Exercise / tag chips */
    exerciseChipBg:     isDark ? "rgba(242,240,233,0.07)" : "rgba(28,28,26,0.06)",
    exerciseChipColor:  isDark ? "rgba(242,240,233,0.7)"  : "rgba(28,28,26,0.7)",
    exerciseChipBorder: isDark ? "rgba(242,240,233,0.08)" : "rgba(28,28,26,0.08)",

    /* Nav */
    navActive:    isDark ? { background: "#D6E800", color: "#1C1C1A" }
                        : { background: "#A8B800", color: "#FFFFFF" },
    navInactive:  isDark ? "rgba(242,240,233,0.5)" : "rgba(28,28,26,0.45)",

    /* Coach M avatar */
    coachAvatarBg:    isDark ? "#6B5FC3" : "#6B5FC3",
    coachAvatarColor: "#F2F0E9",

    /* Hover states for ghost buttons */
    hoverBg:   isDark ? "rgba(242,240,233,0.07)" : "rgba(28,28,26,0.05)",
    activeBg:  isDark ? "rgba(242,240,233,0.04)" : "rgba(28,28,26,0.04)",

    /* SideNav */
    sideNavActiveBg:    isDark ? "#D6E800"                  : "#A8B800",
    sideNavActiveColor: isDark ? "#1C1C1A"                  : "#FFFFFF",
    sideNavInactive:    isDark ? "rgba(242,240,233,0.65)"   : "rgba(28,28,26,0.6)",
    sideNavBeta:        isDark ? "rgba(214,232,0,0.06)"     : "rgba(168,184,0,0.08)",
    sideNavBetaBorder:  isDark ? "rgba(214,232,0,0.12)"     : "rgba(168,184,0,0.15)",
    sideNavBetaIcon:    isDark ? "#D6E800"                  : "#A8B800",
    sideNavBetaText:    isDark ? "rgba(242,240,233,0.55)"   : "rgba(28,28,26,0.5)",

    cardBg:    isDark ? "rgba(242,240,233,0.04)" : "rgba(255,255,255,0.7)",

    /* Misc */
    appBg: isDark ? "#1C1C1A" : "#F4F3EE",
    isDark,
  };
}
