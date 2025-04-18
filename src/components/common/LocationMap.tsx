"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationMapProps {
  initialPosition?: { lat: number; lng: number };
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
}

export default function LocationMap({
  initialPosition = { lat: 5.5913, lng: -0.2087 }, // Default to Ghana coordinates
  onLocationSelect,
  height = "400px",
}: LocationMapProps) {
  const [position, setPosition] = useState(initialPosition);

  // Fix Leaflet marker icons
  useEffect(() => {
    // Fix Leaflet icon issues
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  // LocationMarker component to handle map clicks
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        onLocationSelect(lat, lng);
      },
    });

    return position ? (
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            setPosition(position);
            onLocationSelect(position.lat, position.lng);
          },
        }}
      />
    ) : null;
  }

  return (
    <div className="relative" style={{ height }}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
