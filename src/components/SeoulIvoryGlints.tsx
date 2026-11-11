"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface GlintConfig {
  left: string;
  drift: string;
  fall: string;
  delay: string;
  size: string;
  op: number;
  twinkle: string;
}

const BOKEH_GLINTS: GlintConfig[] = [
  { left: "18%", drift: "22px", fall: "24s", delay: "-0s", size: "56px", op: 0.2, twinkle: "4.2s" },
  { left: "70%", drift: "-26px", fall: "27s", delay: "-8s", size: "70px", op: 0.16, twinkle: "4.8s" },
  { left: "45%", drift: "18px", fall: "22s", delay: "-14s", size: "48px", op: 0.24, twinkle: "3.8s" },
  { left: "88%", drift: "-20px", fall: "26s", delay: "-4s", size: "60px", op: 0.18, twinkle: "4.5s" },
  { left: "8%", drift: "16px", fall: "23s", delay: "-18s", size: "44px", op: 0.22, twinkle: "3.6s" },
];

const SPARKLE_GLINTS: GlintConfig[] = [
  { left: "6%", drift: "14px", fall: "9s", delay: "-0s", size: "6px", op: 0.95, twinkle: "1.8s" },
  { left: "14%", drift: "-10px", fall: "13s", delay: "-3.5s", size: "4px", op: 0.7, twinkle: "2.4s" },
  { left: "23%", drift: "8px", fall: "10.5s", delay: "-1.5s", size: "9px", op: 1, twinkle: "1.5s" },
  { left: "31%", drift: "-16px", fall: "15s", delay: "-6s", size: "5px", op: 0.65, twinkle: "2.2s" },
  { left: "39%", drift: "12px", fall: "8.5s", delay: "-2s", size: "7px", op: 0.9, twinkle: "1.6s" },
  { left: "47%", drift: "-6px", fall: "12s", delay: "-8.5s", size: "4px", op: 0.6, twinkle: "2.6s" },
  { left: "54%", drift: "10px", fall: "11s", delay: "-4.5s", size: "10px", op: 1, twinkle: "1.7s" },
  { left: "63%", drift: "-12px", fall: "14s", delay: "-7s", size: "5px", op: 0.72, twinkle: "2.3s" },
  { left: "76%", drift: "9px", fall: "9.5s", delay: "-1s", size: "8px", op: 0.95, twinkle: "1.55s" },
  { left: "84%", drift: "-8px", fall: "12.5s", delay: "-5.5s", size: "4px", op: 0.62, twinkle: "2.5s" },
  { left: "92%", drift: "15px", fall: "10s", delay: "-9s", size: "7px", op: 0.88, twinkle: "1.9s" },
];

const STAR_GLINTS: GlintConfig[] = [
  { left: "11%", drift: "-14px", fall: "16s", delay: "-2.5s", size: "12px", op: 0.9, twinkle: "2.1s" },
  { left: "35%", drift: "11px", fall: "18s", delay: "-11s", size: "10px", op: 0.8, twinkle: "2.8s" },
  { left: "59%", drift: "-9px", fall: "17s", delay: "-6.5s", size: "14px", op: 0.95, twinkle: "2.4s" },
  { left: "81%", drift: "13px", fall: "19s", delay: "-13.5s", size: "11px", op: 0.85, twinkle: "3s" },
];

function GlintParticle({
  glint,
  shape,
}: {
  glint: GlintConfig;
  shape?: "bokeh" | "star";
}) {
  return (
    <span
      className="si-glint-fall"
      style={
        {
          left: glint.left,
          animationDuration: glint.fall,
          animationDelay: glint.delay,
          "--si-drift": glint.drift,
        } as React.CSSProperties
      }
    >
      <span
        className={`si-glint ${shape ? `si-glint--${shape}` : ""}`}
        style={
          {
            animationDuration: glint.twinkle,
            animationDelay: glint.delay,
            "--si-sz": glint.size,
            "--si-op": glint.op,
          } as React.CSSProperties
        }
      />
    </span>
  );
}

export function SeoulIvoryGlints({ variant }: { variant: "cover" | "page" }) {
  return (
    <div
      className={variant === "cover" ? "si-fall" : "si-fall-global"}
      aria-hidden="true"
    >
      {BOKEH_GLINTS.map((g) => (
        <GlintParticle key={`bokeh-${g.left}`} glint={g} shape="bokeh" />
      ))}
      {SPARKLE_GLINTS.map((g) => (
        <GlintParticle key={`glint-${g.left}`} glint={g} />
      ))}
      {STAR_GLINTS.map((g) => (
        <GlintParticle key={`star-${g.left}`} glint={g} shape="star" />
      ))}
    </div>
  );
}

export function SeoulIvoryPageGlints() {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    const root = document.querySelector("[data-thiep-root]") ?? document.body;
    setTarget(root);
  }, []);

  if (!target) return null;
  return createPortal(<SeoulIvoryGlints variant="page" />, target);
}

