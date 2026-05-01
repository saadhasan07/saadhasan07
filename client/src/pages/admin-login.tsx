import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { Lock, ShieldAlert, User } from "lucide-react";
import type { AdminAuthResponse } from "@/hooks/use-admin-auth";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { toast } = useToast();

  const { data: authStatus } = useQuery<AdminAuthResponse>({
    queryKey: ["/api/admin/auth"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/auth");
      return response.json();
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard",
        });
        window.location.href = "/admin";
      }
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-400">
            Admin Login
          </CardTitle>
          <p className="text-green-600 dark:text-green-300">
            Access the portfolio admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          {authStatus?.usingDefaultCredentials && (
            <div className="mb-4 rounded-lg border border-amber-400/40 bg-amber-50 p-4 text-left dark:bg-amber-950/20">
              <div className="mb-2 flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <ShieldAlert className="h-4 w-4" />
                <span className="font-medium">Default admin login is still active</span>
                <Badge variant="outline" className="border-amber-400/40 text-amber-700 dark:text-amber-200">
                  Temporary
                </Badge>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-200">
                The site is still using the fallback admin credentials. It works for now, but it is safer to set
                <span className="font-mono"> ADMIN_USERNAME </span>
                and
                <span className="font-mono"> ADMIN_PASSWORD </span>
                in your hosting settings later.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-green-600 dark:text-green-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-green-600 dark:text-green-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full prominent-button"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
