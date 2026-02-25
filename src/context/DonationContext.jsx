import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getDonationsFromStorage,
  saveDonationsToStorage,
} from "../utils/storageFallback";

const DonationContext = createContext();

function ensureDefaults(d) {
  return {
    ...d,
    status: d.status || "Pending",
    assignedTo: d.assignedTo || null,
    assignedToId: d.assignedToId || null,
    acceptedByLogistics: d.acceptedByLogistics || null,
    deliveredAt: d.deliveredAt || null,
    acceptedAt: d.acceptedAt || null,
  };
}

export function DonationProvider({ children }) {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const stored = getDonationsFromStorage();
    setDonations(Array.isArray(stored) ? stored.map(ensureDefaults) : []);
  }, []);

  const persist = (next) => {
    setDonations(next);
    saveDonationsToStorage(next);
  };

  const addDonation = (donation) => {
    const newDonation = {
      ...donation,
      id: String(Date.now()),
      donorId: donation.donorId || donation.donor,
      status: "Pending",
      assignedTo: null,
      assignedToId: null,
      acceptedByLogistics: null,
      deliveredAt: null,
      acceptedAt: null,
    };

    persist([newDonation, ...donations.map(ensureDefaults)]);
  };

  const updateStatus = (id, status, extra = {}) => {
    persist(
      donations.map((d) =>
        String(d.id) === String(id)
          ? { ...d, status, ...extra }
          : d
      )
    );
  };

  const assignLogistics = (id, logisticsUser) => {
    persist(
      donations.map((d) =>
        String(d.id) === String(id)
          ? {
              ...d,
              status: "Assigned",
              assignedTo: logisticsUser.name,
              assignedToId: logisticsUser.id,
              logisticsPhone: logisticsUser.phone,
              logisticsLocation: logisticsUser.location,
            }
          : d
      )
    );
  };

  // 📊 Admin Statistics
  const stats = {
    total: donations.length,
    pending: donations.filter(d => d.status === "Pending").length,
    approved: donations.filter(d => d.status === "Approved").length,
    assigned: donations.filter(d => d.status === "Assigned").length,
    accepted: donations.filter(d => d.status === "Accepted by Logistics").length,
    delivered: donations.filter(d => d.status === "Delivered").length,
    cancelled: donations.filter(d =>
      d.status?.includes("Cancelled")
    ).length,
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        addDonation,
        updateStatus,
        assignLogistics,
        stats,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export function useDonations() {
  return useContext(DonationContext);
}