"use client";

import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useEffect, useRef } from "react";

interface OrganizationMapProps {
  latitude?: number;
  longitude?: number;
  organizationName: string;
  isDark: boolean;
}

export function OrganizationMap({
  latitude,
  longitude,
  organizationName,
  isDark,
}: OrganizationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!latitude || !longitude || !mapContainer.current) return;

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
      }).setView([latitude, longitude], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker for organization location
      L.marker([latitude, longitude], { icon: DefaultIcon })
        .addTo(map)
        .bindPopup(
          `<strong>${organizationName}</strong><br/>Latitude: ${latitude.toFixed(4)}<br/>Longitude: ${longitude.toFixed(4)}`,
        )
        .openPopup();

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
  }, [latitude, longitude, organizationName]);

  if (!latitude || !longitude) {
    return (
      <div
        className={`rounded-2xl border p-6 transition-colors ${
          isDark ? "border-white/10 bg-white/3" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-blue-500" />
          <h2
            className={`text-lg font-semibold ${isDark ? "text-awtar-white" : "text-gray-900"}`}
          >
            Location
          </h2>
        </div>
        <p className={isDark ? "text-awtar-slate" : "text-gray-600"}>
          No location information available.
        </p>
      </div>
    );
  }

  return (
    <section
      className={`rounded-2xl border p-6 transition-colors ${
        isDark ? "border-white/10 bg-white/3" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-4 w-4 text-blue-500" />
        <h2
          className={`text-lg font-semibold ${
            isDark ? "text-awtar-white" : "text-gray-900"
          }`}
        >
          Location
        </h2>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-awtar-slate" : "text-gray-600"
              }`}
            >
              Latitude
            </p>
            <p
              className={`mt-1 font-mono text-sm ${
                isDark ? "text-awtar-white" : "text-gray-900"
              }`}
            >
              {latitude.toFixed(6)}
            </p>
          </div>
          <div>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-awtar-slate" : "text-gray-600"
              }`}
            >
              Longitude
            </p>
            <p
              className={`mt-1 font-mono text-sm ${
                isDark ? "text-awtar-white" : "text-gray-900"
              }`}
            >
              {longitude.toFixed(6)}
            </p>
          </div>
        </div>
        <div
          ref={mapContainer}
          className="w-full rounded-lg border overflow-hidden"
          style={{
            height: "400px",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb",
          }}
        />
      </div>
    </section>
  );
}
