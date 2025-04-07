import { create } from "zustand";
import { MarkerType } from "../types/marker";

interface MarkerStore {
  markers: MarkerType[];
  setMarkers: (markers: MarkerType[]) => void;
  addMarker: (marker: MarkerType) => void;
  updatateMarker: (id: number, updatedMarker: Partial<MarkerType>) => void;
  removeMarker: (id: number) => void;
}

export const useMarkerStore = create<MarkerStore>((set) => ({
  markers: [],
  setMarkers: (markers) => set({ markers }),
  addMarker: (marker) => set((state) => ({ markers: [...state.markers, marker] })),
  updatateMarker: (id, updatedMarker) =>
    set((state) => ({
      markers: state.markers.map((marker) =>
        marker.id === id ? { ...marker, ...updatedMarker } : marker
      ),
    })),
  removeMarker: (id) =>
    set((state) => ({
      markers: state.markers.filter((marker) => marker.id !== id),
    })),
}));
