import { useCallback } from "react";
import { useSession } from "next-auth/react";

export function useRefreshAuth() {
  const { data: session, update } = useSession();

  const refreshAuthData = useCallback(async () => {
    if (!session) return;

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh session");
      }

      const updatedSession = await response.json();
      await update(updatedSession);
    } catch (error) {
      console.error("Error refreshing auth data:", error);
      throw error;
    }
  }, [session, update]);

  return { refreshAuthData };
}
