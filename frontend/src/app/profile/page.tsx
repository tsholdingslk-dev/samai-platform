"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, getToken, removeToken } from "../../utils/api";

type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await apiFetch("/auth/me");
        setUser(data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const logout = () => {
    removeToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="glass-panel" style={{ width: "100%", maxWidth: "500px" }}>
          <div className="skeleton" style={{ height: "200px", borderRadius: "12px" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="glass-panel" style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
          <p style={{ color: "var(--error)" }}>{error}</p>
          <Link href="/chat" className="btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
            Back to Chat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "500px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>My Profile</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your account settings</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="input-group">
            <label>Email</label>
            <div style={{ 
              padding: "0.8rem 1rem", 
              background: "rgba(0,0,0,0.2)", 
              borderRadius: "8px",
              border: "1px solid var(--border)",
              color: "var(--text-main)"
            }}>
              {user?.email}
            </div>
          </div>

          <div className="input-group">
            <label>Role</label>
            <div style={{ 
              padding: "0.8rem 1rem", 
              background: "rgba(0,0,0,0.2)", 
              borderRadius: "8px",
              border: "1px solid var(--border)",
              color: "var(--text-main)",
              textTransform: "capitalize"
            }}>
              {user?.role}
            </div>
          </div>

          <div className="input-group">
            <label>Member Since</label>
            <div style={{ 
              padding: "0.8rem 1rem", 
              background: "rgba(0,0,0,0.2)", 
              borderRadius: "8px",
              border: "1px solid var(--border)",
              color: "var(--text-main)"
            }}>
              {user ? new Date(user.created_at).toLocaleDateString() : ""}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/chat" className="btn-primary" style={{ flex: 1, textAlign: "center" }}>
            Back to Chat
          </Link>
          <button onClick={logout} className="btn-primary" style={{ 
            flex: 1, 
            background: "transparent", 
            border: "2px solid var(--error)",
            color: "var(--error)"
          }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
