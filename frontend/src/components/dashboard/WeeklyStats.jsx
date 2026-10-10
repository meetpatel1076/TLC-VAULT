
import React from "react";
import {
  Activity,
  FilePlus2,
  FolderPlus,
} from "lucide-react";

const WeeklyStats = ({ summary }) => {
  const weekly = summary?.weeklyActivity;

  const activeDays = weekly?.activeDays ?? 0;
  const filesCreated = weekly?.codeFilesCreated ?? 0;
  const filesUpdated = weekly?.codeFilesUpdated ?? 0;
  const reposCreated = weekly?.repositoriesCreated ?? 0;
  const reposUpdated = weekly?.repositoriesUpdated ?? 0;

  return (
    <section className="h-full rounded-2xl border border-[#252830] bg-[#111318]/80  p-6">

      <div className="">
        <p className="text-[18px] font-medium text-[#f6f1e8] border-b border-[#252830]">
          Weekly stats, progress
        </p>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#717784]">
          All the progress done over this week, including
          Language, CodeFiles, Repos.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-3">

        <div className="rounded-xl border border-[#252830] bg-[#0e1015]/70 p-4">
          <Activity
            size={17}
            className="text-[#f64f12]"
          />

          <p className="mt-4 text-2xl font-medium text-[#f6f1e8]">
            {activeDays}
          </p>

          <p className="mt-1 text-xs text-[#717784]">
            Active days
          </p>
        </div>

        <div className="rounded-xl border border-[#252830] bg-[#0e1015]/70 p-4">
          <FilePlus2
            size={17}
            className="text-[#f64f12]"
          />

          <p className="mt-4 text-2xl font-medium text-[#f6f1e8]">
            {filesCreated + filesUpdated}
          </p>

          <p className="mt-1 text-xs text-[#717784]">
            File activity
          </p>
        </div>

        <div className="rounded-xl border border-[#252830] bg-[#0e1015]/70 p-4">
          <FolderPlus
            size={17}
            className="text-[#f64f12]"
          />

          <p className="mt-4 text-2xl font-medium text-[#f6f1e8]">
            {reposCreated + reposUpdated}
          </p>

          <p className="mt-1 text-xs text-[#717784]">
            Repo activity
          </p>
        </div>

      </div>

    </section>
  );
};

export default WeeklyStats;
