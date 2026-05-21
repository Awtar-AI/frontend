"use client";

import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useEffect, useRef } from "react";

interface JobLocationDisplayProps {
  latitude?: number | null;
  longitude?: number | null;
  jobTitle: string;
}

export function JobLocationDisplay({
  latitude,
  longitude,
  jobTitle,
}: JobLocationDisplayProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!latitude || !longitude || !mapContainer.current || mapRef.current)
      return;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix for default marker icons
      const DefaultIcon = L.icon({
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      L.Marker.prototype.setIcon(DefaultIcon);

      const map = L.map(mapContainer.current!, {
        attributionControl: true,
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: false,
      }).setView([latitude, longitude], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker for job location
      L.marker([latitude, longitude], { icon: DefaultIcon })
        .addTo(map)
        .bindPopup(jobTitle);

      // Trigger map resize after a small delay to ensure proper rendering
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, jobTitle]);

  if (!latitude || !longitude) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-600" />
        Job Location
      </label>

      {/* Location Info */}
      <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
          Coordinates
        </p>
        <p className="mt-1 text-sm text-gray-900 font-semibold">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
      </div>

      {/* Map Display */}
      <div
        ref={mapContainer}
        className="w-full border border-gray-100 rounded-lg overflow-hidden"
        style={{ height: "400px" }}
      />
    </div>
  );
}
