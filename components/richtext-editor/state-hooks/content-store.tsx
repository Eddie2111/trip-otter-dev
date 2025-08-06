"use client";
import { create } from 'zustand'

export const useContentStore = create((set) => ({
  content: "",
  updateBears: (newContent: string) => set({ content: newContent }),
}));
