import { useState, useEffect } from "react";

export interface UserData {
  _id: string;
  email: string;
  name: string;
  phone: string;
  credits: number;
}

export function useUserData(user: { email?: string } | null) {
  const [userData, setUserData] = useState<UserData>({
    _id: "",
    email: "",
    name: "",
    phone: "",
    credits: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
    //   console.log("inside useUserData", user);
      try {
        const idTokenResponse = await fetch("/api/auth/id-token");
        const idTokenData = await idTokenResponse.json();
        const idToken = idTokenData.idToken;
        const authToken = idToken;
        if (!authToken) {
          throw new Error("No authentication token available");
        }

        const response = await fetch(
          "https://profiler-api-production.up.railway.app/api/user/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Profile request failed: ${response.status} ${response.statusText}`);
        }
        const profileData = await response.json();

        setUserData({
          _id: profileData._id || "",
          email: profileData.email || "",
          name: profileData.name || "Customer",
          phone: profileData.phone || "",
          credits: profileData.credits || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    } else {
      setUserData({
        _id: "",
        email: "",
        name: "",
        phone: "",
        credits: 0,
      });
    }
  }, [user]);

  return { userData, loading, error };
}
