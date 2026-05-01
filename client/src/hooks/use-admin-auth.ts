import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiRequest } from "@/lib/api";

export type AdminAuthResponse = {
  authenticated: boolean;
  credentialsConfigured: boolean;
  usingDefaultCredentials: boolean;
  credentialSource: "environment" | "default";
};

export function useAdminAuth() {
  const { data: authData, isLoading, error } = useQuery<AdminAuthResponse>({
    queryKey: ["/api/admin/auth"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/auth");
      return response.json();
    },
    retry: false,
  });

  const isAuthenticated = authData?.authenticated || false;

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !window.location.pathname.includes('/login')) {
      window.location.href = '/admin/login';
    }
  }, [isLoading, isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    error,
    authData,
  };
}
