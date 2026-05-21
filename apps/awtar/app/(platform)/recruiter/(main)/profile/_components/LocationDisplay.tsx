"use client";

import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useEffect, useRef } from "react";

interface LocationDisplayProps {
  latitude: number;
  longitude: number;
  organizationName: string;
  country?: string;
}

export function LocationDisplay({
  latitude,
  longitude,
  organizationName,
  country,
}: LocationDisplayProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

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

      // Add marker for organization location
      L.marker([latitude, longitude], { icon: DefaultIcon })
        .addTo(map)
        .bindPopup(organizationName);

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

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-600" />
        Organization Location
      </label>

      {/* Location Info */}
      <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
          Coordinates
        </p>
        <p className="mt-1 text-sm text-gray-900 font-semibold">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
        {country && (
          <>
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mt-3">
              Country
            </p>
            <p className="mt-1 text-sm text-gray-900 font-semibold">
              {country}
            </p>
          </>
        )}
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full rounded-lg border border-gray-200 overflow-hidden shadow-sm"
        style={{ height: "400px" }}
      />
    </div>
  );
}
