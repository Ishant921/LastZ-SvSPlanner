import React from "react";
import { useMediaQuery } from "../../core/hooks/useMediaQuery";
import SvsPlannerDesktop from "./SvsPlannerDesktop";
import SvsPlannerMobile from "./SvsPlannerMobile";

/**
 * SvS Planner entry point.
 * Detects screen size and renders the appropriate version.
 *
 * Desktop: Floating panels, full canvas
 * Mobile: Bottom bar, full-screen panels, touch-optimized
 */
export default function SvsPlanner() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? <SvsPlannerMobile /> : <SvsPlannerDesktop />;
}
