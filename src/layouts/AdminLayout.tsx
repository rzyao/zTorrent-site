import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { Header } from "./Header";
import { RouteProgressBar } from "@/components/ui/RouteProgressBar";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";

function FaviconInjector() {
  useDynamicFavicon();
  return null;
}

export function AdminLayout() {
  return (
    <SiteConfigProvider>
      <FaviconInjector />
      <div className="flex min-h-screen flex-col bg-[#0F171E]">
        <div className="flex flex-1">
          <AdminSidebar />

          <main className="min-w-0 flex-1 bg-[#0F171E] md:pl-64">
            <Suspense fallback={<RouteProgressBar />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SiteConfigProvider>
  );
}
