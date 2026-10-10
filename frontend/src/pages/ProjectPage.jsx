
import React, { useEffect, useRef, useState } from "react";
import {
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Pencil } from "lucide-react";

import api from "../services/api";
import NewCodeEditor from "../components/NewCodeEditor";
import SavedCodeEditor from "../components/SavedCodeEditor";

const ProjectPage = () => {
  const [searchParams] = useSearchParams();
  const selectedFileId = searchParams.get("file");

  const pageRef = useRef(null);

  const { repoId } = useParams();
  const { fetchProjects } = useOutletContext();

  const [project, setProject] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getFiles = async () => {
    try {
      const { data } = await api.get(`/repositories/${repoId}/files`);
      setFiles(data.codeFiles);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load code files."
      );
    }
  };

  // Scroll to the selected code file when coming from "Continue Your Work"
  useEffect(() => {
    if (!selectedFileId || files.length === 0) return;

    const element = document.getElementById(
      `code-file-${selectedFileId}`
    );

    if (!element) return;

    setTimeout(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }, [selectedFileId, files]);

  // Load repository + files
  useEffect(() => {
    const getProject = async () => {
      try {
        const { data } = await api.get(`/repositories/${repoId}`);

        const p = data.repository;

        setProject(p);
        setTitle(p.name);
        setDescription(p.description || "");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    getProject();
    getFiles();
  }, [repoId]);

  const saveChanges = async () => {
    try {
      setSaving(true);

      const { data } = await api.patch(`/repositories/${repoId}`, {
        name: title.trim(),
        description: description.trim(),
      });

      const updated = data.repository;

      setProject(updated);
      setTitle(updated.name);
      setDescription(updated.description || "");

      setEditingTitle(false);
      setEditingDescription(false);

      await fetchProjects();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save changes."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen min-w-0 w-full overflow-x-hidden bg-primary text-white pt-20 px-4 sm:px-6 lg:px-10 xl:px-20">
        Loading repository...
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen min-w-0 w-full overflow-x-hidden bg-primary text-red-400 pt-20 px-4 sm:px-6 lg:px-10 xl:px-20">
        {error || "Project not found."}
      </main>
    );
  }

  const titleChanged = title.trim() !== project.name;

  const descriptionChanged =
    description.trim() !== (project.description || "");

  return (
    <main
      ref={pageRef}
      className="
        min-h-screen
        min-w-0
        w-full
        max-w-full
        overflow-x-hidden
        bg-primary
        text-white
        pt-20
        px-4
        sm:px-6
        lg:px-10
        xl:px-20
      "
    >
      <div className="w-full max-w-5xl min-w-0 mx-auto mb-6">

        {/* ================= PROJECT TITLE ================= */}
        <div className="flex flex-row items-start gap-2 sm:gap-3 min-w-0">

          <div className="flex-1 min-w-0">
            {editingTitle ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="
                  w-full
                  min-w-0
                  text-base
                  sm:text-3xl
                  lg:text-4xl
                  font-semibold
                  bg-transparent
                  outline-none
                  text-white
                "
              />
            ) : (
              <h1
                className="
                  text-base
                  sm:text-3xl
                  lg:text-4xl
                  font-semibold
                  break-words
                "
              >
                {project.name}
              </h1>
            )}
          </div>

          {/* Title Controls */}
          <div className="shrink-0 flex flex-row items-start gap-1">

            {!editingTitle ? (
              <button
                onClick={() => setEditingTitle(true)}
                className="
                  p-1.5
                  sm:p-2
                  rounded-lg
                  text-[#717784]
                  hover:text-white
                  hover:bg-[#191c22]
                  transition
                "
              >
                <Pencil size={18} />
              </button>
            ) : (
              <>
                {titleChanged && (
                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="
                      px-3
                      py-1.5
                      rounded-lg
                      bg-[#f64f12]
                      text-black
                      text-sm
                      font-medium
                      disabled:opacity-50
                    "
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                )}

                <button
                  onClick={() => {
                    setTitle(project.name);
                    setEditingTitle(false);
                  }}
                  className="
                    px-3
                    py-1.5
                    rounded-lg
                    text-[#9ca3af]
                    text-sm
                    hover:text-white
                    hover:bg-[#191c22]
                  "
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div className="mt-4 flex flex-row items-start gap-2 sm:gap-3 min-w-0">

          <div className="flex-1 min-w-0">
            {editingDescription ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
                rows={3}
                className="
                  w-full
                  min-w-0
                  bg-transparent
                  text-[#9ca3af]
                  outline-none
                  resize-none
                  leading-relaxed
                "
              />
            ) : (
              <p className="text-[#9ca3af] leading-relaxed break-words">
                {project.description || "No description added."}
              </p>
            )}
          </div>

          {/* Description Controls */}
          <div className="shrink-0 flex flex-row items-start gap-1">

            {!editingDescription ? (
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
            ) : (
              <>
                {descriptionChanged && (
                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="
                      px-3
                      py-1.5
                      rounded-lg
                      bg-[#f64f12]
                      text-black
                      text-sm
                      font-medium
                      disabled:opacity-50
                    "
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                )}

                <button
                  onClick={() => {
                    setDescription(project.description || "");
                    setEditingDescription(false);
                  }}
                  className="
                    px-3
                    py-1.5
                    rounded-lg
                    text-[#9ca3af]
                    text-sm
                    hover:text-white
                    hover:bg-[#191c22]
                  "
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-red-400 break-words">
            {error}
          </p>
        )}

        {/* ================= NEW CODE EDITOR ================= */}
        <div className="w-full min-w-0 max-w-full overflow-hidden">
          <NewCodeEditor
            repoId={repoId}
            onFileCreated={getFiles}
            pageRef={pageRef}
          />
        </div>

        {/* ================= SAVED CODE FILES ================= */}
        <div className="mt-10 w-full min-w-0 max-w-full space-y-6">

          {files.map((file) => (
            <div
              key={file._id}
              id={`code-file-${file._id}`}
              className="
                w-full
                min-w-0
                max-w-full
                overflow-hidden
              "
            >
              <SavedCodeEditor
                file={file}
                onUpdated={getFiles}
                onDeleted={getFiles}
                pageRef={pageRef}
              />
            </div>
          ))}

        </div>
      </div>
    </main>
  );
};

export default ProjectPage;
