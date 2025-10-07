import DashboardNavbar from "@/components/common/DashboardNavbar";
import { AppSidebar } from "@/components/common/DashboardSidebar";
import POSNavbar from "@/components/common/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { cookies } from "next/headers";

function decodeJwt(token?: string): any | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = Buffer.from(parts[1], "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Server-side detection of transitional onboarding state
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt")?.value;
  const tempStoreId = cookieStore.get("storeCtx")?.value;
  const payload = decodeJwt(jwt);
  const storeIdInJwt = payload?.storeId;
  const showTransitionalBanner = Boolean(tempStoreId && !storeIdInJwt);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <DashboardNavbar />
        {showTransitionalBanner && (
          <div className="mx-2 mt-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-600 dark:bg-amber-950/60 dark:text-amber-200">
            <p className="font-medium mb-1">Finalizing your store setup…</p>
            <p>
              Your store (ID: <span className="font-mono">{tempStoreId}</span>)
              was created and we&apos;re waiting for your session token to
              refresh. Some pages may be limited until then. Refresh this page
              in a few seconds – this notice disappears automatically once your
              session updates.
            </p>
            <p className="mt-2 text-xs opacity-80">
              (Temporary bridge active via <code>storeCtx</code> cookie)
            </p>
          </div>
        )}
        <div className="flex flex-1 flex-col px-2">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-4">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
