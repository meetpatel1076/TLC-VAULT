import React from "react";

const AdminStatCard = ({
  label,
  value,
  secondary,
  icon: Icon,
  loading = false,
}) => {
  return (
    <div
      className="
        min-w-0
        rounded-xl
        border border-zinc-800
        bg-zinc-900/60
        px-3.5 py-4
        sm:px-4 sm:py-4.5
        lg:px-5 lg:py-5
        transition-colors duration-200
        hover:border-zinc-700
      "
    >
      <div className="flex items-start justify-between gap-2.5">

        {/* CONTENT */}
        <div className="min-w-0 flex-1">

          <p
            className="
              truncate
              text-[10px]
              font-medium
              uppercase
              tracking-[0.08em]
              text-zinc-500
              sm:text-[11px]
            "
          >
            {label}
          </p>

          <div className="mt-2.5 sm:mt-3">

            {loading ? (
              <div className="h-7 w-16 animate-pulse rounded bg-zinc-800 sm:h-8 sm:w-20" />
            ) : (
              <p
                className="
                  text-[24px]
                  font-medium
                  leading-none
                  tracking-[-0.035em]
                  text-[#f6f1e8]
                  sm:text-[28px]
                  lg:text-3xl
                "
              >
                {value}
              </p>
            )}

          </div>

          {secondary && !loading && (
            <p className="mt-2 text-[10px] text-zinc-600 sm:text-[11px]">
              {secondary}
            </p>
          )}

        </div>

        {/* ICON */}
        {Icon && (
          <Icon
            size={16}
            strokeWidth={1.6}
            className="
              mt-0.5
              shrink-0
              text-zinc-400
              sm:size-[17px]
              lg:size-[18px]
            "
          />
        )}

      </div>
    </div>
  );
};

export default AdminStatCard;