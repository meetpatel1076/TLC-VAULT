
import React from "react";
import { Flame, Trophy, CalendarDays, ArrowUpRight } from "lucide-react";

const ConsistencyHub = ({ summary }) => {
  const streak = summary?.streak;

  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;
  const totalActiveDays = streak?.totalActiveDays ?? 0;

  return (
    <section className="h-full rounded-2xl border border-[#252830] bg-[#111318]/80  overflow-hidden">

      {/* Header */}
      <div className="px-5 py-2 border-b border-[#252830]">
        <p className="text-[16px] font-medium text-[#f6f1e8]">
          Consistency Hub
        </p>
      </div>

      <div className="p-5">

        {/* Streak */}
        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="relative w-12 h-12 rounded-xl  flex  justify-center">
              <div className="absolute inset-0 rounded-xl" />

              <Flame
                size={40}
                strokeWidth={2}
                className="relative text-[#f64f12]"
                fill="currentColor"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-[20px] leading-none font-medium text-[#f6f1e8]">
                {currentStreak}
               
              </p>

              <p className="mt-2 text-xs text-[#717784]">
                day streak
              </p>
            </div>

          </div>

          {/* Longest streak */}
          <div className="rounded-xl  bg-[#0e1015] px-3.5 py-2.5 text-right">
            <p className="text-[10px] uppercase tracking-wider text-[#666b75]">
              Longest
            </p>

            <p className="mt-1 text-sm font-medium text-[#f6f1e8]">
              {longestStreak}
              <span className="ml-1 text-xs font-normal text-[#717784]">
                days
              </span>
            </p>
          </div>

        </div>

        {/* Badges */}
        <div className="mt-5 pt-4 border-t border-[#252830]">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-[11px] font-medium text-[#717784] uppercase tracking-wider">
                Badges
              </p>

              <div className="mt-3 flex items-center gap-2.5">

                {/* Replace these with your SVGs later */}
                <div className="w-10 h-10 rounded-xl border border-[#30343d] bg-[#191c22] flex items-center justify-center">
                  <Trophy
                    size={18}
                    className="text-[#f64f12]"
                  />
                </div>

                <div className="w-10 h-10 rounded-xl border border-[#30343d] bg-[#191c22] flex items-center justify-center">
                  <CalendarDays
                    size={18}
                    className="text-[#8b8b91]"
                  />
                </div>

                <div className="w-10 h-10 rounded-xl border border-[#30343d] bg-[#191c22] flex items-center justify-center">
                  <Flame
                    size={18}
                    className="text-[#8b8b91]"
                  />
                </div>

              </div>
            </div>

            {/* See all */}
            <button
              className="
                flex items-center gap-1
                text-xs
                text-[#9ca3af]
                hover:text-white
                transition
              "
            >
              See all
              
            </button>

          </div>

        </div>

      
        

      </div>

    </section>
  );
};

export default ConsistencyHub;
