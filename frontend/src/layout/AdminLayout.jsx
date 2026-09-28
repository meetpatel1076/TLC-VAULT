import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";

const AdminLayout = () => {
  return (
    <main className="h-screen overflow-hidden bg-[#0e1015] text-[#f6f1e8]">
      <div className="flex h-full">
        <div className="hidden h-full lg:block">
          <AdminSidebar />
        </div>

        <section className="min-w-0 flex-1 h-full overflow-y-auto no-scrollbar">
          <header className="sticky top-0 z-40 h-[72px] border-b border-zinc-800 bg-[#0e1015]">
            <AdminTopbar />
          </header>

          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default AdminLayout;