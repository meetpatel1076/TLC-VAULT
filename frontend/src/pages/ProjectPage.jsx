import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";

import api from "../services/api";
import CodeEditor from "../components/CodeEditor";

const ProjectPage = () => {
  const { repoId } = useParams();

  const { fetchProjects } = useOutletContext();

  const [project, setProject] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");


  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/repositories/${repoId}`
        );

        console.log("PROJECT:", response.data);

        const projectData = response.data.repository;

        setProject(projectData);

        setTitle(projectData.name);
        setDescription(projectData.description || "");

      } catch (error) {
        console.error(
          "Failed to fetch project:",
          error.response?.data || error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [repoId]);


  const titleChanged =
    project && title !== project.name;

  const descriptionChanged =
    project &&
    description !== (project.description || "");

  const hasChanges =
    titleChanged || descriptionChanged;

  const handleSaveChanges = async () => {
    if (!hasChanges || saving) {
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(
        `/repositories/${repoId}`,
        {
          name: title.trim(),
          description: description.trim(),
        }
      );

      console.log("UPDATED PROJECT:", response.data);

      const updatedProject = response.data.repository;

      // Update current page
      setProject(updatedProject);

      setTitle(updatedProject.name);
      setDescription(updatedProject.description || "");

      // Exit edit mode
      setEditingTitle(false);
      setEditingDescription(false);

      // Update sidebar
      await fetchProjects();

    } catch (error) {
      console.error(
        "Failed to update project:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
        "Failed to save changes."
      );
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <main className="min-h-screen bg-[#0e1015] text-white pt-20 px-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#9ca3af]">
            Loading project...
          </p>
        </div>
      </main>
    );
  }


  if (!project) {
    return (
      <main className="min-h-screen bg-[#0e1015] text-white pt-20 px-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-red-400">
            {error || "Project not found."}
          </p>
        </div>
      </main>
    );
  }


  // -----------------------------
  // PAGE
  // -----------------------------

  return (
    <main className="min-h-screen bg-[#0e1015] text-white pt-20 px-10">

      <div className="max-w-5xl mx-auto">

        {/* ========================= */}
        {/* PROJECT HEADER */}
        {/* ========================= */}

        <div className="flex items-center gap-3">

          {editingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="
                flex-1
                text-4xl
                font-semibold
                bg-transparent
                text-white
                outline-none
              "
            />
          ) : (
            <h1 className="text-4xl font-semibold">
              {project.name}
            </h1>
          )}

          {/* TITLE PENCIL */}

          <button
            onClick={() => setEditingTitle(true)}
            className="
              p-2
              rounded-lg
              text-[#717784]
              hover:text-white
              hover:bg-[#191c22]
              transition
            "
          >
            <Pencil size={18} />
          </button>


          {/* SAVE BUTTON */}

          {hasChanges && (
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="
                ml-auto
                px-4
                py-2
                rounded-lg
                bg-[#f64f12]
                text-black
                text-sm
                font-medium
                hover:bg-[#f36631]
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}

        </div>



        <div className="mt-4 flex items-start gap-3">

          {editingDescription ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
              rows={3}
              className="
                flex-1
                bg-transparent
                text-[#9ca3af]
                outline-none
                resize-none
                text-base
                leading-relaxed
              "
            />
          ) : (
            <p className="text-[#9ca3af] leading-relaxed">
              {project.description ||
                "No description added."}
            </p>
          )}

  
          <button
            onClick={() => setEditingDescription(true)}
            className="
              p-1.5
              rounded-lg
              text-[#717784]
              hover:text-white
              hover:bg-[#191c22]
              transition
            "
          >
            <Pencil size={16} />
          </button>

        </div>


        {error && (
          <p className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}



        <CodeEditor />

      </div>

    </main>
  );
};

export default ProjectPage;