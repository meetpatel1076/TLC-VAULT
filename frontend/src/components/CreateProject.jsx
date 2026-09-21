import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="px-10 pb-10 flex justify-center">

      <div
        className={`
          w-full max-w-3xl
          rounded-2xl
          border border-[#30343d]
          bg-[#111318]/90
          backdrop-blur-sm
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-[500px]" : "max-h-[64px]"}
        `}
      >

        {/* BUTTON / HEADER */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-16 px-5 flex items-center gap-3 text-white bg-[#f64f12] transition"
        >

          {isOpen ? (
            <X size={20} />
          ) : (
            <Plus size={20} />
          )}

          <span className="font-medium">
            {isOpen ? "Create Project" : "New Project"}
          </span>

        </button>


        {/* FORM */}
        <div
          className={`
            px-5 pb-5 pt-3
            transition-all duration-300
            ${isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
            }
          `}
        >

          <div className="space-y-4">

            {/* Title */}
            <div>
              <label className="block mb-2 text-sm text-[#9ca3af]">
                Project title
              </label>

              <input
                type="text"
                placeholder="e.g. Portfolio Website"
                className="
                  w-full h-11 px-4
                  rounded-lg
                  border border-[#30343d]
                  bg-[#0e1015]
                  text-white
                  placeholder:text-[#666b75]
                  outline-none
                  focus:border-[#555b66]
                "
              />
            </div>


            {/* Description */}
            <div>
              <label className="block mb-2 text-sm text-[#9ca3af]">
                Description
              </label>

              <textarea
                rows={4}
                placeholder="What is this project about?"
                className="
                  w-full px-4 py-3
                  rounded-lg
                  border border-[#30343d]
                  bg-[#0e1015]
                  text-white
                  placeholder:text-[#666b75]
                  outline-none
                  resize-none
                  focus:border-[#555b66]
                "
              />
            </div>


            {/* Create */}
            <button
              className="
                h-10 px-5
                rounded-lg
                bg-[#f64f12]
                text-black
                text-sm font-medium
                hover:bg-[#f36631]
                transition
              "
              onClick={()=>navigate("/repo")}
            >
              Create Project
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CreateProject;