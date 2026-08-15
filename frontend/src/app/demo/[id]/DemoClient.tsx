"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { apiFetch } from "../../../utils/api";

export default function DemoClient() {
  const params = useParams();
  const leadId = params?.id as string;

  const [demoData, setDemoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookingModal, setBookingModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  useEffect(() => {
    if (!leadId) return;

    apiFetch(`/api/lead-gen/demo/${leadId}`)
      .then((data) => {
        setDemoData(data.demo_data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [leadId]);


  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#030712", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ width: "50px", height: "50px", borderRadius: "50%", border: "4px solid #ec4899", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
        <p style={{ marginTop: "1rem", fontSize: "1.1rem", color: "#94a3b8", fontWeight: 600 }}>Crafting Custom Corporate Web Architecture...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !demoData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#030712", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800 }}>Demo Website Not Found</h2>
        <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>The requested business demo link is invalid or expired.</p>
      </div>
    );
  }

  const colors = demoData.theme_colors || {
    primary: "#ec4899",
    accent: "#8b5cf6",
    bg: "#0f172a",
    card_bg: "rgba(30, 27, 75, 0.7)",
    gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)"
  };

  const isRestaurant = demoData.theme === "gourmet_restaurant";
  const isSalon = demoData.theme === "luxury_salon";
  const isClinic = demoData.theme === "healthcare_clinic";
  const isEmergency = demoData.theme === "emergency_service";

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingModal(false);
      setBookingSubmitted(false);
      setCustomerName("");
      setCustomerPhone("");
    }, 2500);
  };

  const cleanPhone = demoData.phone ? demoData.phone.replace(/[^0-9]/g, "") : "";

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, color: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.1rem 2.5rem", background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(14px)", position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 900, background: colors.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {demoData.business_name}
        </div>
        <button
          onClick={() => setBookingModal(true)}
          style={{ background: colors.gradient, color: "#fff", border: "none", padding: "0.65rem 1.4rem", borderRadius: "8px", fontWeight: 800, cursor: "pointer" }}
        >
          Book Now
        </button>
      </header>

      <section style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 900, marginBottom: "1rem" }}>{demoData.business_name}</h1>
        <p style={{ fontSize: "1.2rem", color: "#cbd5e1", marginBottom: "2rem" }}>{demoData.tagline}</p>
      </section>

      {bookingModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <div style={{ background: "#1e293b", padding: "2rem", borderRadius: "16px", maxWidth: "400px", width: "100%" }}>
            <h3>Book Appointment</h3>
            <form onSubmit={handleBookingSubmit}>
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your Name" style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0" }} />
              <input type="tel" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Phone" style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0" }} />
              <button type="submit" style={{ width: "100%", padding: "0.7rem", background: colors.primary, color: "#fff", border: "none" }}>Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
