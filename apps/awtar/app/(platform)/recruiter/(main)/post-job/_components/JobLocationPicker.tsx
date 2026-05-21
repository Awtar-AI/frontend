"use client";

import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useController, type UseFormReturn } from "react-hook-form";
import type { CreateJobFormData } from "../schemas/post-job.schema";

interface JobLocationPickerProps {
  form: UseFormReturn<CreateJobFormData>;
  error?: string;
}

export function JobLocationPicker({ form, error }: JobLocationPickerProps) {
  const { field: latField } = useController({
    name: "latitude",
    control: form.control,
  });

  const { field: longField } = useController({
    name: "longitude",
    control: form.control,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name?: string;
  } | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Default location (e.g., center of the world or a specific country)
  const defaultLat = 20;
  const defaultLng = 0;

  // Initialize map when component mounts or modal opens
  useEffect(() => {
    if (!isOpen || !mapContainer.current || mapRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // CSS is already loaded via package import
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
      }).setView(
        [latField.value || defaultLat, longField.value || defaultLng],
        2,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker if location is already selected
      if (latField.value && longField.value) {
        markerRef.current = L.marker([latField.value, longField.value], {
          icon: DefaultIcon,
        })
          .addTo(map)
          .bindPopup("Job Location");
      }

      // Handle map clicks
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;

        // Remove previous marker if exists
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // Add new marker
        markerRef.current = L.marker([lat, lng], { icon: DefaultIcon })
          .addTo(map)
          .bindPopup("Job Location")
          .openPopup();

        // Update form values
        latField.onChange(lat);
        longField.onChange(lng);
        setSelectedLocation({ lat, lng });
        // Trigger validation to clear error
        setTimeout(() => {
          latField.onBlur();
          longField.onBlur();
        }, 0);
      });

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
        markerRef.current = null;
      }
    };
  }, [isOpen, latField, longField]);

  // Handle search with geocoding (simple implementation)
  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchInput,
        )}&format=json&limit=1`,
      );

      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lon);

        latField.onChange(latNum);
        longField.onChange(lngNum);
        setSelectedLocation({ lat: latNum, lng: lngNum, name: display_name });

        // Center map on search result with better zoom
        if (mapRef.current) {
          import("leaflet").then((L) => {
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

            mapRef.current.setView([latNum, lngNum], 13);

            if (markerRef.current) {
              mapRef.current.removeLayer(markerRef.current);
            }

            markerRef.current = L.marker([latNum, lngNum], {
              icon: DefaultIcon,
            })
              .addTo(mapRef.current)
              .bindPopup(display_name)
              .openPopup();
          });
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  return (
    <div id="location-picker" className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700">
        Job Location <span className="text-red-600">*</span>
      </label>

      {/* Display selected location */}
      <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            {selectedLocation ? (
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedLocation.name || "Location Selected"}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedLocation.lat.toFixed(4)},{" "}
                  {selectedLocation.lng.toFixed(4)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Click to select location</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
        >
          {isOpen ? "Close" : "Open Map"}
        </button>
      </div>

      {/* Map Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                Select Job Location
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Search Section */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search for a location (e.g., New York, San Francisco)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Or click on the map to select a location
              </p>
            </div>

            {/* Map Container */}
            <div
              ref={mapContainer}
              className="w-full bg-gray-100"
              style={{ position: "relative", height: "500px" }}
            />

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                disabled={!selectedLocation}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
