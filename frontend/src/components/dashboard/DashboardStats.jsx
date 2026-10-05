
import React, { useEffect, useState } from "react";
import { FolderKanban, FileCode2 } from "lucide-react";
import api from "../../services/api";

const DashboardStats = ({ summary }) => {
  const repositories = summary?.totals?.repositories ?? 0;
  const codeFiles = summary?.totals?.codeFiles ?? 0;
  const languages = summary?.languages ?? [];

  const [repoList, setRepoList] = useState([]);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await api.get("/repositories");

        const repos = response.data?.repositories ?? [];

        const reposWithFileCount = await Promise.all(
          repos.map(async (repo) => {
            try {
              const filesResponse = await api.get(
                `/repositories/${repo._id}/files`
              );

              const files = filesResponse.data?.codeFiles ?? [];

              return {
                ...repo,
                totalCodeFiles: files.length,
              };
            } catch (error) {
              console.error(
                `Failed to fetch files for ${repo.name}:`,
                error
              );

              return {
                ...repo,
                totalCodeFiles: 0,
              };
            }
          })
        );

        setRepoList(reposWithFileCount);
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      }
    };

    fetchRepositories();
  }, []);

  return (
    <section className="rounded-2xl pt-1.5 border border-[#252830] bg-[#111318]/80 ">
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Repositories */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-[#252830]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1a1c21] border border-[#252830] flex items-center justify-center">
              <FolderKanban size={17} className="text-[#f64f12]" />
            </div>

            <p className="text-sm text-[#9ca3af]">
              Total Repositories
            </p>
          </div>

          <p className="mt-6 text-4xl font-medium text-[#f6f1e8]">
            {repositories}
          </p>

          {/* Repository List */}
          {/* Repository List */}
          <div
  className="mt-6 space-y-3 max-h-[150px] overflow-y-auto"
  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
>
            {repoList.map((repo) => (
              <div
                key={repo._id}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-sm text-[#9ca3af] truncate">
                  {repo.name}
                </span>

                <span className="text-sm font-medium text-[#f6f1e8] whitespace-nowrap">
                  {repo.totalCodeFiles} files
                </span>
              </div>
            ))}

            {repoList.length === 0 && (
              <p className="text-sm text-[#555b66]">
                No repositories yet
              </p>
            )}
          </div>
        </div>

        {/* Code Files */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1a1c21] border border-[#252830] flex items-center justify-center">
              <FileCode2 size={17} className="text-[#f64f12]" />
            </div>

            <p className="text-sm text-[#9ca3af]">
              Total Code Files
            </p>
          </div>

          <p className="mt-6 text-4xl font-medium text-[#f6f1e8]">
            {codeFiles}
          </p>

          {/* Languages */}
          {/* Languages */}
          <div
  className="mt-6 space-y-3 max-h-[150px] overflow-y-auto"
  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
>
            {languages.map((item) => (
              <div
                key={item.language}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-[#9ca3af] capitalize">
                  {item.language}
                </span>

                <span className="text-sm font-medium text-[#f6f1e8]">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default DashboardStats;
