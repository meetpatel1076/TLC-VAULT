import React, { useEffect, useState } from "react";
import { Flame, Trophy, LockKeyhole, LoaderCircle } from "lucide-react";
import api from "../../services/api";

import bootedBadge from "../../assets/badges/1.png";
import loopedBadge from "../../assets/badges/2.png";
import committedBadge from "../../assets/badges/3.png";
import persistentBadge from "../../assets/badges/4.png";
import vaultboundBadge from "../../assets/badges/5.png";
import unbrokenBadge from "../../assets/badges/6.png";

const BADGE_ART = {
  booted: bootedBadge,
  looped: loopedBadge,
  commited: committedBadge,
  committed: committedBadge,
  persistent: persistentBadge,
  vaultbound: vaultboundBadge,
  unbroken: unbrokenBadge,
};

const ConsistencyHub = ({ summary }) => {
  const streak = summary?.streak;
  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;

  const [badgeData, setBadgeData] = useState(null);
  const [badgesLoading, setBadgesLoading] = useState(true);
  const [badgeError, setBadgeError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchBadges = async () => {
      try {
        const response = await api.get("/badges");
        if (active) {
          setBadgeData(response.data);
          setBadgeError(false);
        }
      } catch (error) {
        console.error("Failed to fetch badges:", error);
        if (active) setBadgeError(true);
      } finally {
        if (active) setBadgesLoading(false);
      }
    };

    fetchBadges();
    return () => {
      active = false;
    };
  }, []);

  const badges = badgeData?.badges || [];
  const unlockedCount =
    badgeData?.summary?.unlocked ??
    badges.filter((badge) => badge.unlocked).length;

  return (
    <section className="h-full min-w-0 overflow-hidden rounded-2xl border border-[#252830] bg-[#111318]/80">
      <div className="flex items-center justify-between gap-3 border-b border-[#252830] px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <Flame size={17} className="shrink-0 text-[#f64f12]" fill="currentColor" />
          <p className="truncate text-[15px] font-medium text-[#f6f1e8]">
            Consistency Hub
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-[#30343d] bg-[#191c22] px-2.5 py-1 text-[11px] text-[#a6abb5]">
          {unlockedCount}/{badges.length || 6} unlocked
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center ">
              <Flame size={27} strokeWidth={2} className="text-[#f64f12]" fill="currentColor" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-semibold leading-none text-[#f6f1e8]">
                {currentStreak}
                <span className="ml-1.5 text-xs font-normal text-[#858b98]">
                  {currentStreak === 1 ? "day" : "days"}
                </span>
              </p>
              <p className="mt-1.5 text-xs text-[#858b98]">Current streak</p>
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-[#252830] bg-[#0b0d11] px-3 py-2.5 text-right sm:px-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#666b75]">
              Personal best
            </p>
            <p className="mt-1 text-base font-semibold text-[#f6f1e8]">
              {longestStreak}
              <span className="ml-1 text-xs font-normal text-[#858b98]">days</span>
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-[#252830] pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a6abb5]">
                Your achievements
              </p>

            </div>

          </div>

          {badgesLoading ? (
            <div className="flex min-h-24 items-center justify-center gap-2 text-xs text-[#858b98]">
              <LoaderCircle size={15} className="animate-spin" />
              Loading badges…
            </div>
          ) : badgeError ? (
            <div className="rounded-xl border border-dashed border-[#30343d] px-4 py-6 text-center text-xs text-[#858b98]">
              Couldn't load badges. Refresh the page to try again.
            </div>
          ) : badges.length ? (
            <div className="flex min-w-0 gap-3 overflow-x-auto overscroll-x-contain pb-3 pr-1 [scrollbar-width:thin] [scrollbar-color:#3b404b_transparent]">
              {badges.map((badge) => {
                const progressCurrent = badge.progress?.current ?? 0;
                const progressRequired =
                  badge.progress?.required ?? badge.requirement?.value ?? 0;
                const badgeImage = BADGE_ART[badge.key];

                return (
                  <div
                    key={badge.key}
                    title={`${badge.name}: ${badge.description || ""}${badge.unlocked ? " Unlocked!" : ` Progress: ${progressCurrent}/${progressRequired}`}`}

                  >
                    <div className="relative flex h-[75px] w-[75px] shrink-0 items-center justify-center sm:h-[68px] sm:w-[68px]">
                      {badgeImage ? (
                        <img
                          src={badgeImage}
                          alt={badge.name}
                          loading="lazy"
                          className={`block h-full w-full object-contain transition duration-200 ${badge.unlocked
                            ? ""
                            : "grayscale opacity-35"
                            }`}
                          onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                          }}
                        />
                      ) : (
                        <Trophy size={28} className="text-[#666b75]" />
                      )}
                      {!badge.unlocked && (
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full  text-[#858b98]">
                          <LockKeyhole size={10} />
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-2 w-full truncate text-center text-[10px] font-semibold tracking-wide sm:text-[11px] ${badge.unlocked ? "text-[#e7e2d9]" : "text-[#777d88]"
                        }`}
                    >
                      {badge.name}
                    </p>
                    <p className="mt-1 text-center text-[10px] tabular-nums text-[#666b75]">
                      {badge.unlocked
                        ? "Achieved"
                        : `${progressCurrent}/${progressRequired}`}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#30343d] px-4 py-6 text-center">
              <Trophy size={22} className="mx-auto text-[#666b75]" />
              <p className="mt-2 text-xs text-[#858b98]">
                No badges are available yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ConsistencyHub;
