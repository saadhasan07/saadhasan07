import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminFab() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        className="rounded-full shadow-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 px-4 py-6"
      >
        <a href="/admin/login" aria-label="Open admin login" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Admin</span>
        </a>
      </Button>
    </div>
  );
}
