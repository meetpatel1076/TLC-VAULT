import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateProject = ({ fetchProjects, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleCreateProject = async () => {
    if (!title.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/repositories", {
        name: title.trim(),
        description: description.trim(),
      });

      const newProject = response.data.repository;

      console.log("CREATED PROJECT:", newProject);

      // Refresh sidebar
      await fetchProjects();

      // Go to the newly created project
      navigate(`/repo/${newProject._id}`);

    } catch (error) {
      console.error(
        "Failed to create project:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 pb-10 flex justify-center">

      <div
        className={`
          w-130 max-w-3xl
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
          onClick={() => {
            if (!user) {
              navigate("/login");
              return;
            }

            setIsOpen(!isOpen);
          }}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="
    w-full h-11 px-4
    rounded-lg
    border border-[#30343d]
    bg-primary
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              disabled={loading}
              className="
    h-10 px-5
    rounded-lg
    bg-[#f64f12]
    text-black
    text-sm font-medium
    hover:bg-[#f36631]
    transition
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
              onClick={handleCreateProject}
            >
              {loading ? "Creating..." : "Create Project"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CreateProject;