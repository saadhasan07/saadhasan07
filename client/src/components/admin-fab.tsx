import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminFab() {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] sm:bottom-6 sm:right-6">
      <Button
        asChild
        className="rounded-full shadow-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 px-4 py-3 sm:py-4"
      >
        <a href="/admin/login" aria-label="Open admin login" className="flex items-center gap-2 whitespace-nowrap">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Admin</span>
        </a>
      </Button>
    </div>
  );
}
