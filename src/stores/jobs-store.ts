"use client";

import { create } from "zustand";

import type { EmploymentType } from "@/types/api";


export type EmploymentFilter = EmploymentType | "All";

export const EMPLOYMENT_FILTERS: EmploymentFilter[] = [
  "All",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

interface JobsState {
  search: string;
  employmentType: EmploymentFilter;
  page: number;
  pageSize: number;
  setSearch: (search: string) => void;
  setEmploymentType: (employmentType: EmploymentFilter) => void;
  setPage: (page: number) => void;
  clearFilters: () => void;
}


export const useJobsStore = create<JobsState>((set) => ({
  search: "",
  employmentType: "All",
  page: 1,
  pageSize: 6,
  setSearch: (search) => set({ search, page: 1 }),
  setEmploymentType: (employmentType) => set({ employmentType, page: 1 }),
  setPage: (page) => set({ page }),
  clearFilters: () => set({ search: "", employmentType: "All", page: 1 }),
}));
