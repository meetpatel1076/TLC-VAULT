import React, { useEffect, useRef, useState } from "react";
import { Award, ArrowUpRight, X } from "lucide-react";
import bootedImage from "../../assets/badges/1.png";
import loopedImage from "../../assets/badges/2.png";
import commitedImage from "../../assets/badges/3.png";
import persistentImage from "../../assets/badges/4.png";
import vaultboundImage from "../../assets/badges/5.png";
import unbrokenImage from "../../assets/badges/6.png";

const BADGE_IMAGES = {
  booted: bootedImage,
  looped: loopedImage,
  commited: commitedImage,
  persistent: persistentImage,
  vaultbound: vaultboundImage,
  unbroken: unbrokenImage,
};

const BadgeUnlockToast = () => {
  const [queue, setQueue] = useState([]);
  const [visible, setVisible] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleBadgeUnlock = (event) => {
      const badges = event.detail?.badges;
      if (Array.isArray(badges) && badges.length) {
        setQueue((current) => [...current, ...badges]);
      }
    };

    window.addEventListener("tlc:badges-unlocked", handleBadgeUnlock);

    return () => {
      window.removeEventListener("tlc:badges-unlocked", handleBadgeUnlock);
      window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (visible || queue.length === 0) return;
    setVisible(queue[0]);
    setQueue((current) => current.slice(1));
  }, [queue, visible]);

  useEffect(() => {
    if (!visible) return;
    timerRef.current = window.setTimeout(() => setVisible(null), 6200);
    return () => window.clearTimeout(timerRef.current);
  }, [visible]);

  if (!visible) return null;

  const close = () => {
    window.clearTimeout(timerRef.current);
    setVisible(null);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[150] flex justify-center px-3 sm:top-6">
      <section
        role="status"
        aria-live="polite"
        className="badge-unlock-enter pointer-events-auto relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#38312d] bg-[#101114] text-[#f6f1e8] shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
      >
        <div className="h-[3px] w-full bg-[#292a2e]">
          <div className="badge-unlock-progress h-full bg-[#f36631]" />
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss badge notification"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/[0.07] hover:text-[#f6f1e8]"
        >
          <X size={15} />
        </button>

        <div className="flex items-center gap-4 p-4 pr-11 sm:p-5 sm:pr-12">
          <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-xl border border-[#f36631]/25 bg-[#f36631]/[0.07]">
            {BADGE_IMAGES[visible.key] ? (
              <img
                src={BADGE_IMAGES[visible.key]}
                alt={`${visible.name} badge`}
                className="h-[62px] w-[62px] object-contain"
                draggable="false"
              />
            ) : (
              <Award size={30} strokeWidth={1.5} className="text-[#f36631]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f36631]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f36631]">
                Badge unlocked
              </p>
            </div>
            <h2 className="text-lg font-semibold leading-tight tracking-tight">
              {visible.name}
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-zinc-400">
              {visible.description}
            </p>
            <button
              type="button"
              onClick={() => {
                close();
                window.location.assign("/dashboard#badges");
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#f6f1e8] transition hover:text-[#f36631]"
            >
              Keep building <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes badgeUnlockEnter {
          from { opacity: 0; transform: translateY(-14px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes badgeUnlockProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .badge-unlock-enter { animation: badgeUnlockEnter 260ms cubic-bezier(.2,.75,.25,1) both; }
        .badge-unlock-progress { animation: badgeUnlockProgress 6200ms linear both; }
        @media (prefers-reduced-motion: reduce) {
          .badge-unlock-enter, .badge-unlock-progress { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default BadgeUnlockToast;
