import React, { useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import api from "../services/api";
import NewCodeEditor from "../components/NewCodeEditor";
import SavedCodeEditor from "../components/SavedCodeEditor";


const ProjectPage = () => {
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
      setError(err.response?.data?.message || "Failed to load code files.");
    }
  };

  useEffect(() => {
    const getProject = async () => {
      try {
        const { data } = await api.get(`/repositories/${repoId}`);
        const p = data.repository;
        setProject(p);
        setTitle(p.name);
        setDescription(p.description || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load project.");
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
      setError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <main className="min-h-screen bg-[#0e1015] text-white pt-20 px-10">
        Loading project...
      </main>
    );

  if (!project)
    return (
      <main className="min-h-screen bg-[#0e1015] text-red-400 pt-20 px-10">
        {error || "Project not found."}
      </main>
    );

  const titleChanged = title.trim() !== project.name;
  const descriptionChanged =
    description.trim() !== (project.description || "");

  return (
    <main ref={pageRef} className="min-h-screen bg-[#0e1015] text-white pt-20 px-10">
      <div className="max-w-5xl mb-6 mx-auto  ">


        <div className="flex items-center gap-3">
          <div className="flex-1">
            {editingTitle ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="w-full text-4xl font-semibold bg-transparent outline-none"
              />
            ) : (
              <h1 className="text-4xl font-semibold">{project.name}</h1>
            )}
          </div>

          <div className="w-32 flex flex-col gap-1">
            {!editingTitle ? (
              <button
                onClick={() => setEditingTitle(true)}
                className="self-end p-2 rounded-lg text-[#717784] hover:text-white hover:bg-[#191c22] transition"
              >
                <Pencil size={18} />
              </button>
            ) : (
              <>
                {titleChanged && (
                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="px-3 py-1.5 rounded-lg bg-[#f64f12] text-black text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                )}

                <button
                  onClick={() => {
                    setTitle(project.name);
                    setEditingTitle(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-[#9ca3af] text-sm hover:text-white hover:bg-[#191c22]"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3">
          <div className="flex-1">
            {editingDescription ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
                rows={3}
                className="w-full bg-transparent text-[#9ca3af] outline-none resize-none leading-relaxed"
              />
            ) : (
              <p className="text-[#9ca3af] leading-relaxed">
                {project.description || "No description added."}
              </p>
            )}
          </div>

          <div className="w-32 flex flex-col gap-1">
            {!editingDescription ? (
              <button
                onClick={() => setEditingDescription(true)}
                className="self-end p-1.5 rounded-lg text-[#717784] hover:text-white hover:bg-[#191c22] transition"
              >
                <Pencil size={16} />
              </button>
            ) : (
              <>
                {descriptionChanged && (
                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="px-3 py-1.5 rounded-lg bg-[#f64f12] text-black text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                )}

                <button
                  onClick={() => {
                    setDescription(project.description || "");
                    setEditingDescription(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-[#9ca3af] text-sm hover:text-white hover:bg-[#191c22]"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <NewCodeEditor
          repoId={repoId}
          onFileCreated={getFiles}
          pageRef={pageRef}

        />
        <div className="mt-10 space-y-6">
          {files.map((file) => (
            <SavedCodeEditor
              key={file._id}
              file={file}
              onUpdated={getFiles}
              onDeleted={getFiles}
              pageRef={pageRef}
            />
          ))}
        </div>
      </div>


    </main>
  );
};

export default ProjectPage;