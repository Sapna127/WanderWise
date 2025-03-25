// hooks/useAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";

export function useAuth(redirectTo = "/signin") {
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuthToken(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("authToken");
        if (redirectTo) router.push(redirectTo);
      }
    } else if (redirectTo) {
      router.push(redirectTo);
    }
    setLoading(false);
  }, [router, redirectTo]);

  return { authToken, userId, loading };
}