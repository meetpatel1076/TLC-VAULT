
import React from "react";
import { FileCode2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContinueWork = ({ summary }) => {
  const navigate = useNavigate();

  const files = summary?.continueWork?.files ?? [];

  return (
    <section className="rounded-2xl border border-[#252830] bg-[#111318]/80 overflow-hidden">
      <div className="px-5 py-4 border-b border-[#252830]">
        <p className="text-[16px] font-medium text-[#f6f1e8]">
          Continue Your Work
        </p>
      </div>

      <div className="p-4 space-y-2.5">
        {files.length === 0 ? (
          <div className="py-8 text-center">
            <FileCode2
              size={20}
              className="mx-auto text-[#555b66]"
            />

            <p className="mt-3 text-sm text-[#717784]">
              No recent files
            </p>
          </div>
        ) : (
          files.slice(0, 4).map((file) => (
            <button
              key={file.id}
              onClick={() => {
                navigate(
                  `/repo/${file.repository.id}?file=${file.id}`
                );
              }}
              className="
                group
                w-full
                flex
                items-center
                justify-between
                gap-3
                rounded-xl
                border
                border-[#30343d]
                bg-[#0e1015]
                px-3
                py-3
                text-left
                hover:border-[#414650]
                hover:bg-[#15171c]
                transition
              "
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileCode2
                  size={16}
                  className="shrink-0 text-[#717784] group-hover:text-[#f64f12] transition"
                />

                <span className="truncate text-sm text-[#9ca3af] group-hover:text-white">
                  {file.name}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
};

export default ContinueWork;
