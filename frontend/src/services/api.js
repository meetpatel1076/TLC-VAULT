import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Code-file create/update responses already include newlyUnlockedBadges.
// Publish those unlocks globally so the app can show them on any page,
// without polling a separate endpoint or waiting for a dashboard visit.
api.interceptors.response.use((response) => {
  const badges = response.data?.newlyUnlockedBadges;

  if (Array.isArray(badges) && badges.length > 0 && typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("tlc:badges-unlocked", { detail: { badges } })
    );
  }

  return response;
});

export default api;
